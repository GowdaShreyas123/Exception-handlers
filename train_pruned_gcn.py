# train_pruned_gcn.py
import os
import numpy as np
import torch
import torch.nn.functional as F
from torch import nn
from torch_geometric.data import Data, InMemoryDataset, DataLoader
from torch_geometric.nn import GCNConv
from sklearn.model_selection import train_test_split
from typing import List, Tuple

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ---------- Helpers: convert adjacency -> edge_index (top-k pruning per node) ----------
def topk_edge_index_from_adj(A: np.ndarray, k: int = 8, symmetric=True) -> Tuple[torch.LongTensor, torch.FloatTensor]:
    """
    For each node i, keep top-k absolute-weight edges (excluding self-loop).
    Returns edge_index (2 x E) and edge_weight (E,)
    """
    N = A.shape[0]
    assert A.shape[0] == A.shape[1]
    A_abs = np.abs(A.copy())
    np.fill_diagonal(A_abs, 0.0)
    mask = np.zeros_like(A_abs, dtype=bool)
    for i in range(N):
        row = A_abs[i]
        if k >= N - 1:
            top_idx = np.where(row > 0)[0]
        else:
            top_idx = np.argpartition(-row, kth=min(k, N-2))[:k]
        mask[i, top_idx] = True

    # keep only indices where either i->j or j->i (make symmetric)
    if symmetric:
        mask = np.logical_or(mask, mask.T)

    src, dst = np.nonzero(mask)
    edge_index = torch.tensor(np.vstack([src, dst]), dtype=torch.long)
    edge_weight = torch.tensor(A[src, dst], dtype=torch.float)
    return edge_index, edge_weight

# ---------- Dataset class for many subjects ----------
class UnifiedGraphDataset(InMemoryDataset):
    def __init__(self, root: str, pre_transform=None):
        super().__init__(root, transform=None, pre_transform=pre_transform)
        self.root = root
        self.data_list = self._discover_graphs()

    def _discover_graphs(self):
        """
        Expects:
        1. Single subject mode: root directly contains X_unified.npy, A_unified.npy
        2. Multi-subject mode: root/subjects/subject_id/ with X_unified.npy, A_unified.npy
        """
        data_list = []
        
        # Check if this is a single subject directory (contains X_unified.npy directly)
        x_unified = os.path.join(self.root, "X_unified.npy")
        a_unified = os.path.join(self.root, "A_unified.npy")
        
        if os.path.exists(x_unified) and os.path.exists(a_unified):
            # Single subject mode
            print(f"Single subject mode detected in: {self.root}")
            # Use a default label of 0 if label.txt doesn't exist
            label_file = os.path.join(self.root, "label.txt")
            data_list.append((x_unified, a_unified, label_file))
            return data_list
        
        # Multi-subject pattern: per-subject directory
        subj_root = os.path.join(self.root, "subjects")
        if os.path.exists(subj_root):
            for s in sorted(os.listdir(subj_root)):
                sd = os.path.join(subj_root, s)
                if not os.path.isdir(sd):
                    continue
                xp = os.path.join(sd, "X_unified.npy")
                ap = os.path.join(sd, "A_unified.npy")
                labp = os.path.join(sd, "label.txt")
                if os.path.exists(xp) and os.path.exists(ap):
                    data_list.append((xp, ap, labp))
        
        # Fallback: look for files like X_unified_*.npy in root
        if not data_list:
            xs = sorted([p for p in os.listdir(self.root) if p.startswith("X_unified") and p.endswith(".npy")])
            for xp in xs:
                basename = xp.replace("X_unified", "").replace(".npy", "")
                ap = os.path.join(self.root, "A_unified" + basename + ".npy")
                labp = os.path.join(self.root, "label" + basename + ".txt")
                if os.path.exists(ap):
                    data_list.append((os.path.join(self.root, xp), ap, labp))
        
        return data_list

    def __len__(self):
        return len(self.data_list)

    def __getitem__(self, idx):
        xp, ap, labp = self.data_list[idx]
        X = np.load(xp).astype(np.float32)   # (N, F)
        A = np.load(ap).astype(np.float32)   # (N, N)
        
        # Handle label file - default to 0 if doesn't exist
        if os.path.exists(labp):
            with open(labp, 'r') as f:
                y = int(f.read().strip())
        else:
            print(f"Warning: {labp} not found, using default label=0")
            y = 0
        
        # build edge_index, edge_weight (prune edges to keep it light)
        edge_index, edge_weight = topk_edge_index_from_adj(A, k=8, symmetric=True)
        x = torch.tensor(X, dtype=torch.float)
        data = Data(x=x, edge_index=edge_index, edge_attr=edge_weight, y=torch.tensor([y], dtype=torch.long))
        return data

