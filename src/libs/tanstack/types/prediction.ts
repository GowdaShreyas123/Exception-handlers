export interface PredictResponse {
  subject_id: string;
  prediction: string;
  confidence: number;
  probabilities: {
    control: number;
    depression: number;
  };
  timestamp: string;
}

export interface PredictRequest {
  file: File; // .npz file
}
