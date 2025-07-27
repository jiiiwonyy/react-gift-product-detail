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

export const postLogin = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await instance.post<{ data: LoginResponse }>("/login", data);
  return res.data.data; // { email, name, authToken }
};
