import { motion } from "framer-motion";

// Ultra‑dynamic brain mesh + drifting particles + traveling energy pulses
export default function BrainMeshBackground() {
  const energyPaths = [
    "M150 20 C110 20 90 40 80 70 C60 120 40 140 50 190 C60 240 110 260 150 260 C190 260 240 240 250 190 C260 140 240 120 220 70 C210 40 190 20 150 20 Z",
    "M160 40 C130 30 100 50 90 80 C70 130 60 150 70 200 C90 230 140 240 170 240 C210 230 230 200 240 160 C245 120 220 80 190 60 C175 50 170 45 160 40 Z",
  ];

  const floatingParticles = Array.from({ length: 40 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 20 + 8,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large drifting nebula blobs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-30"
          style={{
            width: 500 + i * 120,
            height: 500 + i * 120,
            background:
              i === 0
                ? "#8B5CF6" // purple
                : i === 1
                ? "#06B6D4" // cyan
                : "#F9A8D4", // pink
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
          animate={{
            x: ["-40%", "50%", "-20%", "40%", "-50%"],
            y: ["-30%", "40%", "-10%", "50%", "-40%"],
            rotate: [0, 120, -80, 200, 0],
          }}
          transition={{ duration: 40 + i * 12, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Floating global particles */}
      {floatingParticles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 backdrop-blur-sm"
          style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
          animate={{
            x: [p.x + "%", p.x + 15 + "%", p.x - 10 + "%"],
            y: [p.y + "%", p.y - 20 + "%", p.y + 10 + "%"],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Traveling brain pulses */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60">
        <motion.svg viewBox="0 0 300 300" width="650" height="650">
          {energyPaths.map((path, i) => (
            <motion.path
              key={i}
              d={path}
              fill="none"
              stroke={i % 2 ? "#06B6D4" : "#A78BFA"}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="20 60"
              animate={{ strokeDashoffset: [800, 0] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </motion.svg>
      </div>
    </div>
  );
}
