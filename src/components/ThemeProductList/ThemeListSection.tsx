import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SectionContainer } from "../Common/SectionLayout";
import { LoadingSpinner } from "../Common/LoadingSpinner";
import ProductItem from "../Common/ProductItem";
import styled from "@emotion/styled";
import { getThemesList } from "@/api/themes";
import { useFetchData } from "@/hooks/useFetchData";
import type { BasicGiftProduct } from "@/types/gift";
import type { ThemeProductsResponse } from "@/types/theme";
import { useAuthContext } from "@/contexts/useAuthContext";
import { toast } from "react-toastify";

type Props = {
  themeId: string;
};

const ThemeListSection = ({ themeId }: Props) => {
  const { user } = useAuthContext();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const [products, setProducts] = useState<BasicGiftProduct[]>([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const location = useLocation();
  const isDirectEnter = location.key === "default";

  const initialListParams = useMemo(
    () => ({ themeId: Number(themeId), cursor: 0, limit: 10 }),
    [themeId]
  );

  const {
    data: initialData,
    loading: listLoading,
    error,
    errorStatus,
    refetch,
  } = useFetchData<ThemeProductsResponse, typeof initialListParams>({
    fetchFn: getThemesList,
    initFetchParams: initialListParams,
  });

  useEffect(() => {
    if (errorStatus === 404) {
      if (isDirectEnter) {
        toast.error("해당 ID에 일치하는 데이터가 없습니다.");
      }
      navigate("/");
    }
  }, [errorStatus, isDirectEnter, navigate]);

  useEffect(() => {
    if (!initialData) return;
    setCursor(initialData.cursor);
    setHasMore(initialData.hasMoreList);

    setProducts((prev) => {
      const existingIds = new Set(prev.map((p) => p.id));
      const filtered = initialData.list.filter(
        (item) => !existingIds.has(item.id)
      );
      return [...prev, ...filtered];
    });
  }, [initialData]);

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    refetch({ themeId: Number(themeId), cursor, limit: 10 });
  }, [hasMore, refetch, themeId, cursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loadMore]);

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

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

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
      {hasMore && (
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
