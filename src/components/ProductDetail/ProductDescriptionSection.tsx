import { useSuspenseQuery } from "@tanstack/react-query";
import ProductTabs from "./ProductTabs/ProductTabs";
import DescriptionTab from "./ProductTabs/DescriptTabs";
import InfoTab from "./ProductTabs/InfoTabs";
import ReviewTab from "./ProductTabs/ReviewTabs";
import { getProductsDetail } from "@/api/products";
import { useState } from "react";
import { SectionContainer } from "../Common/SectionLayout";
import { queryKeys } from "@/utils/queryKeys";

type Props = {
  productId: string;
};

const ProductDescriptionSection = ({ productId }: Props) => {
  const [selectedTab, setSelectedTab] = useState<
    "description" | "review" | "info"
  >("description");

  const { data } = useSuspenseQuery({
    queryKey: queryKeys.product.detail(Number(productId)),
    queryFn: () => getProductsDetail(Number(productId)),
  });

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
