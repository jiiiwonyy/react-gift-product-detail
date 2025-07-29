import { useQuery } from "@tanstack/react-query";
import { getProductsHighlight } from "@/api/products";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import styled from "@emotion/styled";

type Props = {
  productId: number;
};

export default function ReviewTab({ productId }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["productReviews", productId],
    queryFn: () => getProductsHighlight(Number(productId)),
  });

  if (isLoading)
    return <LoadingSpinner color="#000000" loading={isLoading} size={35} />;

  if (error) return <p>후기 로딩 실패</p>;
  if (data?.reviews.length === 0) return <p>아직 등록된 리뷰가 없어요.</p>;
  return (
    <ReviewTabContainer>
      {data?.reviews.map((review) => (
        <ReviewContainer key={review.id}>
          <ReviewerName>{review.authorName}</ReviewerName>
          <ReviewContent>{review.content}</ReviewContent>
        </ReviewContainer>
      ))}
    </ReviewTabContainer>
  );
}

const ReviewTabContainer = styled.ul`
  margin-bottom: 5rem;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ReviewContainer = styled.li`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReviewerName = styled.div`
  ${({ theme }) => `
    font-size: ${theme.font.subtitle2Bold.size};
    font-weight: ${theme.font.subtitle2Bold.weight};
    line-height: ${theme.font.subtitle2Bold.lineHeight};
  `}
`;

const ReviewContent = styled.p`
  whitespace: pre-line;
  ${({ theme }) => `
    font-size: ${theme.font.body1Regular.size};
    font-weight: ${theme.font.body1Regular.weight};
    line-height: ${theme.font.body1Regular.lineHeight};
  `}
`;
