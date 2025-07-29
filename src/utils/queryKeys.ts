export const queryKeys = {
  themeId: (themeId: number) => ["themeId", themeId],
  infiniteThemeId: (themeId: number) => ["infiniteThemeId", themeId],
  productId: (productId: number) => ["productId", productId],
  productWish: (id: number) => ["product", id, "wish"],
};
