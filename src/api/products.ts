import type { BasicGiftProduct, SummaryGiftProduct } from "@/types/gift";
import instance from "./axiosInstance";
import type { AxiosResponse } from "axios";

type GetRankProductsParams = {
  targetType: string;
  rankType: string;
};

export const getRanking = (
  params: GetRankProductsParams
): Promise<AxiosResponse<{ data: BasicGiftProduct[] }>> => {
  return instance.get("/products/ranking", {
    params: { targetType: params.targetType, rankType: params.rankType },
  });
};

export const getProudctSummary = async (
  productId: number
): Promise<AxiosResponse<SummaryGiftProduct>> => {
  const res = await instance.get<{ data: SummaryGiftProduct }>(
    `/products/${productId}/summary`
  );
  return {
    ...res,
    data: res.data.data,
  } as AxiosResponse<SummaryGiftProduct>;
};
