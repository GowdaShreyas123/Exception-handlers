import React from "react";
import { useLocation } from "react-router-dom";
import type { PredictResponse } from "@/libs/tanstack/types/prediction";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const VisualDashboard = () => {
  const location = useLocation();
  const result = location.state?.result as PredictResponse;

  if (!result) return <div>No result found</div>;

  const data = [
    { name: "Control", value: result.probabilities.control },
    { name: "Depression", value: result.probabilities.depression },
  ];

  const COLORS = ["var(--color-info-400)", "var(--color-error-500)"];

  return (
    <div className="min-h-screen p-10 bg-background-card">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Heading */}
        <h1 className="text-h2 text-center text-[color:var(--color-brandText-primary)] font-bold">
          Prediction Dashboard
        </h1>

        {/* INFO CARD */}
        <div className="
          bg-lilac-bg
          rounded-2xl shadow-lg p-8 
          border border-[color:var(--color-neutral-200)]
          hover:shadow-xl transition-shadow
        ">
          <div className="space-y-3">
            <p className="text-h4 text-brandText-primary">
              <span className="font-semibold text-[color:var(--color-brandText-primary)]">
                Subject ID:
              </span>{" "}
              {result.subject_id}
            </p>

            <p className="text-h4 text-brandText-primary">
              <span className="font-semibold text-[color:var(--color-brandText-primary)]">
                Prediction:
              </span>{" "}
              {result.prediction}
            </p>

            <p className="text-h4 text-brandText-primary ">
              <span className="font-semibold text-[color:var(--color-brandText-primary)]">
                Confidence:
              </span>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* DONUT CARD */}
        <div
          className="
            p-[2px] rounded-2xl bg-gradient
            shadow-lg hover:shadow-xl transition-all
          "
        >
          <div
            className="
        
              rounded-2xl p-8
            "
          >
            <h2 className="text-h3 text-center font-semibold mb-6 text-[color:var(--color-brandText-primary)]">
              Probability Distribution
            </h2>

            <div className="relative w-full h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                        stroke="white"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-4xl font-bold text-[color:var(--color-brand-primary)]">
                  {(result.probabilities.depression * 100).toFixed(1)}%
                </p>
                <p className="text-md text-brandText-primary">
                  Depression Risk
                </p>
              </div>
            </div>

            {/* Labels */}
            <div className="flex justify-center gap-10 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[color:var(--color-info-400)]"></span>
                <span className="text-[color:var(--color-brandText-secondary)] text-2xl">
                  Control ({(result.probabilities.control * 100).toFixed(1)}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[color:var(--color-error-500)]"></span>
                <span className="text-[color:var(--color-brandText-secondary)] text-2xl">
                  Depression ({(result.probabilities.depression * 100).toFixed(1)}%)
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VisualDashboard;
