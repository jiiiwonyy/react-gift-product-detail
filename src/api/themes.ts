import instance from "./axiosInstance";

export const getThemes = () => {
  return instance.get("/themes");
};

export const getThemesDetail = (themeId: number) => {
  return instance.get(`/themes/${themeId}/info`);
};

export const getThemesList = (
  themeId: number,
  cursor: number,
  limit: number
) => {
  return instance.get(`/themes/${themeId}/products`, {
    params: { cursor, limit },
  });
};
