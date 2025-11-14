import { Orbit, Rocket, Network, Cpu, Layers } from "lucide-react";

const FutureScope = () => {
  return (
    <div className="relative  w-full  flex items-center justify-center bg-[var(--color-background-app)] px-6 py-24">

      {/* ========= Animated fMRI Graph-Lines ========== */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <svg viewBox="0 0 900 600" className="w-full h-full">
          <g
            stroke="var(--color-secondary-400)"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M50 100 L250 20 L450 140 L700 60 L880 190" />
            <path d="M80 320 L300 200 L450 290 L660 140 L880 310" />
            <path d="M100 520 L290 380 L500 540 L720 370 L880 490" />
          </g>
          <g fill="var(--color-secondary-500)">
            <circle cx="250" cy="20" r="6" />
            <circle cx="450" cy="140" r="6" />
            <circle cx="660" cy="140" r="6" />
            <circle cx="290" cy="380" r="6" />
            <circle cx="500" cy="540" r="6" />
          </g>
        </svg>
      </div>

      {/* ========= Content Card ========== */}
      <div className="relative z-10 max-w-5xl w-full bg-[var(--color-background-card)] border border-[var(--color-neutral-300)] dark:border-[var(--color-neutral-700)] rounded-3xl shadow-xl backdrop-blur-xl p-12">

        {/* Title */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <Orbit className="w-12 h-12 text-[var(--color-secondary-500)]" />
          <h1 className="text-h2 text-[var(--color-brandText-primary)]">
            Future Scope
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg-bold text-[var(--color-secondary-600)] text-center mb-6">
          The Long-Term Vision of Multi-Atlas Graph Alignment Systems
        </p>

        {/* Description */}
        <p className="text-base text-[var(--color-brandText-secondary)] text-center max-w-3xl mx-auto leading-relaxed">
          Multi-Atlas Graph Alignment opens doors to next-generation neuro-AI systems.
          The evolution of this research will bring real-time, self-improving, globally
          interconnected brain-network intelligence. This technology can scale beyond 
          depression diagnosis into predictive mental-health analytics, cognitive decay
          forecasting, and personalized neuro-treatments.
        </p>

        {/* Divider */}
        <div className="w-52 h-[2px] bg-gradient mx-auto my-10 rounded-full shadow-lg" />

        {/* ========= FUTURE SCOPE GRID ========== */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1 */}
          <div className="p-6 rounded-2xl bg-[var(--color-background-input)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-600)]">
            <div className="flex items-center gap-3 mb-3">
              <Rocket className="text-[var(--color-primary-600)]" />
              <h3 className="text-h4 text-[var(--color-brandText-primary)]">
                1. Massive Global Scalability
              </h3>
            </div>
            <p className="text-base text-[var(--color-brandText-secondary)]">
              Model can be deployed across hospitals using federated learning, allowing
              the system to learn from millions of anonymized fMRI scans without sharing data.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6 rounded-2xl bg-[var(--color-background-input)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-600)]">
            <div className="flex items-center gap-3 mb-3">
              <Network className="text-[var(--color-secondary-600)]" />
              <h3 className="text-h4 text-[var(--color-brandText-primary)]">
                2. Cross-Atlas Universal Brain Engine
              </h3>
            </div>
            <p className="text-base text-[var(--color-brandText-secondary)]">
              Future systems auto-align graphs from ANY brain atlas — AAL, Harvard-Oxford,
              Schaefer — forming a universal brain-network representation.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6 rounded-2xl bg-[var(--color-background-input)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-600)]">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="text-[var(--color-brand-primary)]" />
              <h3 className="text-h4 text-[var(--color-brandText-primary)]">
                3. Self-Improving Neural Graph Systems
              </h3>
            </div>
            <p className="text-base text-[var(--color-brandText-secondary)]">
              Using reinforcement and continual learning, the graph model evolves automatically
              as new patient-data streams in — no retraining required.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6 rounded-2xl bg-[var(--color-background-input)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-600)]">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="text-[var(--color-secondary-700)]" />
              <h3 className="text-h4 text-[var(--color-brandText-primary)]">
                4. Multi-Modal Brain Fusion
              </h3>
            </div>
            <p className="text-base text-[var(--color-brandText-secondary)]">
              Future versions can merge fMRI + EEG + behavioral signals to form a unified
              neuro-signature for ultra-accurate mental-state classification.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6 rounded-2xl bg-[var(--color-background-input)] border border-[var(--color-neutral-200)] dark:border-[var(--color-neutral-600)] md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <Orbit className="text-[var(--color-secondary-500)]" />
              <h3 className="text-h4 text-[var(--color-brandText-primary)]">
                5. Early Disorder Forecasting (The Biggest Underdog Feature)
              </h3>
            </div>
            <p className="text-base text-[var(--color-brandText-secondary)]">
              With large-scale patient history, the system can detect subtle network drift 
              patterns that hint at depression, bipolar onset, or cognitive decline YEARS 
              before symptoms appear — a breakthrough in preventive neuroscience.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FutureScope;
