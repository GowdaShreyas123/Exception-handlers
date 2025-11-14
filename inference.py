# inference_single_subject.py
import os
import numpy as np
import torch
import torch.nn.functional as F
from torch import nn
from torch_geometric.data import Data
from torch_geometric.nn import GCNConv
import argparse

# --------- copy of topk edge builder used in training ----------
def topk_edge_index_from_adj(A: np.ndarray, k: int = 8, symmetric=True):
    N = A.shape[0]
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
    if symmetric:
        mask = np.logical_or(mask, mask.T)
    src, dst = np.nonzero(mask)
    edge_index = torch.tensor(np.vstack([src, dst]), dtype=torch.long)
    edge_weight = torch.tensor(A[src, dst], dtype=torch.float)
    return edge_index, edge_weight

# --------- SmallGCN class (same as training) ----------
class SmallGCN(nn.Module):
    def __init__(self, in_feats: int, hidden: int = 32, num_classes: int = 2, dropout: float = 0.3):
        super().__init__()
        self.conv1 = GCNConv(in_feats, hidden)
        self.conv2 = GCNConv(hidden, hidden // 2)
        self.fc = nn.Linear(hidden // 2, num_classes)
        self.dropout = dropout

    def forward(self, data):
        x = data.x.to(next(self.parameters()).device)
        edge_index = data.edge_index.to(next(self.parameters()).device)
        x = F.relu(self.conv1(x, edge_index))
        x = F.dropout(x, p=self.dropout, training=self.training)
        x = F.relu(self.conv2(x, edge_index))
        g = x.mean(dim=0)          # simple global mean pooling
        out = self.fc(g)
        return out

# --------- Inference routine ----------
def infer(x_path, a_path, model_path, k=8, device='cpu', label_map=None):
    device = torch.device(device)
    # load arrays
    X = np.load(x_path).astype(np.float32)   # shape (N, F)
    A = np.load(a_path).astype(np.float32)   # shape (N, N)

    # build graph (same pruning used at training)
    edge_index, edge_weight = topk_edge_index_from_adj(A, k=k, symmetric=True)

    # build data object
    data = Data(x=torch.tensor(X, dtype=torch.float), edge_index=edge_index)

    # build model and load weights
    in_feats = X.shape[1]
    model = SmallGCN(in_feats=in_feats)
    model.to(device)
    state = torch.load(model_path, map_location=device)
    # If state_dict was saved directly (state_dict), load:
    try:
        model.load_state_dict(state)
    except RuntimeError:
        # maybe saved full model; attempt to load keys that match
        model.load_state_dict(state, strict=False)

    model.eval()
    with torch.no_grad():
        logits = model(data.to(device))     # shape (num_classes,)
        probs = torch.softmax(logits, dim=-1).cpu().numpy()
        pred = int(torch.argmax(logits).item())

    # Label mapping
    if label_map is None:
        label_map = {0: "class_0", 1: "class_1"}  # replace with your meaning
    pred_label = label_map.get(pred, str(pred))

    result = {
        "logits": logits.cpu().numpy().tolist(),
        "probabilities": probs.tolist(),
        "predicted_class_index": pred,
        "predicted_class_label": pred_label
    }
    return result

# --------- CLI ----------
if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--x", required=True, help="Path to X_unified.npy")
    p.add_argument("--a", required=True, help="Path to A_unified.npy")
    p.add_argument("--model", required=True, help="Path to pruned_gcn_state.pt (or state_dict)")
    p.add_argument("--k", type=int, default=8, help="top-k edges per node used to build edge_index")
    p.add_argument("--device", default='cpu', help="cpu or cuda")
    p.add_argument("--label0", default="control", help="label name for class 0")
    p.add_argument("--label1", default="depressed", help="label name for class 1")
    args = p.parse_args()

    label_map = {0: args.label0, 1: args.label1}
    out = infer(args.x, args.a, args.model, k=args.k, device=args.device, label_map=label_map)
    import json, os
    print(json.dumps(out, indent=2))
    # also print human readable
    print(f\"Predicted: {out['predicted_class_label']} (index {out['predicted_class_index']})\")
    print(f\"P(class0={args.label0})={out['probabilities'][0]:.4f}, P(class1={args.label1})={out['probabilities'][1]:.4f}\")