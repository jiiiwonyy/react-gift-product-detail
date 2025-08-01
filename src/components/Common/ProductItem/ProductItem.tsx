import styled from "@emotion/styled";
import type { BasicGiftProduct } from "@/types/gift";

type ProductItemProps = BasicGiftProduct & {
  rank?: number;
  highlightCondition?: (rank: number) => boolean;
  onClick?: () => void;
};

const ProductItem = ({
  name,
  imageURL,
  price,
  brandInfo,
  rank,
  highlightCondition = (rank) => rank <= 3,
  onClick,
}: ProductItemProps) => {
  return (
    <ItemWrapper data-testid="product-item" onClick={onClick}>
      <ImageWrapper>
        <ProductImage src={imageURL} alt={name} />
        {rank !== undefined && (
          <RankBadge isTop={highlightCondition(rank)}>{rank}</RankBadge>
        )}
      </ImageWrapper>
      <ItemBrand>{brandInfo.name}</ItemBrand>
      <ItemName>{name}</ItemName>
      <ItemPrice>{price.sellingPrice.toLocaleString()}원</ItemPrice>
    </ItemWrapper>
  );
};

export default ProductItem;

const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  width: 100%;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 6px;
  overflow: hidden;
`;

const ProductImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RankBadge = styled.div<{ isTop: boolean }>`
  position: absolute;
  top: 6px;
  left: 6px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${({ isTop, theme }) =>
    isTop ? theme.colors.red500 : theme.colors.gray600};
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemBrand = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.body2Regular.size};
    font-weight: ${theme.font.body2Regular.weight};
    line-height: ${theme.font.body2Regular.lineHeight};
  `}
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.gray600};
`;

const ItemName = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.body2Regular.size};
    font-weight: ${theme.font.body2Regular.weight};
    line-height: ${theme.font.body2Regular.lineHeight};
  `}
  overflow: hidden;
  white-space: normal;
  word-break: break-word;
`;

const ItemPrice = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.subtitle1Bold.size};
    font-weight: ${theme.font.subtitle1Bold.weight};
    line-height: ${theme.font.subtitle1Bold.lineHeight};
  `}
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
