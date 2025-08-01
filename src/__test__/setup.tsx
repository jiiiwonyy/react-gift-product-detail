import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";

globalThis.renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
