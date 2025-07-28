import type { BasicGiftProduct, SummaryGiftProduct } from "@/types/gift";
import instance from "./axiosInstance";

type GetRankProductsParams = {
  targetType: string;
  rankType: string;
};

export const getRanking = async (
  params: GetRankProductsParams
): Promise<BasicGiftProduct[]> => {
  const res = await instance.get<{ data: BasicGiftProduct[] }>(
    "/products/ranking",
    { params }
  );
  return res.data.data;
};

export const getProudctSummary = async (
  productId: number
): Promise<SummaryGiftProduct> => {
  const res = await instance.get<{ data: SummaryGiftProduct }>(
    `/products/${productId}/summary`
  );
  return res.data.data;
};
