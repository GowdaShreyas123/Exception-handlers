import { motion } from "framer-motion";
import { Button } from "@/components/ui/shadcn/src/button";
import BrainMeshBackground from "@/layout/SoftBackground";

// Replace these two imports with your project's actual components
// ParticlesBackground: the existing background particles animation you mentioned
// Button, Card etc: optional shadcn/ui imports — you can swap or remove as needed

type Node = {
  id: number;
  x: number;
  y: number;
  label?: string;
};

const brainPath = `M150 20 C110 20 90 40 80 70 C60 120 40 140 50 190 C60 240 110 260 150 260 C190 260 240 240 250 190 C260 140 240 120 220 70 C210 40 190 20 150 20 Z`;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FMRIOverviewPage() {
  const roiNodes: Node[] = [
    { id: 1, x: 40, y: 60, label: "ROI 1" },
    { id: 2, x: 120, y: 30, label: "ROI 2" },
    { id: 3, x: 200, y: 70, label: "ROI 3" },
    { id: 4, x: 80, y: 140, label: "ROI 4" },
    { id: 5, x: 210, y: 150, label: "ROI 5" },
  ];

  const edges = [
    { a: 1, b: 2, w: 0.8 },
    { a: 1, b: 4, w: 0.5 },
    { a: 2, b: 3, w: 0.6 },
    { a: 3, b: 5, w: 0.9 },
    { a: 4, b: 5, w: 0.4 },
  ];

  return (
    <div className="relative  p-6  text-brandText-primary ">
      {/* Particle background */}
      <BrainMeshBackground />
      <div className="absolute inset-0 -z-10"></div>

      <div className="">
        <motion.header
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <motion.div variants={fadeUp} className="space-y-3">
            <h1 className="text-4xl md:text-5xl text-brandText-primary font-semibold leading-tight">
              Brain Imaging —{" "}
              <span className="text-indigo-300">fMRI Overview</span>
            </h1>
            <p className="text-brandText-secondary max-w-xl">
              A compact, visual guide: what fMRI measures, how brain activity
              becomes time-series data, and how functional connectivity graphs
              reveal brain networks.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex gap-3">
            <Button
              variant="gradient"
              className="border border-slate-700 px-4 py-3 rounded-2xl font-medium"
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=4UOeBM5BwdY",

                  "_blank"
                )
              }
            >
              Explore demo
            </Button>
          </motion.div>
        </motion.header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Left column: explanations */}
          <section className="space-y-8">
            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-background-section rounded-2xl p-6 backdrop-blur-md border-primary-200"
            >
              <motion.h2
                variants={fadeUp}
                className="text-2xl font-semibold mb-2"
              >
                What is fMRI?
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-brandText-secondary leading-relaxed"
              >
                Functional Magnetic Resonance Imaging (fMRI) measures small
                changes in blood oxygenation — the BOLD signal. When neurons
                fire, they consume oxygen; the vascular response changes local
                blood oxygen levels which fMRI detects. This lets us infer which
                brain regions were active.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-4 p-4 rounded-lg bg-background-card border-primary-200 flex items-center gap-4"
              >
                <svg width="72" height="72" viewBox="0 0 300 300" fill="none">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0" stopColor="#7c3aed" stopOpacity="0.9" />
                      <stop offset="1" stopColor="#06b6d4" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={brainPath}
                    stroke="url(#g1)"
                    strokeWidth={6}
                    fill="rgba(255,255,255,0.02)"
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{
                      scale: [0.95, 1.03, 0.98],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                </svg>
                <div>
                  <div className="text-brandText-secondary font-medium">
                    BOLD signal
                  </div>
                  <div className="text-brandText-secondary text-sm">
                    Blood-Oxygen-Level Dependent
                  </div>
                </div>
              </motion.div>
            </motion.article>

            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-background-section rounded-2xl p-6 backdrop-blur-md border-primary-200"
            >
              <motion.h3
                variants={fadeUp}
                className="text-xl font-semibold mb-2"
              >
                From brain to time-series
              </motion.h3>
              <motion.p
                variants={fadeUp}
                className="text-brandText-secondary leading-relaxed"
              >
                The brain is parcelled into Regions of Interest (ROIs) using an
                atlas (e.g., AAL, Schaefer). For each ROI, the scanner samples
                the BOLD intensity at regular intervals (TR, e.g., 2s).
                Averaging the signal inside an ROI over time produces a
                time-series for that region.
              </motion.p>

              <div className="mt-4">
                <TimeSeriesPreview />
              </div>
            </motion.article>

            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-background-section rounded-2xl p-6 backdrop-blur-md border-primary-200"
            >
              <motion.h3
                variants={fadeUp}
                className="text-xl font-semibold mb-2"
              >
                Functional connectivity graphs
              </motion.h3>
              <motion.p
                variants={fadeUp}
                className="text-brandText-secondary leading-relaxed"
              >
                Pairwise correlations between ROI time-series produce a
                correlation matrix. Converting the matrix into nodes (ROIs) and
                edges (correlations) yields a functional connectivity graph — a
                visual map of brain communication.
              </motion.p>

              <div className="mt-4">
                <CorrelationPreview nodes={roiNodes} edges={edges} />
              </div>
            </motion.article>
          </section>

          {/* Right column: big visual */}
          <aside className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-white/4 to-white/6 border-primary-200"
            >
              <h4 className="text-lg font-semibold mb-3">Interactive flow</h4>
              <p className="text-brandText-secondary text-sm mb-4">
                Scroll through the process: brain → ROIs → time-series → matrix
                → graph. Each step animates in to guide the user.
              </p>

              <div className="w-full h-72 rounded-2xl bg-gradient-to-b from-white/2 to-transparent flex items-center justify-center border border-white/4 p-4">
                <MiniPipeline nodes={roiNodes} edges={edges} />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-3xl p-6 bg-gradient-to-br from-white/3 to-white/6 border-primary-200"
            >
              <h4 className="text-lg font-semibold mb-3">Quick summary</h4>
              <ul className="text-brandText-secondary space-y-2 text-sm">
                <li>
                  • fMRI measures BOLD — changes in blood oxygen tied to neural
                  activity.
                </li>
                <li>
                  • Each brain ROI produces a time-series sampled across the
                  scan.
                </li>
                <li>
                  • Pairwise correlations form matrices that become connectivity
                  graphs.
                </li>
              </ul>
            </motion.div>
          </aside>
        </main>

        <footer className="mt-14 text-center text-slate-500 text-sm">
          Built for research UIs • visually lightweight • accessible colors
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------- Subcomponents ----------------------------- */

function TimeSeriesPreview() {
  // Simple animated line made with SVG path points sampled from a small array
  const samples = [1.1, 1.25, 1.05, 0.98, 1.4, 1.2, 1.35, 1.15, 1.05, 1.25];

  const path = samples
    .map((v, i) => `${i * 25},${60 - (v - 0.9) * 80}`)
    .join(" L ");

  return (
    <div className="w-full rounded-lg p-3 bg-black/30 border-primary-200">
      <svg viewBox="0 0 260 80" className="w-full h-20">
        <defs>
          <linearGradient id="lineGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#7c3aed" />
            <stop offset="1" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        <polyline
          points={path}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* moving dot animation */}
        <motion.circle
          r={4}
          initial={{ cx: 0 }}
          animate={{ cx: 225 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          cy={40}
          fill="white"
          style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" }}
        />
      </svg>

      <div className="mt-2 flex items-center justify-between text-xs text-brandText-secondary">
        <div>TR: 2s (example)</div>
        <div>ROI average signal</div>
      </div>
    </div>
  );
}

function CorrelationPreview({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: { a: number; b: number; w: number }[];
}) {
  // Simple heatmap-as-rectangles and a tiny graph preview
  const size = 140;
  const n = nodes.length;

  return (
    <div className="flex gap-4 items-center">
      <svg
        width={size}
        height={size}
        className="rounded-lg border-primary-200 bg-black/30"
      >
        {nodes.map((_, i) => (
          <rect
            key={i}
            x={(i % n) * (size / n)}
            y={Math.floor(i / n) * (size / n)}
            width={size / n}
            height={size / n}
            fill={`rgba(124,58,237,${0.2 + (i % n) * 0.08})`}
            stroke="rgba(255,255,255,0.03)"
          />
        ))}
        {/* decorative text */}
        <text x={8} y={size - 8} fill="rgba(255,255,255,0.5)" fontSize={10}>
          Correlation matrix (schematic)
        </text>
      </svg>

      <svg
        width={220}
        height={140}
        className="rounded-lg border-primary-200 bg-black/30 p-2"
      >
        {/* edges */}
        {edges.map((e, idx) => {
          const a = nodes.find((n) => n.id === e.a)!;
          const b = nodes.find((n) => n.id === e.b)!;
          const thickness = 1 + e.w * 5;
          const dash = e.w < 0 ? "4 3" : undefined;
          return (
            <line
              key={idx}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(124,58,237,0.9)"
              strokeWidth={thickness}
              strokeDasharray={dash}
              strokeLinecap="round"
              opacity={0.9}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={8} fill="#06b6d4" opacity={0.95} />
            <text x={n.x + 12} y={n.y + 4} fontSize={10} fill="white">
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MiniPipeline({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: { a: number; b: number; w: number }[];
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Brain simplified */}
      <g transform="translate(20,20)">
        <motion.path
          d={brainPath}
          fill="rgba(124,58,237,0.06)"
          stroke="rgba(124,58,237,0.35)"
          strokeWidth={2}
          initial={{ scale: 0.98 }}
          animate={{ scale: [0.98, 1.02, 0.99] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* ROI dots animate into place */}
        {nodes.map((n, i) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={6}
            fill="#7c3aed"
            initial={{ r: 0, opacity: 0 }}
            animate={{ r: 6, opacity: 1, y: [n.y - 6, n.y, n.y - 2] }}
            transition={{ delay: 0.3 + i * 0.12 }}
          />
        ))}

        {/* arrows + small linegraphs to the right */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <line
            x1={260}
            x2={330}
            y1={30}
            y2={30}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={2}
          />
          <polyline
            points="330,24 338,30 330,36"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
          />

          <rect
            x={340}
            y={8}
            width={48}
            height={44}
            rx={6}
            fill="#000"
            stroke="rgba(255,255,255,0.04)"
          />
          <polyline
            points="348,40 356,30 364,36 372,22 388,30"
            fill="none"
            stroke="#06b6d4"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </motion.g>
      </g>

      {/* small connectivity graph bottom-right */}
      <g transform="translate(140,110)">
        {edges.map((e, idx) => {
          const a = nodes.find((n) => n.id === e.a)!;
          const b = nodes.find((n) => n.id === e.b)!;
          return (
            <line
              key={idx}
              x1={a.x / 2}
              y1={(a.y - 50) / 2}
              x2={b.x / 2}
              y2={(b.y - 50) / 2}
              stroke="rgba(6,182,212,0.9)"
              strokeWidth={1 + e.w * 3}
              strokeLinecap="round"
              opacity={0.95}
            />
          );
        })}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x / 2}
            cy={(n.y - 50) / 2}
            r={4}
            fill="#06b6d4"
          />
        ))}
      </g>
    </svg>
  );
}
