import { Button } from "@/components/ui/shadcn/src/button";
import React, { useState } from "react";
// shadcn button

const Graphs = () => {
  const [tab, setTab] = useState(1);

  const tabs = [
    { id: 1, label: "Brain Atlas" },
    { id: 2, label: "Connectivity" },
    { id: 3, label: "Network Graph" },
    { id: 4, label: "Timeseries" },
    { id: 5, label: "ROI Metrics" },
  ];

  return (
    <div className="p-6 ">

      {/* PAGE TITLE */}
      <h1 className="text-h2 font-bold mb-8 text-[var(--color-brand-primary)]">
        Brain Atlas & Connectivity Dashboard
      </h1>

      {/* TABS */}
      <div className="flex gap-3 mb-6 border-b pb-4 border-[var(--color-neutral-300)]">
        {tabs.map((t) => (
          <Button 
            key={t.id}
            variant={tab === t.id ? "secondary" : "ghost"}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg transition-all 
              ${tab === t.id 
                ? "bg-gradient text-brandText-primary shadow-md" 
                : "text-brandText-primary hover:bg-gradients"
              }
            `}
          >
            {t.label}
          </Button>
        ))}
      </div>

      {/* CARDS WRAPPER */}
      <div className="space-y-10">

        {/* TAB 1 — BRAIN ATLAS */}
        {tab === 1 && (
          <>
            <SectionCard title="3D Brain Atlas">
              <iframe
                src="/plots/guru.html"
                className="w-full h-[600px] rounded-xl"
              ></iframe>
              <p className="text-sm mt-2 text-center text-[var(--color-brandText-secondary)]">
                Interactive 3D visualization of the whole-brain atlas
              </p>
            </SectionCard>

            <SectionCard title="Atlas Comparison">
              <iframe
                src="/plots/magu.html"
                className="w-full h-[600px] rounded-xl"
              ></iframe>
              <p className="text-sm mt-2 text-center text-[var(--color-brandText-secondary)]">
                Region-wise comparative view between two brain atlases
              </p>
            </SectionCard>
          </>
        )}

        {/* TAB 2 — CONNECTIVITY */}
        {tab === 2 && (
          <SectionCard title="Connectivity Heatmap Overview">
            <img
              src="/plots/05_connectivity_heatmaps.png"
              className="rounded-xl shadow-lg w-full"
              alt="Connectivity Heatmap"
            />
            <p className="text-sm text-center mt-2 text-[var(--color-brandText-secondary)]">
              Correlation matrix of functional connectivity between ROIs
            </p>
          </SectionCard>
        )}

        {/* TAB 3 — NETWORK GRAPH */}
        {tab === 3 && (
          <>
            <SectionCard title="3D Network Graph">
              <img
                src="/plots/3dnetworkgraph.png"
                className="rounded-xl shadow-lg w-full"
                alt="3D Network Graph"
              />
              <p className="text-sm text-center mt-2 text-[var(--color-brandText-secondary)]">
                Graph-based representation of ROI interactions
              </p>
            </SectionCard>

            <SectionCard title="3D Network Variants">
              <img
                src="/plots/3dbarinnetwork.png"
                className="rounded-xl shadow-lg w-full"
                alt="3D Network Variant"
              />
              <p className="text-sm text-center mt-2 text-[var(--color-brandText-secondary)]">
                Alternative rendering of network node strengths
              </p>
            </SectionCard>
          </>
        )}

        {/* TAB 4 — TIMESERIES */}
        {tab === 4 && (
          <SectionCard title="BOLD Timeseries Exploration">
            <img
              src="/plots/01_timeseries_exploration.png"
              className="rounded-xl shadow-lg w-full"
              alt="Timeseries"
            />
            <p className="text-sm text-center mt-2 text-[var(--color-brandText-secondary)]">
              ROI time-series signals extracted from fMRI session
            </p>
          </SectionCard>
        )}

        {/* TAB 5 — ROI METRICS */}
        {tab === 5 && (
          <SectionCard title="3D ROI Metrics Visualization">
            <img
              src="/plots/03_3d_roi_metrics.png"
              className="rounded-xl shadow-lg w-full"
              alt="ROI Metrics"
            />
            <p className="text-sm text-center mt-2 text-[var(--color-brandText-secondary)]">
              Summary metrics superimposed on 3D brain structure
            </p>
          </SectionCard>
        )}
      </div>
    </div>
  );
};

/* Reusable Section Card Component */
const SectionCard = ({ title, children }) => {
  return (
    <div className="p-6 rounded-2xl shadow-lg bg-[var(--color-background-card)] border border-[var(--color-neutral-200)]">
      <h2 className="text-h4 font-semibold mb-4 text-[var(--color-brandText-primary)]">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Graphs;
