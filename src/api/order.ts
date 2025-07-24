import type { AxiosResponse } from "axios";
import instance from "./axiosInstance";

interface Receiver {
  name: string;
  phoneNumber: string;
  quantity: number;
}
interface OrderRequest {
  productId: number;
  message: string;
  messageCardId: string;
  ordererName: string;
  receivers: Receiver[];
}

interface OrderResponse {
  data: {
    success: boolean;
  };
}

export const postOrder = (
  data: OrderRequest
): Promise<AxiosResponse<OrderResponse>> => {
  return instance.post("/order", data, {
    headers: {
      Authorization: sessionStorage.getItem("userInfo")
        ? JSON.parse(sessionStorage.getItem("userInfo")!).authToken
        : "",
    },
  });
};
