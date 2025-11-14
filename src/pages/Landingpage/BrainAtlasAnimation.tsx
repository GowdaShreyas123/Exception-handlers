"use client";

import { useEffect } from "react";
import { tsParticles } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const ParticlesBackground = () => {
  useEffect(() => {
    const loadParticles = async () => {
      await loadSlim(tsParticles);

      await tsParticles.load("particles-js", {
        fullScreen: { enable: false },
        background: { color: "transparent" },

        particles: {
          number: { value: 80 },

          /* 🔥 Ultra-neon particle colors */
          color: { value: ["#ff4dff", "#e043ff", "#d075ff", "#ff7bff"] },

          shape: { type: "circle" },

          opacity: {
            value: 1,
            animation: { enable: true, speed: 1, minimumValue: 0.4 },
          },

          size: {
            value: { min: 2, max: 5 },
            animation: { enable: true, speed: 2 },
          },

          /* 🔥 Ultra-bright neon connecting edges */
          links: {
            enable: true,
            distance: 180,
            color: "#ff66ff",      // bright neon
            opacity: 1,            // max brightness
            width: 3,              // thicker for visibility
            shadow: {              // glow effect
              enable: true,
              color: "#ff99ff",
              blur: 15,
            },
          },

          move: {
            enable: true,
            speed: 1.6,
            direction: "none",
            outModes: { default: "bounce" },
          },
        },

        retina_detect: true,
      });
    };

    loadParticles();
  }, []);

  return (
    <div
      id="particles-js"
      className="absolute inset-0 z-[1] pointer-events-none"
    />
  );
};

export default ParticlesBackground;
