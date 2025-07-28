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

export const getProducts = async (
  productId: number
): Promise<BasicGiftProduct> => {
  const res = await instance.get<{ data: BasicGiftProduct }>(
    `/products/${productId}`
  );
  return res.data.data;
};

type ProductsDetailProps = {
  description: string;
  announcement: {
    name: string;
    value: string;
    displayOrder: number;
  }[];
};

export const getProductsDetail = async (
  productId: number
): Promise<ProductsDetailProps> => {
  const res = await instance.get<{ data: ProductsDetailProps }>(
    `/products/${productId}/detail`
  );
  return res.data.data;
};

type ProductsWishProps = {
  wishCount: number;
  isWished: boolean;
};

export const getProductsWish = async (
  productId: number
): Promise<ProductsWishProps> => {
  const res = await instance.get<{ data: ProductsWishProps }>(
    `/products/${productId}/wish`
  );
  return res.data.data;
};

type ProductHighlightProps = {
  totalCount: number;
  reviews: {
    id: string;
    authorName: string;
    content: string;
  }[];
};

export const getProductsHighlight = async (
  productId: number
): Promise<ProductHighlightProps> => {
  const res = await instance.get<{ data: ProductHighlightProps }>(
    `/products/${productId}/highlight-review`
  );
  return res.data.data;
};
