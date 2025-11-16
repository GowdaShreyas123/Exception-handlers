
import apiClient from "../api/apiClient";
import type { PredictResponse } from "../types/prediction";

export const predictFile = async (file: File): Promise<PredictResponse> => {
  const form = new FormData();
  form.append("file", file);

  const { data } = await apiClient.post<PredictResponse>(
    "/predict",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
