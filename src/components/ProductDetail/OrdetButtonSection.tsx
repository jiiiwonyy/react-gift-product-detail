import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/useAuthContext";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsWish } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

type Props = {
  productId: string;
};

const OrderButtonSection = ({ productId }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const isLoggedIn = !!user;

  const wishKey = queryKeys.productWish(Number(productId));
  const queryClient = useQueryClient();

  const { data: wishData } = useQuery({
    queryKey: wishKey,
    queryFn: () => getProductsWish(Number(productId)),
    enabled: !!productId,
  });

  const { mutate: toggleWish } = useMutation({
    mutationFn: () =>
      new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 0);
      }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: wishKey });

      const prev = queryClient.getQueryData<typeof wishData>(wishKey);

      if (!prev) return;

      const updated = {
        ...prev,
        isWished: !prev.isWished,
        wishCount: prev.isWished ? prev.wishCount - 1 : prev.wishCount + 1,
      };

      queryClient.setQueryData(wishKey, updated);
      return { prev };
    },

    onError: (_err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(wishKey, context.prev);
      }
    },
  });

  const handleClickItem = (productId: number) => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { from: { pathname: `/order/${productId}` } },
      });
    } else {
      navigate(`/order/${productId}`);
    }
  };

  return (
    <ButtonContainer>
      <WishButton onClick={() => toggleWish()}>
        {wishData?.isWished ? (
          <FaHeart size={24} color="red" />
        ) : (
          <FiHeart size={24} />
        )}
        <WishCount>{wishData?.wishCount}</WishCount>
      </WishButton>
      <OrderButton onClick={() => handleClickItem(Number(productId))}>
        주문하기
      </OrderButton>
    </ButtonContainer>
  );
};

export default OrderButtonSection;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  position: sticky;
  bottom: 0;
`;

const WishButton = styled.button`
  width: 4rem;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  border: none;

  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
  }
`;

const WishCount = styled.div`
  ${({ theme }) => `
    font-size: ${theme.font.label2Regular.size};
    font-weight: ${theme.font.label2Regular.weight};
    line-height: ${theme.font.label2Regular.lineHeight};`}
`;

const OrderButton = styled.button`
  background-color: ${({ theme }) => theme.colors.kakaoYellow};
  padding: 12px 16px;
  border-radius: 0;
  border: none;
  width: 100%;
  ${({ theme }) => `
    font-size: ${theme.font.subtitle1Bold.size};
    font-weight: ${theme.font.subtitle1Bold.weight};
    line-height: ${theme.font.subtitle1Bold.lineHeight};`}

  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
  }
`;
