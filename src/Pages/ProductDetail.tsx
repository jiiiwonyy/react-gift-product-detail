import Divider from "@/components/Common/Divider";
import Header from "@/components/Common/Header";
import ProductImageSection from "@/components/ProductDetail/ProductImageSection";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { productId = "" } = useParams<{ productId: string }>();
  return (
    <>
      <Header title="선물하기" />
      <ProductImageSection productId={productId} />
      <Divider />
    </>
  );
};

export default ProductDetail;
