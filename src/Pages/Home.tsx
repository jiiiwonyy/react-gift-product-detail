import Header from "@/components/Common/Header";
import styled from "@emotion/styled";
import { FiPlus } from "react-icons/fi";
import RankingSection from "@/components/Home/RankingSection/RankingSection";
import { useAuthContext } from "@/contexts/useAuthContext";
import ThemeSection from "@/components/Home/ThemeSection/ThemeSection";
import Layout from "@/components/Common/Layout";

const Home = () => {
  const { user } = useAuthContext();
  const nickname = user?.name;

  return (
    <Layout>
      <Header title="선물하기" />
      <HomeContainer>
        <SelectFriendSection>
          <SelectFriend>
            <FiPlusIcon size={16} />
            <SelectFriendText>
              {nickname ? `${nickname}님! ` : ""}선물할 친구를 선택해 주세요.
            </SelectFriendText>
          </SelectFriend>
        </SelectFriendSection>
        <ThemeSection />
        <CheerBannerSection>
          <CheerBanner>
            <CheerBannerLabel>카카오테크 캠퍼스 3기 여러분</CheerBannerLabel>
            <CheerBannerText>프론트엔드 2단계 과제 화이팅!🎉</CheerBannerText>
          </CheerBanner>
        </CheerBannerSection>
        <RankingSection />
      </HomeContainer>
    </Layout>
  );
};

export default Home;

const HomeContainer = styled.main`
  width: 100%;
  max-width: 720px;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  overflow-y: auto;
  margin: 0 auto;
`;

const SelectFriendSection = styled.section`
  background-color: ${({ theme }) => theme.colors.gray200};
  width: 100%;
  display: flex;
  padding: 16px 12px;
`;

const SelectFriend = styled.button`
  display: flex;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  border-radius: 18px;
  max-width: 720px;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.spacing4}`};
  gap: ${({ theme }) => theme.spacing.spacing2};
  border: none;
  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
  }
`;

const FiPlusIcon = styled(FiPlus)`
  background-color: ${({ theme }) => theme.colors.kakaoYellow};
  border-radius: 16px;
  width: 36px;
  height: 36px;
  padding: ${({ theme }) => theme.spacing.spacing1};
`;

const SelectFriendText = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.subtitle1Bold.size};
    font-weight: ${theme.font.subtitle1Bold.weight};
    line-height: ${theme.font.subtitle1Bold.lineHeight};
  `}
`;

const CheerBannerSection = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  width: 100%;
  display: flex;
  padding: 16px;
`;

const CheerBanner = styled.button`
  display: flex;
  background-color: ${({ theme }) => theme.colors.kakaoYellow};
  cursor: pointer;
  border-radius: 18px;
  align-items: flex-start;
  max-width: 720px;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.spacing3}`};
  gap: ${({ theme }) => theme.spacing.spacing2};
  border: none;
  flex-direction: column;
  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
  }
  gap: 2px;
`;

const CheerBannerLabel = styled.div`
  ${({ theme }) => `
    font-size: ${theme.font.label2Regular.size};
    font-weight: 600;
    line-height: ${theme.font.label2Regular.lineHeight};
  `}
  color: ${({ theme }) => theme.colors.gray700};
`;

const CheerBannerText = styled.div`
  ${({ theme }) => `
    font-size: ${theme.font.body2Regular.size};
    font-weight: 600;
    line-height: ${theme.font.body2Regular.lineHeight};
    `}
`;
