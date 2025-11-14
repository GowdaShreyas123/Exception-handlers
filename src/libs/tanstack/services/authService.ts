
import apiClient from '../api/apiClient';
import type { SigninRequest, SigninResponse, SignupRequest, SignupResponse } from '../types/auth';




export const signupUser = async (payload: SignupRequest): Promise<SignupResponse> => {
  const { data } = await apiClient.post<SignupResponse>('/auth/signup', payload);
  return data;
};

export const signinUser = async (payload: SigninRequest): Promise<SigninResponse> => {
  const { data } = await apiClient.post<SigninResponse>("/auth/signin", payload);
  return data;
};