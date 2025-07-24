import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000, // (선택) 요청 제한 시간 설정
});

export default instance;
