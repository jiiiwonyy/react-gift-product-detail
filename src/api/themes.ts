import instance from "./axiosInstance";
import type { ThemeType } from "@/types/theme";
import type { ThemeProductsResponse } from "@/types/theme";
import type { ThemeInfo } from "@/types/theme";

export const getThemes = async (): Promise<ThemeType[]> => {
  const res = await instance.get<{ data: ThemeType[] }>("/themes");
  {
    return res.data.data;
  }
};

export const getThemesDetail = async (themeId: number): Promise<ThemeInfo> => {
  const res = await instance.get<{ data: ThemeInfo }>(
    `/themes/${themeId}/info`
  );

  return res.data.data;
};

export const getThemesList = async (params: {
  themeId: number;
  cursor?: number;
  limit?: number;
}): Promise<ThemeProductsResponse> => {
  const res = await instance.get<{ data: ThemeProductsResponse }>(
    `/themes/${params.themeId}/products`,
    { params: { cursor: params.cursor, limit: params.limit } }
  );

  return res.data.data;
};
