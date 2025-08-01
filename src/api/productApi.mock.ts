import { http, HttpResponse } from "msw";

export const getRankingHandlers = [
  http.get("http://localhost:3000/api/products/ranking", () => {
    return HttpResponse.json({
      data: Array.from({ length: 21 }).map((_, i) => ({
        id: i + 1,
        name: `상품 ${i + 1}`,
        imageURL: `https://example.com/${i + 1}.jpg`,
        price: { sellingPrice: 1000 + i * 100 },
        brandInfo: { name: `브랜드 ${i + 1}` },
      })),
    });
  }),
];
