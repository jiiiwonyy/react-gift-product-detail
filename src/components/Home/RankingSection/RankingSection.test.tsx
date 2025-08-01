import { describe, it, expect } from "vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import RankingSection from "./RankingSection";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { useLocation } from "react-router-dom";

const mockUser = {
  id: 1,
  name: "test",
  email: "test@kakao.com",
  authToken: "dummy-token",
};

let testLocation: ReturnType<typeof useLocation>;

const LocationDisplay = () => {
  testLocation = useLocation();
  return null;
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

const renderWithProviders = (
  ui: React.ReactElement,
  { route = "/", isLoggedIn = false } = {}
) => {
  window.history.pushState({}, "Test page", route);

  return render(
    <MemoryRouter initialEntries={[route]}>
      <LocationDisplay />
      <QueryClientProvider client={createTestQueryClient()}>
        <AuthContext.Provider
          value={{
            user: isLoggedIn ? mockUser : null,
            login: vi.fn(),
            logout: vi.fn(),
            isLoggedIn,
          }}
        >
          <ThemeProvider theme={theme}>{ui}</ThemeProvider>
        </AuthContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("RankingSection", () => {
  it("TC01: API로 받은 상품들이 화면에 렌더링된다", async () => {
    renderWithProviders(<RankingSection />);

    const productItems = await screen.findAllByTestId("product-item");
    expect(productItems.length).toBe(6);
  });

  it("TC02: 더보기 버튼 클릭 시 상품 개수가 증가한다", async () => {
    renderWithProviders(<RankingSection />);
    const moreButton = await screen.findByRole("button", { name: "더보기" });

    fireEvent.click(moreButton);

    const items = await screen.findAllByTestId("product-item");
    expect(items.length).toBe(20);
  });

  it("TC03: 성별 카테고리 클릭 시 URL 파라미터가 변경된다", async () => {
    renderWithProviders(<RankingSection />, {
      route: "/?targetType=ALL&rankType=MANY_WISH",
    });

    const maleButton = await screen.findByTestId("target-tab-MALE");
    fireEvent.click(maleButton);

    expect(testLocation.search).toContain("targetType=MALE");
  });

  it("TC04: 랭킹 카테고리 변경 시 쿼리키가 변경된다", async () => {
    renderWithProviders(<RankingSection />, {
      route: "/?targetType=ALL&rankType=MANY_WISH",
    });

    const rankTypeButton = await screen.findByRole("button", {
      name: /많이 선물한/i,
    });
    fireEvent.click(rankTypeButton);
    const newItems = await screen.findAllByTestId("product-item");
    expect(newItems.length).toBeGreaterThan(0);
  });

  it("TC05: 로그인하지 않은 상태에서 상품 클릭 시 로그인 페이지로 이동된다", async () => {
    renderWithProviders(<RankingSection />, { isLoggedIn: false });

    const items = await screen.findAllByTestId("product-item");
    fireEvent.click(items[0]);

    expect(testLocation.pathname).toBe("/login");
  });

  it("TC06: 로그인 상태에서 상품 클릭 시 상세 페이지로 이동된다", async () => {
    renderWithProviders(<RankingSection />, { isLoggedIn: true });

    const items = await screen.findAllByTestId("product-item");
    fireEvent.click(items[0]);

    expect(testLocation.pathname).toMatch(/\/product\/\d+/);
  });

  it("TC07: '접기' 버튼 클릭 시 상품 개수가 다시 줄어든다", async () => {
    renderWithProviders(<RankingSection />);
    const moreButton = await screen.findByRole("button", { name: "더보기" });
    fireEvent.click(moreButton);

    const collapseButton = await screen.findByRole("button", { name: "접기" });
    fireEvent.click(collapseButton);

    const collapsedItems = await screen.findAllByTestId("product-item");
    expect(collapsedItems.length).toBe(6);
  });
});
