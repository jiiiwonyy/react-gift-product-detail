import { SectionContainer, SectionTitle } from "../Common/SectionLayout";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import { useEffect } from "react";
import axios from "axios";
import { LoadingSpinner } from "../Common/LoadingSpinner";
import styled from "@emotion/styled";

type Props = {
  productId: string;
};
const ProductImageSection = ({ productId }: Props) => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["productId", productId],
    queryFn: () => getProducts(Number(productId)),
    enabled: !!productId,
    retry: false,
  });

  useEffect(() => {
    if (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          navigate("/");
        } else if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  }, [error, navigate]);

  if (isLoading)
    return <LoadingSpinner color="#000000" loading={isLoading} size={35} />;

  return (
    <>
      <ProductImage src={data?.imageURL}></ProductImage>
      <ProductInfoContainer>
        <SectionTitle>{data?.name}</SectionTitle>
        <ProductPrice>
          {data?.price.sellingPrice.toLocaleString()}원
        </ProductPrice>
      </ProductInfoContainer>
      <DivdierLine />
      <BrandInfoBox>
        <BrandIcon src={data?.brandInfo.imageURL} />
        <BrandName>{data?.brandInfo.name}</BrandName>
      </BrandInfoBox>
    </>
  );
};

const ProductInfoContainer = styled(SectionContainer)`
  margin: 0.5rem 0;
`;
const ProductImage = styled.img`
  width: 100%;
`;

const ProductPrice = styled.div`
  ${({ theme }) => `
    font-size: ${theme.font.title1Bold.size};
    font-weight: ${theme.font.title1Bold.weight};
    line-height: ${theme.font.title1Bold.lineHeight};`}
  margin-top: 4px;
`;

const DivdierLine = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  width: 100%;
`;

const BrandInfoBox = styled(SectionContainer)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin: 0.5rem 0;
`;

const BrandIcon = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

const BrandName = styled.div``;

export default ProductImageSection;
