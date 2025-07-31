import styled from "@emotion/styled";

export const SectionContainer = styled.section`
  width: 100%;
  max-width: 720px;
  padding: ${({ theme }) => ` ${theme.spacing.spacing2}`}
    ${({ theme }) => ` ${theme.spacing.spacing4}`};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
`;

export const SectionTitle = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.title1Bold.size};
    font-weight: ${theme.font.title1Bold.weight};
    line-height: ${theme.font.title1Bold.lineHeight};`}
`;
