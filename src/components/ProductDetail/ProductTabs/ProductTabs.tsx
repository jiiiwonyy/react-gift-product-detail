import styled from "@emotion/styled";

const TAB_LIST = [
  { key: "description", label: "상품설명" },
  { key: "review", label: "선물후기" },
  { key: "info", label: "상세정보" },
] as const;

type TabKey = (typeof TAB_LIST)[number]["key"];

type Props = {
  selected: TabKey;
  onSelect: (tab: TabKey) => void;
};

export default function ProductTabs({ selected, onSelect }: Props) {
  return (
    <TabWrapper>
      {TAB_LIST.map(({ key, label }) => (
        <TabItem
          key={key}
          isActive={selected === key}
          onClick={() => onSelect(key)}
        >
          {label}
        </TabItem>
      ))}
    </TabWrapper>
  );
}

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  width: 100%;
`;

const TabItem = styled.button<{ isActive: boolean }>`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  border-radius: 0;
  border-bottom: 2px solid
    ${({ isActive }) => (isActive ? "#000" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#000" : "#666")};
  cursor: pointer;

  &:hover {
    background-color: #eeeeee;
    border-bottom: 2px solid
      ${({ isActive }) => (isActive ? "#000" : "transparent")};
  }

  &:active {
    background-color: #f0f0f0;
    border-bottom: 2px solid
      ${({ isActive }) => (isActive ? "#000" : "transparent")};
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid
      ${({ isActive }) => (isActive ? "#000" : "transparent")};
  }
`;
