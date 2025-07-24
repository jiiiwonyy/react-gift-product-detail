import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SectionContainer } from "../Common/SectionLayout";
import { LoadingSpinner } from "../Common/LoadingSpinner";
import ProductItem from "../Common/ProductItem";
import styled from "@emotion/styled";
import { getThemesList } from "@/api/themes";
import type { BasicGiftProduct } from "@/types/gift";
import type { ThemeProductsResponse } from "@/types/theme";
import { useAuthContext } from "@/contexts/useAuthContext";
import { toast } from "react-toastify";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useInView } from "react-intersection-observer";

type Props = {
  themeId: string;
};

const ThemeListSection = ({ themeId }: Props) => {
  const { user } = useAuthContext();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const { ref: loaderRef, inView } = useInView({ threshold: 1.0 });
  const location = useLocation();
  const isDirectEnter = location.key === "default";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading: listLoading,
    error,
    isError,
  } = useInfiniteQuery<ThemeProductsResponse, AxiosError>({
    queryKey: ["themes", themeId],
    queryFn: ({ pageParam = 0 }) =>
      getThemesList({
        themeId: Number(themeId),
        cursor: pageParam as number,
        limit: 10,
      }),
    initialPageParam: 0,
    enabled: !!themeId,
    getNextPageParam: (lastPage) =>
      lastPage.hasMoreList ? lastPage.cursor : undefined,
  });

  useEffect(() => {
    if (isError) {
      if (error.response?.status === 404 && isDirectEnter) {
        toast.error("해당 ID에 일치하는 데이터가 없습니다.");
      }
      navigate("/");
    }
  }, [isError, error, isDirectEnter, navigate]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products: BasicGiftProduct[] =
    data?.pages.flatMap((page) => page.list) ?? [];

  const handleClickItem = (productId: number) => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: { pathname: `/order/${productId}` } },
      });
    } else {
      navigate(`/order/${productId}`);
    }
  };

  if (listLoading && products.length === 0) {
    return (
      <SectionContainer>
        <LoadingSpinner color="#000000" loading={listLoading} size={35} />
      </SectionContainer>
    );
  }

  if (!products || products.length === 0) {
    return (
      <SectionContainer>
        <ErrorMessage>상품이 없습니다.</ErrorMessage>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer>
      <ProudctList>
        {products.map((product) => (
          <ProductItem
            key={product.id}
            id={product.id}
            name={product.name}
            imageURL={product.imageURL}
            price={product.price}
            brandInfo={product.brandInfo}
            onClick={() => handleClickItem(product.id)}
          />
        ))}
      </ProudctList>
      {hasNextPage && (
        <LoadingSpinner
          color="#000000"
          loading={true}
          size={35}
          marginSize={0}
        />
      )}
      <div ref={loaderRef} style={{ height: "20px" }} />
    </SectionContainer>
  );
};

export default ThemeListSection;

const ProudctList = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 8px;
  margin-top: ${({ theme }) => theme.spacing.spacing2};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
  backgorund-color: ${({ theme }) => theme.colors.backgroundDefault};
`;
