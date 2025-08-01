import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@emotion/react";
import { MemoryRouter } from "react-router-dom";
import theme from "@/styles/theme";
import Login from "./Login";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useAuthContext } from "@/contexts/useAuthContext";
import * as authApi from "@/api/auth";
import { toast } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 모킹
vi.mock("@/hooks/useLoginForm");
vi.mock("@/contexts/useAuthContext");
vi.mock("@/api/auth");

type InputField = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  error: string;
};

type UseLoginFormReturn = {
  email: InputField;
  password: InputField;
  isFormValid: boolean;
};

type UseAuthContextReturn = {
  login: (data: unknown) => void;
};

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );

describe("Login Page", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useLoginForm as Mock).mockReturnValue({
      email: {
        value: "test@example.com",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        error: "",
      },
      password: {
        value: "password123",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        error: "",
      },
      isFormValid: true,
    } satisfies UseLoginFormReturn);

    (useAuthContext as Mock).mockReturnValue({
      login: mockLogin,
    } satisfies UseAuthContextReturn);

    (authApi.postLogin as Mock).mockResolvedValue({ token: "abc" });
  });

  it("입력 필드가 렌더링된다", () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText("이메일")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("비밀번호")).toBeInTheDocument();
  });

  it("폼이 유효하지 않으면 로그인 버튼이 비활성화된다", () => {
    (useLoginForm as Mock).mockReturnValue({
      email: { value: "", onChange: vi.fn(), onBlur: vi.fn(), error: "에러" },
      password: {
        value: "",
        onChange: vi.fn(),
        onBlur: vi.fn(),
        error: "에러",
      },
      isFormValid: false,
    } satisfies UseLoginFormReturn);

    renderWithProviders(<Login />);
    expect(screen.getByRole("button", { name: "로그인" })).toBeDisabled();
  });

  it("폼이 유효하면 로그인 버튼이 활성화된다", () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole("button", { name: "로그인" })).toBeEnabled();
  });

  it("로그인 버튼 클릭 시 postLogin이 호출된다", async () => {
    renderWithProviders(<Login />);
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(authApi.postLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("로그인 실패 시 toast.error가 호출된다", async () => {
    const toastError = vi.spyOn(toast, "error");

    (authApi.postLogin as Mock).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 400,
        data: { data: { message: "잘못된 로그인 정보입니다." } },
      },
    });

    renderWithProviders(<Login />);
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith("잘못된 로그인 정보입니다.");
    });
  });
});
