type BaseProduct = {
  id: number;
  name: string;
  imageURL: string;
};

export type BasicGiftProduct = BaseProduct & {
  price: GiftPrice;
  brandInfo: BrandInfo;
};

export type SummaryGiftProduct = BaseProduct & {
  price: number;
  brandName: string;
};

export type GiftPrice = {
  basicPrice: number;
  discountRate: number;
  sellingPrice: number;
};

export type BrandInfo = {
  id: number;
  name: string;
  imageURL: string;
};
