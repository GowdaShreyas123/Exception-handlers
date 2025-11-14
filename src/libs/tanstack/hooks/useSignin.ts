// src/libs/tanstack/hooks/useSignin.ts
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getSimpleToast } from '@/components/ui/toaster/ToastProvider';
import { signinUser } from "@/libs/tanstack/services/authService";
import type { SigninRequest, SigninResponse } from "../types/auth";


export const useSignin = () => {
  return useMutation<SigninResponse, Error, SigninRequest>({
    mutationFn: signinUser,
    onSuccess: (data) => {
      getSimpleToast(data.message,'success');

      console.log(3286944444444444,data.message)

      // ✅ Save token for authenticated requests
      Cookies.set("authToken", data.data.authToken, { expires: 7 });

      // ✅ Save user info locally (optional, for UI)
    //   localStorage.setItem("user", JSON.stringify(data.user));
    },
    onError: (Error) => {
      getSimpleToast(Error.message || "Login failed",'error');
    },
  });
};
