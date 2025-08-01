import { ReactElement } from "react";
import { RenderResult } from "@testing-library/react";

declare global {
  var renderWithTheme: (ui: ReactElement) => RenderResult;
}

export {};
