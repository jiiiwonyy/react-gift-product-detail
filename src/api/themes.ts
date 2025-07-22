import instance from "./axiosInstance";
import type { ThemeType } from "@/types/theme";
import type { AxiosResponse } from "axios";
import type { ThemeProductsResponse } from "@/types/theme";
import type { ThemeInfo } from "@/types/theme";

export const getThemes = async (): Promise<
  AxiosResponse<{ data: ThemeType[] }>
> => {
  return await instance.get<{ data: ThemeType[] }>("/themes");
};

export const getThemesDetail = async (
  themeId: number
): Promise<AxiosResponse<ThemeInfo>> => {
  // 1) Tell axios that the server sends { data: ThemeDetail }
  const res = await instance.get<{ data: ThemeInfo }>(
    `/themes/${themeId}/info`
  );
  return {
    ...res,
    data: res.data.data,
  } as AxiosResponse<ThemeInfo>;
};

export const getThemesList = async (params: {
  themeId: number;
  cursor?: number;
  limit?: number;
}): Promise<AxiosResponse<ThemeProductsResponse>> => {
  const res = await instance.get<{ data: ThemeProductsResponse }>(
    `/themes/${params.themeId}/products`,
    {
      params: { cursor: params.cursor, limit: params.limit },
    }
  );

  return { ...res, data: res.data.data } as AxiosResponse;
};
