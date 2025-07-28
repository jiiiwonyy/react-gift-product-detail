import Divider from "@/components/Common/Divider";
import Header from "@/components/Common/Header";
import OrderButtonSection from "@/components/ProductDetail/OrdetButtonSection";
import ProductDescriptionSection from "@/components/ProductDetail/ProductDescriptionSection";
import ProductImageSection from "@/components/ProductDetail/ProductImageSection";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { productId = "" } = useParams<{ productId: string }>();
  return (
    <>
      <Header title="선물하기" />
      <ProductImageSection productId={productId} />
      <Divider />
      <ProductDescriptionSection productId={productId} />
      <OrderButtonSection productId={productId} />
    </>
  );
};

export default ProductDetail;
