// src/hooks/useSignup.ts
import { useMutation } from '@tanstack/react-query';
// import Cookies from 'js-cookie';
import { getSimpleToast } from '@/components/ui/toaster/ToastProvider';
import { signupUser } from '../services/authService';
import type { SignupRequest, SignupResponse } from '../types/auth';

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: (data) => {
    //   // Save token
    //   Cookies.set('authToken', data.data.token, { expires: 7 });

      getSimpleToast(data.message,'success');
     
    },
    onError: (Error) => {
      getSimpleToast(Error.message || 'Signup failed','error');
       console.log('User registered:', Error.message);
    },
  });
};
