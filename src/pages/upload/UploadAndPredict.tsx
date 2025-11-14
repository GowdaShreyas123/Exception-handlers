import React, { useState } from "react";
import sandesh from "/sandesh.jpg";
import mava from "/mava.jpg";
import { getSimpleToast } from "@/components/ui/toaster/ToastProvider";

const UploadAndPredict = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (f.type.includes("image")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
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
      {/* INNER IMAGE FRAME */}
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
        {/* CONTENT */}
        <div className="relative z-10 space-y-8">
          <h1 className="text-4xl font-bold text-center text-white">
            MRI Scan — Upload
          </h1>
          <p className="text-center text-white text-h6">
            Upload an MRI Image or PDF Report
          </p>

          {/* Upload Box */}
          <label
            className="border border-slate-400/50 border-dashed rounded-2xl p-10 h-120
            flex flex-col items-center justify-center cursor-pointer transition bg-white/10 backdrop-blur"
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />

            {!file ? (
              <>
                <p className="text-lg text-white">Click to Upload</p>
                <p className="text-sm text-slate-300">PDF or Image accepted</p>
              </>
            ) : preview ? (
              <img
                src={preview}
                alt="preview"
                className="h-100 object-cover rounded-xl shadow-lg blur-sm"
              />
            ) : (
              <div className="text-white">PDF Selected</div>
            )}
          </label>

          {/* Upload Button */}
          <button
            onClick={() => {
              if (!file) {
                getSimpleToast("Please upload the image first", "error");
                return;
              }

              // When file exists → continue upload logic here
              getSimpleToast("Uploading...", "success");
            }}
            className={`w-full py-4 rounded-xl mt-12 text-lg font-medium transition ${
              file
                ? "bg-brand-primary text-white"
                : "bg-brandText-disabled text-slate-300"
            }`}
          >
            Upload File
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadAndPredict;
