import { ClipLoader as Spinner } from "react-spinners";
import type { CSSProperties } from "react";

type Props = {
  color?: string;
  loading: boolean;
  size?: number;
  marginSize?: number;
};

export const LoadingSpinner = ({
  color = "#000000",
  loading,
  size,
  marginSize = 100,
}: Props) => {
  const override: CSSProperties = {
    display: "block",
    margin: `${marginSize}px auto`,
  };
  return (
    <Spinner
      color={color}
      loading={loading}
      cssOverride={override}
      size={size}
      data-testid="loader"
    />
  );
};
