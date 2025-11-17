import React, { useState } from "react";
import { usePredict } from "@/libs/tanstack/hooks/usePredict";
import { useNavigate } from "react-router-dom";
import sandesh from "/sandesh.jpg";
import mava from "/mava.jpg";

const UploadAndPredict = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();
  const predictMutation = usePredict();

  const handleFile = (f: File) => {
    setFile(f);
    if (f.type.includes("image")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    predictMutation.mutate(file, {
      onSuccess: (data) => {
        // Navigate to results page
        navigate("/visual", {
          state: { result: data },
        });
        
      },
    });
  };

  return (
    <div
      className="min-h-screen w-full p-8 flex justify-center items-start"
      style={{
        backgroundImage: `url(${mava})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="rounded-2xl p-10 w-full max-w-6xl h-220 shadow-lg relative"
        style={{
          backgroundImage: `url(${sandesh})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl font-bold text-center text-white">
            MRI Scan — Upload
          </h1>
          <p className="text-center text-white text-h6">
            Upload .npz file
          </p>

          <label
            className="border border-slate-400/50 border-dashed rounded-2xl p-10 h-120
            flex flex-col items-center justify-center cursor-pointer transition bg-white/10 backdrop-blur"
          >
            <input
              type="file"
              accept=".npz"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />

            {!file ? (
              <>
                <p className="text-lg text-white">Click to Upload</p>
                <p className="text-sm text-slate-300">.npz file supported</p>
              </>
            ) : (
              <p className="text-white">{file.name}</p>
            )}
          </label>

          <button
            disabled={!file || predictMutation.isPending}
            onClick={handleUpload}
            className={`w-full py-4 rounded-xl mt-12 text-lg font-medium transition ${
              file
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-neutral-700 text-slate-300 cursor-not-allowed"
            }`}
          >
            {predictMutation.isPending ? "Predicting..." : "Upload & Predict"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadAndPredict;
