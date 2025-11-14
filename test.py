# full_pipeline_hungarian_unified.py
"""
End-to-end pipeline for:
 - Building multi-feature cost matrix between two atlases (anatomical + spectral + functional + topological)
 - Solving correspondence with the Hungarian algorithm
 - Building unified (pseudo-atlas) timeseries, adjacency (A) and node features (X)
 - Saving outputs for downstream training

Notes:
 - Adapt file paths for your BOLD and atlas NIFTI/labels files.
 - This script focuses on alignment + unified representations. A GAT training loop is provided as a commented stub
   because environments vary (PyG availability, GPU, etc.).

Dependencies:
 numpy, scipy, nibabel, nilearn, scikit-learn, h5py
 Optional for GAT: torch, torch_geometric

Run example:
 python full_pipeline_hungarian_unified.py

Customize the DATA_ROOT and atlas paths in the `if __name__ == '__main__'` block.
"""

import os
import numpy as np
import nibabel as nib
from scipy.spatial.distance import cdist
from scipy import linalg
from scipy.stats import zscore
from sklearn.preprocessing import normalize
from scipy.optimize import linear_sum_assignment
from nilearn.maskers import NiftiLabelsMasker
from scipy.stats import skew, kurtosis
import h5py

# ------------------------- Utility functions (cost building) -------------------------
def load_confounds(conf_path):
    with h5py.File(conf_path, 'r') as f:
        if 'R' in f:
            confounds = np.array(f['R'])
        elif 'X' in f:
            confounds = np.array(f['X'])
        else:
            raise ValueError('Confound matrix not found in MAT file.')
    if confounds.shape[0] < confounds.shape[1]:
        confounds = confounds.T
    return confounds


def compute_fc_from_ts(ts):
    ts_z = zscore(ts, axis=0, ddof=1)
    ts_z = np.nan_to_num(ts_z)
    if ts_z.shape[1] == 0:
        return np.zeros((0,0))
    R = np.corrcoef(ts_z.T)
    np.fill_diagonal(R, 1.0)
    return R


def compute_centroids(atlas_img):
    if isinstance(atlas_img, str):
        atlas_nii = nib.load(atlas_img)
    else:
        atlas_nii = atlas_img
    data = atlas_nii.get_fdata()
    affine = atlas_nii.affine
    labels = np.unique(data)
    labels = labels[labels != 0]
    centroids = []
    valid_labels = []
    for lab in labels:
        mask = (data == lab)
        if mask.sum() == 0:
            continue
        vox_coords = np.column_stack(np.nonzero(mask))
        centroid_vox = vox_coords.mean(axis=0)
        centroid_world = nib.affines.apply_affine(affine, centroid_vox)
        centroids.append(centroid_world)
        valid_labels.append(int(lab))
    return np.array(valid_labels), np.array(centroids)


def spectral_embeddings_from_fc(fc, n_components=10):
    A = np.abs(fc)
    np.fill_diagonal(A, 0.0)
    A = (A + A.T) / 2.0
    row_sums = A.sum(axis=1)
    with np.errstate(divide='ignore'):
        D_sqrt_inv = np.diag(1.0 / np.sqrt(np.where(row_sums > 0, row_sums, 1.0)))
    S = D_sqrt_inv @ A @ D_sqrt_inv
    S = (S + S.T) / 2.0
    n = min(n_components, max(1, S.shape[0] - 1))
    if n <= 0:
        return np.zeros((S.shape[0], 1))
    vals, vecs = linalg.eigh(S)
    embedding = vecs[:, -n:]
    embedding = normalize(embedding)
    return embedding


def compute_spectral_cost(fc_h, fc_s, n_components=10):
    emb_h = spectral_embeddings_from_fc(fc_h, n_components=n_components)
    emb_s = spectral_embeddings_from_fc(fc_s, n_components=n_components)
    k = max(emb_h.shape[1], emb_s.shape[1])
    if emb_h.shape[1] < k:
        emb_h = np.pad(emb_h, ((0,0),(0,k-emb_h.shape[1])), constant_values=0.0)
    if emb_s.shape[1] < k:
        emb_s = np.pad(emb_s, ((0,0),(0,k-emb_s.shape[1])), constant_values=0.0)
    spec_cost = cdist(emb_h, emb_s, metric='euclidean')
    return spec_cost


def compute_functional_crosscorr_cost(ts_h, ts_s):
    th = zscore(ts_h, axis=0, ddof=1)
    ts = zscore(ts_s, axis=0, ddof=1)
    th = np.nan_to_num(th)
    ts = np.nan_to_num(ts)
    T = th.shape[0]
    if T <= 1:
        return np.ones((th.shape[1], ts.shape[1]))
    cross = (th.T @ ts) / (T - 1)
    cross = np.clip(cross, -1.0, 1.0)
    func_cost = 1.0 - np.abs(cross)
    return func_cost


