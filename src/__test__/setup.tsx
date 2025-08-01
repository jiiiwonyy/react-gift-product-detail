import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { ThemeProvider } from "@emotion/react";
import theme from "@/styles/theme";
import { server } from "./mocks/server";

globalThis.renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
