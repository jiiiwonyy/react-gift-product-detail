import instance from "./axiosInstance";
import type { AxiosResponse } from "axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  email: string;
  name: string;
  authToken: string;
}

export const postLogin = (
  data: LoginRequest
): Promise<AxiosResponse<{ data: LoginResponse }>> => {
  return instance.post("/login", data);
};
