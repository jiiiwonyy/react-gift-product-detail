import type { BasicGiftProduct } from "@/types/gift";

export type ThemeType = {
  themeId: number;
  name: string;
  image: string;
};

export type ThemeItemType = {
  name: string;
  image: string;
};

export type ThemeInfo = {
  themeId: number;
  name: string;
  title: string;
  description: string;
  backgroundColor: string;
};

export type ThemeProductsResponse = {
  list: BasicGiftProduct[];
  cursor: number;
  hasMoreList: boolean;
};
