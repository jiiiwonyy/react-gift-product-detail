import { useQuery } from "@tanstack/react-query";
import ProductTabs from "./ProductTabs/ProductTabs";
import DescriptionTab from "./ProductTabs/DescriptTabs";
import InfoTab from "./ProductTabs/InfoTabs";
import ReviewTab from "./ProductTabs/ReviewTabs";
import { getProductsDetail } from "@/api/products";
import { useState } from "react";
import { SectionContainer } from "../Common/SectionLayout";

type Props = {
  productId: string;
};

const ProductDescriptionSection = ({ productId }: Props) => {
  const [selectedTab, setSelectedTab] = useState<
    "description" | "review" | "info"
  >("description");

  const { data, isLoading, error } = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: () => getProductsDetail(Number(productId)),
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (error || !data) return <p>에러 발생</p>;
  return (
    <>
      <ProductTabs selected={selectedTab} onSelect={setSelectedTab} />
      <SectionContainer>
        {selectedTab === "description" && (
          <DescriptionTab description={data.description} />
        )}
        {selectedTab === "review" && (
          <ReviewTab productId={Number(productId)} />
        )}
        {selectedTab === "info" && (
          <InfoTab announcements={data.announcements ?? []} />
        )}
      </SectionContainer>
    </>
  );
};

export default ProductDescriptionSection;
