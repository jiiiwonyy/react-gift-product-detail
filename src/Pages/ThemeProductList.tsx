import Header from "@/components/Common/Header";
import Layout from "@/components/Common/Layout";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import HeroBannerSection from "@/components/ThemeProductList/HeroBannerSection";
import ThemeListSection from "@/components/ThemeProductList/ThemeListSection";
import { ErrorBoundary } from "@/components/Common/ErrorBoundary";
import { Suspense } from "react";
import { ErrorFallback } from "@/components/Common/ErrorFallback";

const ThemeProductList = () => {
  const { themeId = "" } = useParams<{ themeId: string }>();

  return (
    <Layout>
      <Header title="선물하기" />
      <ListContainer>
        <ErrorBoundary
          fallbackRender={({ error }) => <ErrorFallback error={error} />}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <HeroBannerSection themeId={themeId} />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary fallbackRender={() => <></>}>
          <Suspense fallback={<LoadingSpinner />}>
            <ThemeListSection themeId={themeId} />
          </Suspense>
        </ErrorBoundary>
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