def compute_topological_cost(fc_h, fc_s, topo_k=10, tau=1.0):
    def diffusion_kernel(fc):
        A = np.abs(fc)
        np.fill_diagonal(A, 0.0)
        D = np.diag(A.sum(axis=1))
        L = D - A
        # matrix exponential may be expensive for big graphs
        K = linalg.expm(-tau * L)
        return K
    K_h = diffusion_kernel(fc_h)
    K_s = diffusion_kernel(fc_s)
    def topk_eigvecs(K, k):
        k_eff = min(k, K.shape[0]-1) if K.shape[0] > 1 else 1
        vals, vecs = linalg.eigh(K)
        vecs_top = vecs[:, -k_eff:]
        if vecs_top.shape[1] < k:
            vecs_top = np.pad(vecs_top, ((0,0),(0,k-vecs_top.shape[1])), constant_values=0.0)
        vecs_top = normalize(vecs_top)
        return vecs_top
    emb_h = topk_eigvecs(K_h, topo_k)
    emb_s = topk_eigvecs(K_s, topo_k)
    topo_cost = cdist(emb_h, emb_s, metric='euclidean')
    return topo_cost


def minmax_norm(mat):
    mn = np.nanmin(mat)
    mx = np.nanmax(mat)
    if np.isfinite(mn) and np.isfinite(mx) and mx - mn > 0:
        return (mat - mn) / (mx - mn)
    else:
        return np.zeros_like(mat)

# ------------------------- Build cost matrix (wrapper) -------------------------
def build_cost_matrix_from_timeseries(ts_harvard, ts_schaefer,
                                      atlas_harvard_img, atlas_schaefer_img,
                                      weights=(0.2, 0.3, 0.4, 0.1),
                                      spectral_k=10,
                                      topo_k=10):
    fc_h = compute_fc_from_ts(ts_harvard)
    fc_s = compute_fc_from_ts(ts_schaefer)
    labels_h, centroids_h = compute_centroids(atlas_harvard_img)
    labels_s, centroids_s = compute_centroids(atlas_schaefer_img)
    if fc_h.shape[0] != centroids_h.shape[0]:
        raise RuntimeError(f"Harvard FC size {fc_h.shape[0]} != n_centroids {centroids_h.shape[0]}")
    if fc_s.shape[0] != centroids_s.shape[0]:
        raise RuntimeError(f"Schaefer FC size {fc_s.shape[0]} != n_centroids {centroids_s.shape[0]}")
    anat_cost = cdist(centroids_h, centroids_s, metric='euclidean')
    anat_cost = minmax_norm(anat_cost)
    spec_cost = compute_spectral_cost(fc_h, fc_s, n_components=spectral_k)
    spec_cost = minmax_norm(spec_cost)
    func_cost = compute_functional_crosscorr_cost(ts_harvard, ts_schaefer)
    func_cost = minmax_norm(func_cost)
    topo_cost = compute_topological_cost(fc_h, fc_s, topo_k=topo_k, tau=1.0)
    topo_cost = minmax_norm(topo_cost)
    w_anat, w_spec, w_func, w_topo = weights
    cost_matrix = (
        w_anat * anat_cost +
        w_spec * spec_cost +
        w_func * func_cost +
        w_topo * topo_cost
    )
    cost_matrix = minmax_norm(cost_matrix)
    return {
        'cost_matrix': cost_matrix,
        'anat_cost': anat_cost,
        'spec_cost': spec_cost,
        'func_cost': func_cost,
        'topo_cost': topo_cost,
        'centroids_h': centroids_h,
        'centroids_s': centroids_s,
        'labels_h': labels_h,
        'labels_s': labels_s,
        'fc_h': fc_h,
        'fc_s': fc_s
    }

# ------------------------- Hungarian + mapping -------------------------
def run_hungarian(cost_matrix):
    row_ind, col_ind = linear_sum_assignment(cost_matrix)
    return row_ind, col_ind


def build_mapping_dict(row_ind, col_ind, labels_h, labels_s):
    mapping_label = {int(labels_h[r]): int(labels_s[c]) for r, c in zip(row_ind, col_ind)}
    mapping_index = {int(r): int(c) for r, c in zip(row_ind, col_ind)}
    return {'label_map': mapping_label, 'index_map': mapping_index}

