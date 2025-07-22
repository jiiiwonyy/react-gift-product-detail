import Header from "@/components/Common/Header";
import Layout from "@/components/Common/Layout";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { getThemesDetail } from "@/api/themes";
import { useFetchData } from "@/hooks/useFetchData";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";

import HeroBannerSection from "@/components/ThemeProductList/HeroBannerSection";
import ThemeListSection from "@/components/ThemeProductList/ThemeListSection";

const ThemeProductList = () => {
  const { themeId = "" } = useParams<{ themeId: string }>();

  const { data: themeInfo, loading: heroLoading } = useFetchData({
    fetchFn: getThemesDetail,
    initFetchParams: Number(themeId),
  });

  return (
    <Layout>
      <Header title="선물하기" />
      <ListContainer>
        <HeroBannerSection themeInfo={themeInfo} />
        {heroLoading ? (
          <LoadingSpinner color="#000000" loading={heroLoading} size={35} />
        ) : (
          <ThemeListSection themeId={themeId} />
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
