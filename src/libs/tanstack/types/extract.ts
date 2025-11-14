export interface ExtractResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    name: string;
    dob: string;
    gender: string;
    aadhaar_number: string;
  };
}
    