# ------------------------- Build unified representations -------------------------
def reorder_timeseries_to_pseudo(ts_source, index_map, n_pseudo, fill_with_zeros=True):
    T, n_source = ts_source.shape
    pseudo_ts = np.zeros((T, n_pseudo), dtype=ts_source.dtype)
    for tgt_idx in range(n_pseudo):
        if tgt_idx in index_map:
            src_idx = index_map[tgt_idx]
            if 0 <= src_idx < n_source:
                pseudo_ts[:, tgt_idx] = ts_source[:, src_idx]
        else:
            if not fill_with_zeros:
                pseudo_ts[:, tgt_idx] = np.nan
    return pseudo_ts


def build_adjacency_from_ts(pseudo_ts, fisher_z=True):
    ts_z = zscore(pseudo_ts, axis=0, ddof=1)
    ts_z = np.nan_to_num(ts_z)
    if ts_z.shape[1] == 0:
        return np.zeros((0,0))
    corr = np.corrcoef(ts_z.T)
    np.fill_diagonal(corr, 1.0)
    if fisher_z:
        corr = np.arctanh(np.clip(corr, -0.999999, 0.999999))
    return corr


def compute_node_features(pseudo_ts, pseudo_adj, include_coords=None, spectral_k=6):
    N = pseudo_ts.shape[1]
    means = np.nanmean(pseudo_ts, axis=0)
    stds = np.nanstd(pseudo_ts, axis=0)
    skews = skew(pseudo_ts, axis=0, nan_policy='omit')
    kurts = kurtosis(pseudo_ts, axis=0, nan_policy='omit')
    absA = np.abs(pseudo_adj)
    strengths = absA.sum(axis=1)
    with np.errstate(divide='ignore', invalid='ignore'):
        A3 = np.linalg.matrix_power(np.nan_to_num(pseudo_adj), 3)
        diag_A3 = np.real(np.diag(A3))
        deg = (absA > 0).sum(axis=1)
        clustering = np.zeros(N)
        denom = deg * (deg - 1)
        valid = denom > 0
        clustering[valid] = diag_A3[valid] / denom[valid]
    D = np.diag(absA.sum(axis=1))
    L = D - pseudo_adj
    L = (L + L.T) / 2.0
    k = min(spectral_k, N-1) if N > 1 else 1
    if N > 1:
        vals, vecs = np.linalg.eigh(L)
        spec_feats = vecs[:, :k]
    else:
        spec_feats = np.zeros((N, k))
    parts = [means.reshape(N), stds.reshape(N), skews.reshape(N), kurts.reshape(N),
             strengths.reshape(N), clustering.reshape(N), spec_feats]
    if include_coords is not None:
        parts.append(include_coords.reshape(N, -1))
    X = np.hstack([np.atleast_2d(p).T if p.ndim == 1 else p for p in parts])
    X = np.nan_to_num(X)
    return X

# ------------------------- High level runner -------------------------
def run_hungarian_and_build_unified(result, save_dir, bold_path=None, confounds=None,
                                    fisher_z=True, pseudo_n=None, fill_with_zeros=True):
    os.makedirs(save_dir, exist_ok=True)
    cost = result['cost_matrix']
    labels_h = result['labels_h']
    labels_s = result['labels_s']
    row_ind, col_ind = run_hungarian(cost)
    mapping = build_mapping_dict(row_ind, col_ind, labels_h, labels_s)
    map_save = os.path.join(save_dir, 'atlas_mapping.npz')
    label_keys = np.array(list(mapping['label_map'].keys()), dtype=int)
    label_vals = np.array(list(mapping['label_map'].values()), dtype=int)
    index_src = np.array(list(mapping['index_map'].keys()), dtype=int)
    index_tgt = np.array(list(mapping['index_map'].values()), dtype=int)
    np.savez_compressed(map_save, label_keys=label_keys, label_vals=label_vals,
                        index_src=index_src, index_tgt=index_tgt)
    out = {'mapping_path': map_save, 'mapping': mapping}
    if pseudo_n is None:
        pseudo_n = cost.shape[0]
    index_map = {int(r): int(c) for r, c in zip(row_ind, col_ind)}
    out['index_map'] = index_map
    if bold_path is not None and confounds is not None:
        atlas_source = result.get('atlas_harvard_img') or result.get('atlas_source_path')
        masker_src = NiftiLabelsMasker(labels_img=atlas_source, standardize=True, detrend=True, t_r=2.0)
        ts_src = masker_src.fit_transform(bold_path, confounds=confounds)
        pseudo_ts = reorder_timeseries_to_pseudo(ts_src, index_map, pseudo_n, fill_with_zeros=fill_with_zeros)
        A = build_adjacency_from_ts(pseudo_ts, fisher_z=fisher_z)
        X = compute_node_features(pseudo_ts, A, include_coords=None, spectral_k=6)
        np.savez_compressed(os.path.join(save_dir, 'pseudo_subject_npz.npz'), pseudo_ts=pseudo_ts, A=A, X=X)
        out.update({'pseudo_ts_path': os.path.join(save_dir, 'pseudo_subject_npz.npz'),
                    'A_path': os.path.join(save_dir, 'pseudo_subject_npz.npz'),
                    'X_path': os.path.join(save_dir, 'pseudo_subject_npz.npz'),
                    'X': X, 'A': A, 'pseudo_ts': pseudo_ts})
    return out

