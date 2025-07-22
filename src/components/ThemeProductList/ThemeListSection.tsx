import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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

const ThemeListSection = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const [products, setProducts] = useState<BasicGiftProduct[]>([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuthContext();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

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
    if (initialData) {
      setProducts(initialData.list);
      setCursor(initialData.cursor);
      setHasMore(initialData.hasMoreList);
    }
  }, [initialData]);

  const loadMore = useCallback(async () => {
    const res = await getThemesList({
      themeId: Number(themeId),
      cursor,
      limit: 10,
    });
    const data = res.data;
    setProducts((prev) => [...prev, ...data.list]);
    setCursor(data.cursor);
    setHasMore(data.hasMoreList);
  }, [themeId, cursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
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

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <SectionContainer>
      {listLoading ? (
        <LoadingSpinner color="#000000" loading={listLoading} size={35} />
      ) : products?.length === 0 ? (
        <ErrorMessage>
          <>상품이 없습니다.</>
        </ErrorMessage>
      ) : (
        <ProudctList>
          {(products ?? []).map((product) => (
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
      )}
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
