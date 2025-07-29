import { SectionContainer, SectionTitle } from "../../Common/SectionLayout";
import { getThemes } from "@/api/themes";
import styled from "@emotion/styled";
import ThemeItem from "./ThemeItem";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import type { ThemeType } from "@/types/theme";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

const ThemeSection = () => {
  const { data, isLoading, isError } = useQuery<ThemeType[], void>({
    queryKey: queryKeys.theme.list(),
    queryFn: getThemes,
  });

  const navigate = useNavigate();

  const handleClickTheme = (themeId: number) => {
    navigate(`/themes/${themeId}`);
  };

  if (isError) {
    return <></>;
  }

  return (
    <SectionContainer>
      <SectionTitle>선물 테마</SectionTitle>
      {isLoading ? (
        <LoadingSpinner color="#000000" loading={isLoading} size={35} />
      ) : (
        <ThemeGrid>
          {(data ?? []).map((t) => (
            <ThemeItem
              key={t.themeId}
              name={t.name}
              image={t.image}
              onClick={() => handleClickTheme(t.themeId)}
            />
          ))}
        </ThemeGrid>
      )}
    </SectionContainer>
  );
};

export default ThemeSection;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.spacing4};
  margin-top: ${({ theme }) => theme.spacing.spacing4};
`;
