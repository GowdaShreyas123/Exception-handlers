import { useMutation } from "@tanstack/react-query";
import { getSimpleToast } from "@/components/ui/toaster/ToastProvider";
import { predictFile } from "@/libs/tanstack/services/predictService";
import type { PredictResponse } from "../types/prediction";

export const usePredict = () => {
  return useMutation<PredictResponse, Error, File>({
    mutationFn: predictFile,
    onSuccess: (data) => {
      getSimpleToast("Prediction received", "success");
      console.log("Prediction result:", data);
    },
    onError: (error) => {
      getSimpleToast(error.message || "Prediction failed", "error");
    },
  });
};
