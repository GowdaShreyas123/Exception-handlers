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

  // Prepare data for donut chart
  const data = [
    { name: "Control", value: result.probabilities.control },
    { name: "Depression", value: result.probabilities.depression },
  ];

  // Colors for donut segments
  const COLORS = ["#60A5FA", "#EF4444"]; // blue = control, red = depression

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-10">
      <h1 className="text-4xl font-bold text-center">Prediction Dashboard</h1>

      {/* INFO CARD */}
      <div className="p-6 border rounded-xl bg-white shadow space-y-2">
        <p><b>Subject ID:</b> {result.subject_id}</p>
        <p><b>Prediction:</b> {result.prediction}</p>
        <p><b>Confidence:</b> {(result.confidence * 100).toFixed(2)}%</p>
        <p><b>Timestamp:</b> {result.timestamp}</p>
      </div>

      {/* DONUT CHART CARD */}
      <div className="p-6 border rounded-xl bg-white shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">
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
                paddingAngle={2}
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

          {/* CENTER TEXT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-4xl font-bold">
              {(result.probabilities.depression * 100).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">Depression Risk</p>
          </div>
        </div>

        {/* LABELS BELOW CHART */}
        <div className="flex justify-center gap-10 mt-6">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-blue-400"></span>
            <span>Control ({(result.probabilities.control * 100).toFixed(1)}%)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500"></span>
            <span>Depression ({(result.probabilities.depression * 100).toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualDashboard;
