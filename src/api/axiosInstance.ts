import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const data = error.response.data as {
        message?: string;
        statusCode?: number;
      };

      if (status === 404) {
        toast.error(data?.message || "해당 ID에 일치하는 데이터가 없습니다.");
      } else if (status === 401) {
        toast.error(data?.message || "로그인이 필요합니다.");
      } else {
        toast.error(data?.message || "오류가 발생했습니다.");
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
