import type { BasicGiftProduct } from "@/types/gift";
import instance from "./axiosInstance";
import type { AxiosResponse } from "axios";

export const getRanking = (
  targetType: string,
  rankType: string
): Promise<AxiosResponse<{ data: BasicGiftProduct[] }>> => {
  return instance.get("/products/ranking", {
    params: { targetType, rankType },
  });
};

export const getProudctSummary = (productId: number) => {
  return instance.get(`/products/${productId}/summary`);
};