# ---------- Small GCN model ----------
class SmallGCN(nn.Module):
    def __init__(self, in_feats: int, hidden: int = 32, num_classes: int = 2, dropout: float = 0.3):
        super().__init__()
        self.conv1 = GCNConv(in_feats, hidden)
        self.conv2 = GCNConv(hidden, hidden // 2)
        self.fc = nn.Linear(hidden // 2, num_classes)
        self.dropout = dropout

    def forward(self, data):
        x, edge_index = data.x.to(DEVICE), data.edge_index.to(DEVICE)
        x = F.relu(self.conv1(x, edge_index))
        x = F.dropout(x, p=self.dropout, training=self.training)
        x = F.relu(self.conv2(x, edge_index))
        # global mean pool (simple)
        g = x.mean(dim=0)
        out = self.fc(g)
        return out

# ---------- Magnitude pruning function (global magnitude) ----------
def magnitude_prune(model: nn.Module, sparsity: float = 0.5):
    """
    Zero out the smallest |w| weights globally across model parameters (except biases).
    sparsity: fraction of weights to set to zero (0.0 no prune, 0.5 prune 50%).
    """
    # collect weights
    tensors = []
    for name, p in model.named_parameters():
        if 'bias' in name or p.numel() == 0:
            continue
        tensors.append(p.detach().cpu().abs().flatten())
    if not tensors:
        return
    all_weights = torch.cat(tensors)
    k = int(all_weights.numel() * sparsity)
    if k == 0:
        return
    thr = torch.kthvalue(all_weights, k).values.item()
    # zero out param elements with abs <= thr (in-place)
    with torch.no_grad():
        for name, p in model.named_parameters():
            if 'bias' in name or p.numel() == 0:
                continue
            mask = p.abs() <= thr
            p[mask] = 0.0

# ---------- Training / evaluation ----------
def train_epoch(model, loader, opt, criterion):
    model.train()
    total_loss = 0.0
    correct = 0
    n = 0
    for data in loader:
        data = data.to(DEVICE)
        opt.zero_grad()
        logits = model(data)
        y = data.y.to(DEVICE).view(-1)
        loss = criterion(logits.unsqueeze(0), y) if logits.dim()==1 else criterion(logits, y)
        loss.backward()
        opt.step()
        total_loss += float(loss.item())
        pred = logits.argmax().item()
        correct += int(pred == int(y.item()))
        n += 1
    return total_loss / max(1, n), correct / max(1, n)

def eval_epoch(model, loader, criterion):
    model.eval()
    total_loss = 0.0
    correct = 0
    n = 0
    with torch.no_grad():
        for data in loader:
            data = data.to(DEVICE)
            logits = model(data)
            y = data.y.to(DEVICE).view(-1)
            loss = criterion(logits.unsqueeze(0), y) if logits.dim()==1 else criterion(logits, y)
            total_loss += float(loss.item())
            pred = logits.argmax().item()
            correct += int(pred == int(y.item()))
            n += 1
    return total_loss / max(1, n), correct / max(1, n)

# ---------- Main runner (example) ----------
def run_training(root_dir, epochs=50, batch_size=1, lr=1e-3, prune_after=10, prune_sparsity=0.5):
    # dataset discovery
    ds = UnifiedGraphDataset(root_dir)
    n = len(ds)
    print(f"Found {n} graph(s)")
    if n == 0:
        raise RuntimeError(f"No graphs found in {root_dir}. Expected X_unified.npy and A_unified.npy")
    
    # For single subject, we can't do train/test split properly
    # So we'll just use the same data for both (or skip evaluation)
    if n == 1:
        print("Warning: Only 1 subject found. Using same data for train and test (no proper validation).")
        train_loader = DataLoader([ds[0]], batch_size=batch_size)
        test_loader = DataLoader([ds[0]], batch_size=batch_size)
    else:
        # simple split
        idx = list(range(n))
        train_idx, test_idx = train_test_split(idx, test_size=0.2, random_state=42)
        train_loader = DataLoader([ds[i] for i in train_idx], batch_size=batch_size)
        test_loader = DataLoader([ds[i] for i in test_idx], batch_size=batch_size)
    
    # build model
    # detect feature dim from first sample
    tmp = ds[0]
    in_feats = tmp.x.shape[1]
    print(f"Input features: {in_feats}, Nodes: {tmp.x.shape[0]}, Edges: {tmp.edge_index.shape[1]}")
    
    model = SmallGCN(in_feats=in_feats).to(DEVICE)
    opt = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)
    criterion = nn.CrossEntropyLoss()
    
    for ep in range(1, epochs+1):
        tr_loss, tr_acc = train_epoch(model, train_loader, opt, criterion)
        te_loss, te_acc = eval_epoch(model, test_loader, criterion)
        print(f"EP{ep:03d} train_loss={tr_loss:.4f} train_acc={tr_acc:.3f}  test_loss={te_loss:.4f} test_acc={te_acc:.3f}")
        
        if ep == prune_after:
            print(f"Applying magnitude pruning at epoch {ep}, sparsity={prune_sparsity}")
            magnitude_prune(model, sparsity=prune_sparsity)
    
    # final prune (optional)
    print("Final magnitude prune at sparsity 0.5")
    magnitude_prune(model, sparsity=0.5)
    
    # save model
    save_path = os.path.join(root_dir, "pruned_gcn_state.pt")
    torch.save(model.state_dict(), save_path)
    print(f"Saved model to {save_path}")
    return model

# If run as script
if __name__ == "__main__":
    # Point to the single subject directory
    root_dir = "/home/nuvo/workspaces/ss95211b/exception_handlers/processed_data/sub-pixar001"
    
    # Create label.txt if it doesn't exist (default to class 0)
    label_path = os.path.join(root_dir, "label.txt")
    if not os.path.exists(label_path):
        print(f"Creating default label.txt with class 0")
        with open(label_path, 'w') as f:
            f.write('0')
    
    model = run_training(root_dir, epochs=30, batch_size=1, lr=1e-3, prune_after=10, prune_sparsity=0.5)