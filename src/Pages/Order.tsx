import Header from "@/components/Common/Header";
import Divider from "@/components/Common/Divider";
import styled from "@emotion/styled";
import { SectionContainer } from "@/components/Common/SectionLayout";
import CardList from "@/components/Order/CardList";
import { useCardSelection } from "@/hooks/useCardSelection";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ReceiverListModal from "@/components/Order/ReceiverListModal";
import {
  InputWrapper,
  StyledInput,
  CaptionText,
} from "@/components/Common/BorderInputBox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSchema } from "@/schema/order";
import type { Receiver } from "@/schema/receiver";
import type { OrderType } from "@/schema/order";
import { getProudctSummary } from "@/api/products";
import { useAuthContext } from "@/contexts/useAuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { postOrder } from "@/api/order";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import Layout from "@/components/Common/Layout";
import { useQuery, useMutation } from "@tanstack/react-query";

const Order = () => {
  const { selectedCard, selectCard } = useCardSelection();
  const { productId } = useParams<{ productId: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const {
    data: item,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["productSummary", productId],
    queryFn: () => getProudctSummary(Number(productId)),
    enabled: !!productId,
  });

  useEffect(() => {
    if (axios.isAxiosError(error) && isError) {
      if (error.response?.status === 404) {
        navigate("/");
        toast.error("해당 ID에 일치하는 데이터가 없습니다.");
      } else if (error.response?.status === 401) {
        navigate("/login");
        toast.error("로그인이 필요합니다.");
      }
    }
  }, [error, isError, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OrderType>({
    resolver: zodResolver(OrderSchema),
    defaultValues: { senderName: user?.name || "", message: "" },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: postOrder,
    onSuccess: (res, variables) => {
      if (res.data.data.success) {
        alert(
          `주문 완료!\n상품: ${item?.name}\n수량: ${totalCount}\n보내는 사람: ${variables.ordererName}\n메시지: ${variables.message}`
        );
        navigate("/");
      }
    },
  });

  const [isReceiverModalOpen, setIsReceiverModalOpen] = useState(false);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [receiverError, setReceiverError] = useState(false);

  const handleOrderSubmit = async (data: OrderType) => {
    const hasNoReceivers = receivers.length < 1;
    setReceiverError(hasNoReceivers);
    if (hasNoReceivers) {
      toast.error("받는 사람이 없습니다.");
      return;
    }

    const payload = {
      productId: Number(productId),
      message: data.message,
      messageCardId: selectedCard ? String(selectedCard.id) : "",
      ordererName: data.senderName,
      receivers: receivers.map((r) => ({
        name: r.receiverName,
        phoneNumber: r.receiverPhoneNumber,
        quantity: r.itemCount ?? 1,
      })),
    };
    mutation.mutate(payload);
  };

  const handleSelectCard = (card: typeof selectedCard) => {
    selectCard(card!);
    setValue("message", card!.defaultTextMessage);
    hasUserEditedMessage.current = false;
  };

  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("message", e.target.value);
  };

  const hasUserEditedMessage = useRef(false);

  const handleOpenReceiverModal = () => {
    setIsReceiverModalOpen(true);
  };

  const handleModalAddOrEdit = (newReceivers: Receiver[]) => {
    setReceivers(newReceivers);
    setIsReceiverModalOpen(false);
  };

  const handleModalClose = () => {
    setIsReceiverModalOpen(false);
  };

  useEffect(() => {
    if (
      selectedCard?.defaultTextMessage &&
      !hasUserEditedMessage.current &&
      getValues("message") === ""
    ) {
      setValue("message", selectedCard.defaultTextMessage);
    }
  }, [selectedCard, getValues, setValue]);

  const totalCount = receivers.reduce(
    (acc, curr) => acc + (curr.itemCount ?? 0),
    0
  );
  const totalPrice = totalCount * (item?.price ?? 0);

  return (
    <Layout>
      <Header title="선물하기" />
      {isLoading ? (
        <LoadingSpinner color="#000000" loading={isLoading} size={35} />
      ) : (
        <OrderContainer
          onSubmit={handleSubmit(handleOrderSubmit, () =>
            setReceiverError(receivers.length < 1)
          )}
        >
          <SectionContainer>
            <CardList
              selectedCardId={selectedCard?.id}
              onSelectCard={handleSelectCard}
            />

            {selectedCard && (
              <SelectedCardPreview>
                <CardImageWraaper>
                  <CardImage src={selectedCard.imageUrl} />
                </CardImageWraaper>
                <CardMessageTextArea
                  {...register("message")}
                  placeholder="메시지를 입력해주세요."
                  isError={!!errors.message}
                  onChange={onMessageChange}
                />
                <MessageTextAreaCaption isError={Boolean(errors.message)}>
                  {errors.message?.message || " "}
                </MessageTextAreaCaption>
              </SelectedCardPreview>
            )}
          </SectionContainer>
          <Divider />
          <SectionContainer>
            <OrderSectionTitle>보내는 사람</OrderSectionTitle>
            <InputWrapper>
              <StyledInput
                {...register("senderName")}
                placeholder="이름을 입력하세요."
                hasError={!!errors.senderName}
              />
              <CaptionText isError={Boolean(errors.senderName)}>
                {errors.senderName?.message ||
                  "* 실제 선물 발송 시 발신자이름으로 반영되는 정보입니다."}
              </CaptionText>
            </InputWrapper>
          </SectionContainer>
          <Divider />
          <SectionContainer>
            <ReceiveContainerHeader>
              <OrderSectionTitle>받는 사람</OrderSectionTitle>
              <OpenReceiverListModalButton
                type="button"
                onClick={handleOpenReceiverModal}
              >
                {receivers.length > 0 ? "수정" : "추가"}
              </OpenReceiverListModalButton>
            </ReceiveContainerHeader>

            {receivers.length === 0 ? (
              <ReceiverList error={receiverError}>
                받는 사람이 없습니다.<br></br>받는 사람을 추가해주세요.
              </ReceiverList>
            ) : (
              <ReceiverListTable>
                <TableHead>
                  <HeadContent>이름</HeadContent>
                  <HeadContent>전화번호</HeadContent>
                  <HeadContent>수량</HeadContent>
                </TableHead>
                {receivers.map((r, i) => {
                  return (
                    <TableBody key={i}>
                      <BodyContent>{r.receiverName}</BodyContent>
                      <BodyContent>{r.receiverPhoneNumber}</BodyContent>
                      <BodyContent>{r.itemCount}</BodyContent>
                    </TableBody>
                  );
                })}
              </ReceiverListTable>
            )}
          </SectionContainer>
          <Divider />
          <SectionContainer>
            <OrderSectionTitle>상품 정보</OrderSectionTitle>
            <ItemWrapper>
              <ItemImg src={item?.imageURL} />
              <ItemTextInfoWrapper>
                <ItemBrand>{item?.brandName}</ItemBrand>
                <ItemName>{item?.name}</ItemName>
                <ItemPrice>{item?.price.toLocaleString()}원</ItemPrice>
              </ItemTextInfoWrapper>
            </ItemWrapper>
          </SectionContainer>
          <OrderButton type="submit">
            {totalPrice.toLocaleString()}원 주문하기
          </OrderButton>
        </OrderContainer>
      )}
      <ReceiverListModal
        open={isReceiverModalOpen}
        onClose={handleModalClose}
        onAdd={handleModalAddOrEdit}
        initialReceives={receivers}
      />
    </Layout>
  );
};

export default Order;

const OrderContainer = styled.form`
  width: 100%;
  max-width: 720px;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  overflow-y: auto;
  margin: 0 auto;
  padding-bottom: 60px;
`;

const OrderSectionTitle = styled.p`
  ${({ theme }) => `
    font-size: ${theme.font.subtitle1Bold.size};
    font-weight: ${theme.font.subtitle1Bold.weight};
    line-height: ${theme.font.subtitle1Bold.lineHeight};`}
`;
const SelectedCardPreview = styled.div`
  margin-top: ${({ theme }) => theme.spacing.spacing4};
  display: flex;
  flex-direction: column;
`;

const CardImageWraaper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CardImage = styled.img`
  width: 100%;
  max-width: 360px;
  border-radius: 12px;
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const CardMessageTextArea = styled.textarea<{ isError: boolean }>`
  width: 100%;
  border-radius: 4px;
  border: 1px solid
    ${({ isError, theme }) =>
      isError ? theme.colors.critical : theme.colors.gray400};
  min-height: 100px;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  padding: ${({ theme }) => theme.spacing.spacing4};

  ${({ theme }) => `
    font-size: ${theme.font.body1Regular.size};
    font-weight: ${theme.font.body1Regular.weight};
    line-height: ${theme.font.body1Regular.lineHeight};
  `}
`;

const MessageTextAreaCaption = styled.span<{ isError: boolean }>`
  color: ${({ isError, theme }) =>
    isError ? theme.colors.critical : theme.colors.gray600};
  font-size: ${({ theme }) => theme.font.label2Regular.size};
  margin-top: 4px;
`;

const ReceiveContainerHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.spacing4};
`;

const OpenReceiverListModalButton = styled.button`
  background-color: ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  border: none;
  cursor: pointer;
  ${({ theme }) => `
    font-size: ${theme.font.body2Regular.size};
    font-weight: ${theme.font.body2Regular.weight};
    line-height: ${theme.font.body2Regular.lineHeight};
  `}

  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const ReceiverList = styled.div<{ error?: boolean }>`
  padding: ${({ theme }) => theme.spacing.spacing4};
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${({ error, theme }) =>
    error ? theme.colors.critical : theme.colors.textPlaceholder};
  border-radius: 12px;

  ${({ theme }) => `
    font-size: ${theme.font.body2Regular.size};
    font-weight: ${theme.font.body2Regular.weight};
    line-height: ${theme.font.body2Regular.lineHeight};
  `}
`;

const ReceiverListTable = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderDefault};
`;

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.gray300};
  ${({ theme }) => `
    font-size: ${theme.font.subtitle2Bold.size};
    font-weight: ${theme.font.subtitle2Bold.weight};
    line-height: ${theme.font.subtitle2Bold.lineHeight};
  `};
  padding: ${({ theme }) => theme.spacing.spacing3};
`;

const TableBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  ${({ theme }) => `
    font-size: ${theme.font.body2Regular.size};
    font-weight: ${theme.font.body2Regular.weight};
    line-height: ${theme.font.body2Regular.lineHeight};
  `};
  padding: ${({ theme }) => theme.spacing.spacing3};
`;

const HeadContent = styled.p``;

const BodyContent = styled.p``;

const ItemWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.spacing4};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const ItemImg = styled.img`
  object-fit: cover;
  height: 80px;
  width: 80px;
`;

const ItemTextInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  white-space: nowrap;
  text-overflow: ellipsis;
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

const OrderButton = styled.button`
  position: fixed;
  bottom: 0;
  margin-top: ${({ theme }) => theme.spacing.spacing4};
  width: 100%;
  max-width: 720px;
  ${({ theme }) => `
    font-size: ${theme.font.subtitle1Bold.size};
    font-weight: ${theme.font.subtitle1Bold.weight};
    line-height: ${theme.font.subtitle1Bold.lineHeight};
  `}
  background-color: ${({ theme }) => theme.colors.kakaoYellow};
  border-radius: 0;
  border: none;
  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
  }
`;
