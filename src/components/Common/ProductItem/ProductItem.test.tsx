import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import ProductItem from "./ProductItem";

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockProduct = {
  id: 11765265,
  name: "와퍼+콜라R+21치즈스틱",
  imageURL:
    "https://st.kakaocdn.net/product/gift/product/20250609155130_e531f0cba2cf4e94bd39b331e090f4c0.png",
  price: { basicPrice: 11800, sellingPrice: 7500, discountRate: 36 },
  brandInfo: {
    id: 4465,
    name: "버거킹",
    imageURL:
      "https://st.kakaocdn.net/product/gift/gift_brand/20210615141810_785280d2c3ec4dbc9ddeb5f66a1cce5d.png",
  },
};

describe("ProductItem Component", () => {
  it("should render product name, brand, and price using mock data", () => {
    renderWithTheme(<ProductItem {...mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brandInfo.name)).toBeInTheDocument();
    expect(
      screen.getByText(`${mockProduct.price.sellingPrice.toLocaleString()}원`)
    ).toBeInTheDocument();
  });

  it("should render image with correct src and alt", () => {
    renderWithTheme(<ProductItem {...mockProduct} />);

    const img = screen.getByAltText(mockProduct.name) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(mockProduct.imageURL);
  });

  it("should not render rank badge if rank is undefined", () => {
    renderWithTheme(<ProductItem {...mockProduct} />);
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });

  it("should render rank badge when rank is provided", () => {
    renderWithTheme(<ProductItem {...mockProduct} rank={2} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should apply highlightCondition correctly", () => {
    renderWithTheme(
      <ProductItem
        {...mockProduct}
        rank={4}
        highlightCondition={(rank) => rank < 5}
      />
    );
    const badge = screen.getByText("4");
    expect(badge).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const handleClick = vi.fn();
    renderWithTheme(<ProductItem {...mockProduct} onClick={handleClick} />);

    fireEvent.click(screen.getByText(mockProduct.name));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
