import { getThemesDetail } from "@/api/themes";
import styled from "@emotion/styled";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

type Props = {
  themeId: string;
};

const HeroBannerSection = ({ themeId }: Props) => {
  const { data: themeInfo } = useSuspenseQuery({
    queryKey: queryKeys.theme.infiniteProducts(Number(themeId)),
    queryFn: () => getThemesDetail(Number(themeId)),
    retry: false,
  });

  return (
    <HeroBanner bgColor={themeInfo.backgroundColor}>
      <ThemeName>{themeInfo.name}</ThemeName>
      <ThemeTitle>{themeInfo.title}</ThemeTitle>
      <ThemeDescription>{themeInfo.description}</ThemeDescription>
    </HeroBanner>
  );
};

export default HeroBannerSection;

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
