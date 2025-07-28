import { useQuery } from "@tanstack/react-query";
import { getProductsHighlight } from "@/api/products";

type Props = {
  productId: number;
};

export default function ReviewTab({ productId }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductsHighlight(Number(productId)),
  });

  if (isLoading) return <p>후기 불러오는 중...</p>;
  if (error) return <p>후기 로딩 실패</p>;
  if (data?.reviews.length === 0) return <p>아직 등록된 리뷰가 없어요.</p>;
  return (
    <ul>
      {data?.reviews.map((review) => (
        <li key={review.id} style={{ marginBottom: "1rem" }}>
          <strong>{review.authorName}</strong>
          <p style={{ whiteSpace: "pre-line" }}>{review.content}</p>
        </li>
      ))}
    </ul>
  );
}
