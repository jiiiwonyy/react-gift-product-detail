import Divider from "@/components/Common/Divider";
import { ErrorBoundary } from "@/components/Common/ErrorBoundary";
import Header from "@/components/Common/Header";
import Layout from "@/components/Common/Layout";
import OrderButtonSection from "@/components/ProductDetail/OrdetButtonSection";
import ProductDescriptionSection from "@/components/ProductDetail/ProductDescriptionSection";
import ProductImageSection from "@/components/ProductDetail/ProductImageSection";
import { useParams } from "react-router-dom";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/Common/LoadingSpinner";
import { ErrorFallback } from "@/components/Common/ErrorFallback";

const ProductDetail = () => {
  const { productId = "" } = useParams<{ productId: string }>();

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorFallback error={error} />}
    >
      <Layout>
        <Header title="선물하기" />
        <Suspense fallback={<LoadingSpinner />}>
          <ProductImageSection productId={productId} />
          <Divider />
          <ProductDescriptionSection productId={productId} />
          <OrderButtonSection productId={productId} />
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

export default ProductDetail;
