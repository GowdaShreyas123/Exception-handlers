import { useMutation } from "@tanstack/react-query";
import { getSimpleToast } from "@/components/ui/toaster/ToastProvider";
import { extractFile } from "../services/extractService";
import type { ExtractResponse } from "../types/extract";

export const useExtract = () => {
  return useMutation<ExtractResponse, Error, File>({
    mutationFn: extractFile,

    onSuccess: (data) => {
      getSimpleToast("File processed successfully", "success");
      console.log("Extract Response:", data);
    },

    onError: (err) => {
      getSimpleToast(err.message || "Failed to process file", "error");
    },
  });
};
