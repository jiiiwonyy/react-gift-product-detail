export const queryKeys = {
  product: {
    base: (id: number) => ["product", id],
    summary: (id: number) => ["product", id, "summary"],
    detail: (id: number) => ["product", id, "detail"],
    wish: (id: number) => ["product", id, "wish"],
    highlight: (id: number) => ["product", id, "highlight"],
  },
  ranking: (targetType: string, rankType: string) => [
    "ranking",
    targetType,
    rankType,
  ],
  theme: {
    list: () => ["themes"],
    info: (id: number) => ["theme", id, "info"],
    products: (id: number) => ["theme", id, "products"],
    infiniteProducts: (id: number) => ["theme", id, "products", "infinite"],
  },
};
