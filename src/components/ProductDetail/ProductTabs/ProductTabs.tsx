import styled from "@emotion/styled";

type Props = {
  selected: "description" | "info" | "review";
  onSelect: (tab: "description" | "info" | "review") => void;
};

export default function ProductTabs({ selected, onSelect }: Props) {
  return (
    <TabWrapper>
      <TabItem
        isActive={selected === "description"}
        onClick={() => onSelect("description")}
      >
        상품설명
      </TabItem>
      <TabItem
        isActive={selected === "review"}
        onClick={() => onSelect("review")}
      >
        선물후기
      </TabItem>
      <TabItem isActive={selected === "info"} onClick={() => onSelect("info")}>
        상세정보
      </TabItem>
    </TabWrapper>
  );
}

const TabWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderDefault};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
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
