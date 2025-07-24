import styled from "@emotion/styled";

const RANKING_LIST = [
  { label: "받고싶어한", value: "MANY_WISH" },
  { label: "많이 선물한", value: "MANY_RECEIVE" },
  { label: "위시로 받은", value: "MANY_WISH_RECEIVE" },
] as const;

type Props = {
  selected: string;
  onChange: (key: string) => void;
};

const RankingTextCategory = ({ selected, onChange }: Props) => {
  return (
    <RankingCategoryWrapper>
      {RANKING_LIST.map(({ label, value }) => (
        <RankingCategoryItem
          key={value}
          active={selected === value}
          onClick={() => onChange(value)}
        >
          {label}
        </RankingCategoryItem>
      ))}
    </RankingCategoryWrapper>
  );
};

export default RankingTextCategory;

const RankingCategoryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 720px;
  background-color: ${({ theme }) => theme.colors.blue100};
  border-radius: 6px;
  padding: ${({ theme }) => theme.spacing.spacing1};
  border: 1px solid ${({ theme }) => theme.colors.blue400};
`;

const RankingCategoryItem = styled.button<{ active: boolean }>`
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.spacing2};
  font-size: ${({ theme }) => theme.font.body1Regular.size};
  font-weight: ${({ theme }) => theme.font.body1Regular.weight};
  line-height: ${({ theme }) => theme.font.body1Regular.lineHeight};
  background-color: transparent;
  color: ${({ active, theme }) =>
    active ? theme.colors.blue700 : theme.colors.blue400};
  cursor: pointer;
  border: none;
  &:focus {
    outline: none;
  }
`;
