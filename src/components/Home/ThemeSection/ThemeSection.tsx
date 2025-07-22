import type { ThemeType } from "@/types/theme";
import { useCallback } from "react";
import { SectionContainer, SectionTitle } from "../../Common/SectionLayout";
import { getThemes } from "@/api/themes";
import styled from "@emotion/styled";
import ThemeItem from "./ThemeItem";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { useFetchData } from "@/hooks/useFetchData";
import { useNavigate } from "react-router-dom";

const ThemeSection = () => {
  const fetchFn = useCallback(() => getThemes(), []);

  const { data, loading, error } = useFetchData<ThemeType[]>(fetchFn);
  const navigate = useNavigate();

  const handleClickTheme = (themeId: number) => {
    navigate(`/themes/${themeId}`);
  };

  if (error) {
    return <></>;
  }

  return (
    <SectionContainer>
      <SectionTitle>선물 테마</SectionTitle>
      {loading ? (
        <LoadingSpinner color="#000000" loading={loading} size={35} />
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
