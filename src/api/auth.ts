import instance from "./axiosInstance";

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
): Promise<{ data: LoginResponse }> => {
  return instance.post("/login", data);
};
