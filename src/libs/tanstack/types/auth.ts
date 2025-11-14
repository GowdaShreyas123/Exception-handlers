// src/types/auth.ts
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    user: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      email: string;
      profileUrl: string | null;
      gender: string | null;
      role: string;
      dob: string | null;
      createdAt: string;
      updatedAt: string;
    };
    authToken: string;
  };
}

export interface SigninRequest {
  email: string;
  password: string;
}



export interface SigninResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      profileUrl: string;
      gender: string;
      role: string;
      dob: string;
      createdAt: string;
      updatedAt: string;
    };

    authToken: string;
  };
}