# ------------------------- (Optional) GAT training stub -------------------------
# The following is a minimal example to show how you might plug X,A into a PyTorch GAT.
# It is commented out because not all environments will have torch / torch_geometric installed.

# def train_gat_example(X, A, y, epochs=100):
#     import torch
#     from torch_geometric.data import Data, DataLoader
#     from torch_geometric.nn import GATConv
#     # build edge_index from adjacency (thresholded)
#     N = A.shape[0]
#     # simple threshold to convert to sparse edges
#     thr = np.percentile(np.abs(A), 75)
#     rows, cols = np.where(np.abs(A) >= thr)
#     edge_index = torch.tensor(np.vstack([rows, cols]), dtype=torch.long)
#     x = torch.tensor(X, dtype=torch.float).unsqueeze(0) # placeholder batch dim
#     data = Data(x=torch.tensor(X, dtype=torch.float), edge_index=edge_index)
#     # Build a tiny GAT
#     class SimpleGAT(torch.nn.Module):
#         def __init__(self, in_feats, hidden=32, out=2):
#             super().__init__()
#             self.conv1 = GATConv(in_feats, hidden, heads=4)
#             self.conv2 = GATConv(hidden*4, out, heads=1)
#         def forward(self, data):
#             x, edge_index = data.x, data.edge_index
#             x = self.conv1(x, edge_index)
#             x = torch.relu(x)
#             x = self.conv2(x, edge_index)
#             return x.mean(dim=0)
#     # training loop omitted

# ------------------------- Example usage -------------------------
if __name__ == '__main__':
    # Edit these paths for your environment
    DATA_ROOT = '/home/nuvo/workspaces/ss95211b'
    os.chdir(DATA_ROOT)
    bold_path = '/home/nuvo/workspaces/ss95211b/exception_handlers/ds000228_preprocessed_subset/derivatives/preprocessed_data/sub-pixar001/sub-pixar001_task-pixar_run-001_swrf_bold.nii.gz'
    conf_path = '/home/nuvo/workspaces/ss95211b/exception_handlers/ds000228_preprocessed_subset/derivatives/preprocessed_data/sub-pixar001/sub-pixar001_task-pixar_run-001_ART_and_CompCor_nuisance_regressors.mat'

    atlas_harvard_img = '/home/nuvo/workspaces/ss95211b/exception_handlers/atlas_files/harvard_oxford_atlas.nii.gz'
    atlas_schaefer_img = '/home/nuvo/workspaces/ss95211b/exception_handlers/atlas_files/schaefer100_atlas.nii.gz'

    confounds = load_confounds(conf_path)

    masker_h = NiftiLabelsMasker(labels_img=atlas_harvard_img, standardize=True, detrend=True, t_r=2.0)
    ts_harvard = masker_h.fit_transform(bold_path, confounds=confounds)

    masker_s = NiftiLabelsMasker(labels_img=atlas_schaefer_img, standardize=True, detrend=True, t_r=2.0)
    ts_schaefer = masker_s.fit_transform(bold_path, confounds=confounds)

    result = build_cost_matrix_from_timeseries(
        ts_harvard=ts_harvard,
        ts_schaefer=ts_schaefer,
        atlas_harvard_img=atlas_harvard_img,
        atlas_schaefer_img=atlas_schaefer_img,
        weights=(0.2, 0.3, 0.4, 0.1),
        spectral_k=10,
        topo_k=10
    )

    # attach atlas paths for downstream use
    result['atlas_harvard_img'] = atlas_harvard_img
    result['atlas_schaefer_img'] = atlas_schaefer_img

    out = run_hungarian_and_build_unified(result, save_dir='hungarian_output',
                                          bold_path=bold_path, confounds=confounds)

    print('Saved mapping to:', out.get('mapping_path'))
    if 'X' in out:
        print('Built X shape:', out['X'].shape)
        print('Built A shape:', out['A'].shape)
    else:
        print('Mapping created. Provide bold_path/confounds to build X/A for a subject.')