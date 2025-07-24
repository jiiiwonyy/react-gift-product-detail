import TargetCategory from "./TargetCategory";
import RankingCategory from "./RankingCategory";
import ProductItem from "@/components/Common/ProductItem";
import styled from "@emotion/styled";
import { useState, useMemo } from "react";
import {
  SectionContainer,
  SectionTitle,
} from "@/components/Common/SectionLayout";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/useAuthContext";
import { getRanking } from "@/api/products";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { useFetchData } from "@/hooks/useFetchData";
import type { BasicGiftProduct } from "@/types/gift";

const RankingSection = () => {
  const [showAll, setShowAll] = useState(false);

  const RANK_COUNT = showAll ? 21 : 6;
  const toggleShowAll = () => setShowAll((prev) => !prev);

  const navigate = useNavigate();

  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  const [searchParams, setSearchParams] = useSearchParams();

  const targetType = searchParams.get("targetType") || "ALL";
  const rankType = searchParams.get("rankType") || "MANY_WISH";

  const rankingParams = useMemo(
    () => ({ targetType, rankType }),
    [targetType, rankType]
  );

  const handleGenderChange = (newTarget: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("targetType", newTarget);
      return newParams;
    });
  };

  const handleCategoryChange = (newRankType: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("rankType", newRankType);
      return newParams;
    });
  };

  const handleClickItem = (productId: number) => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: { pathname: `/order/${productId}` } },
      });
    } else {
      navigate(`/order/${productId}`);
    }
  };

  const { data, loading, error } = useFetchData<
    { data: BasicGiftProduct[] },
    typeof rankingParams
  >({
    fetchFn: getRanking,
    initFetchParams: rankingParams,
  });

  if (error) {
    return (
      <ErrorMessage>
        <>상품이 없습니다.</>
      </ErrorMessage>
    );
  }

  return (
    <SectionContainer>
      <SectionTitle>실시간 급상승 선물랭킹</SectionTitle>
      <TargetCategory selected={targetType} onChange={handleGenderChange} />
      <RankingCategory selected={rankType} onChange={handleCategoryChange} />
      {loading ? (
        <LoadingSpinner color="#000000" loading={loading} size={35} />
      ) : data?.data.length === 0 ? (
        <ErrorMessage>
          <>상품이 없습니다.</>
        </ErrorMessage>
      ) : (
        <>
          <RankingGrid>
            {data?.data.slice(0, RANK_COUNT).map((item, index) => (
              <ProductItem
                key={item.id}
                rank={index + 1}
                id={item.id}
                name={item.name}
                imageURL={item.imageURL}
                price={item.price}
                brandInfo={item.brandInfo}
                onClick={() => handleClickItem(item.id)}
              />
            ))}
          </RankingGrid>
          <MoreButton onClick={toggleShowAll}>
            {showAll ? "접기" : "더보기"}
          </MoreButton>
        </>
      )}
    </SectionContainer>
  );
};

export default RankingSection;

const RankingGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 8px;
  margin-top: ${({ theme }) => theme.spacing.spacing2};
`;

const MoreButton = styled.button`
  margin: ${({ theme }) => theme.spacing.spacing3} auto 0;
  width: 100%;
  display: block;
  font-weight: bold;
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray500};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  color: ${({ theme }) => theme.colors.gray700};
  cursor: pointer;
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.gray500};
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
    border: 1px solid ${({ theme }) => theme.colors.gray500};
  }

  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;
  backgorund-color: ${({ theme }) => theme.colors.backgroundDefault};
`;
