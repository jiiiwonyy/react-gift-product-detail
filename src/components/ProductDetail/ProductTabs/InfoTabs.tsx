import styled from "@emotion/styled";

type AnnouncementsItem = {
  name: string;
  value: string;
  displayOrder: number;
};

type Props = {
  announcements: AnnouncementsItem[];
};

export default function InfoTab({ announcements }: Props) {
  if (announcements.length === 0) {
    return;
  }

  const sorted = [...announcements].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <InfoTabContainer>
      {sorted.map((item) => (
        <InfoContainer key={item.name}>
          <InfoName>{item.name}</InfoName>
          <InfoContent> {item.value}</InfoContent>
        </InfoContainer>
      ))}
    </InfoTabContainer>
  );
}

const InfoTabContainer = styled.ul`
  margin-bottom: 5rem;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoContainer = styled.li`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoName = styled.div`
  ${({ theme }) => `
    font-size: ${theme.font.subtitle2Bold.size};
    font-weight: ${theme.font.subtitle2Bold.weight};
    line-height: ${theme.font.subtitle2Bold.lineHeight};
  `}
`;

const InfoContent = styled.p`
  whitespace: pre-line;
  ${({ theme }) => `
    font-size: ${theme.font.body1Regular.size};
    font-weight: ${theme.font.body1Regular.weight};
    line-height: ${theme.font.body1Regular.lineHeight};
  `}
`;
