
import apiClient from "../api/apiClient";
import type { ExtractResponse } from "../types/extract";

export const extractFile = async (file: File): Promise<ExtractResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<ExtractResponse>(
    "/extract",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};
