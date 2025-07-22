import Header from "@/components/Common/Header";
import Layout from "@/components/Common/Layout";
import { SectionContainer } from "@/components/Common/SectionLayout";
import styled from "@emotion/styled";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { getThemesDetail, getThemesList } from "@/api/themes";
import { useFetchData } from "@/hooks/useFetchData";
import type { BasicGiftProduct } from "@/types/gift";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { toast } from "react-toastify";
import ProductItem from "@/components/Common/ProductItem";
import { useAuthContext } from "@/contexts/useAuthContext";
import type { ThemeProductsResponse } from "@/types/theme";

const ThemeProductList = () => {
  const { themeId } = useParams<{ themeId: string }>();
  const navigate = useNavigate();

  const [products, setProducts] = useState<BasicGiftProduct[]>([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const isDirectEnter = location.key === "default";

  const { data: themeInfo, loading: heroLoading } = useFetchData({
    fetchFn: getThemesDetail,
    initFetchParams: Number(themeId),
  });

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

  const { user } = useAuthContext();
  const isLoggedIn = !!user;

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
    <Layout>
      <Header title="선물하기" />

      <ListContainer>
        <HeroBanner bgColor={themeInfo?.backgroundColor}>
          <ThemeName>{themeInfo?.name}</ThemeName>
          <ThemeTitle>{themeInfo?.title}</ThemeTitle>
          <ThemeDescription>{themeInfo?.description}</ThemeDescription>
        </HeroBanner>
        {heroLoading ? (
          <LoadingSpinner color="#000000" loading={heroLoading} size={35} />
        ) : (
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
        )}
      </ListContainer>
    </Layout>
  );
};

export default ThemeProductList;

const ListContainer = styled.form`
  width: 100%;
  max-width: 720px;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  overflow-y: auto;
  margin: 0 auto;
  padding-bottom: 60px;
`;

const HeroBanner = styled.div<{ bgColor?: string }>`
  width: 100%;
  background-color: ${(props) => props.bgColor};
  padding: ${({ theme }) => theme.spacing.spacing6}
    ${({ theme }) => theme.spacing.spacing4};
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const ThemeName = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.subtitle2Bold.size};
    font-weight: ${theme.font.subtitle2Bold.weight};
    line-height: ${theme.font.subtitle2Bold.lineHeight};
  `}
  color: #ffffff
`;

const ThemeTitle = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.title1Bold.size};
    font-weight: ${theme.font.title1Bold.weight};
    line-height: ${theme.font.title1Bold.lineHeight};
  `}
  color: #ffffff
`;

const ThemeDescription = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.body1Regular.size};
    font-weight: ${theme.font.body1Regular.weight};
    line-height: ${theme.font.body1Regular.lineHeight};
  `}
  color: #ffffff
`;

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
