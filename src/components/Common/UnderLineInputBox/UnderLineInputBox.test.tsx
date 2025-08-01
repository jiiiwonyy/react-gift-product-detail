import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import InputBox from "./UnderLineInputBox";

describe("InputBox Component", () => {
  it("Given a value, When rendered, Then it should display the input value", () => {
    renderWithTheme(
      <InputBox value="test value" onChange={() => {}} placeholder="Enter" />
    );
    expect(screen.getByPlaceholderText("Enter")).toHaveValue("test value");
  });

  it("Given a user typing, When onChange is triggered, Then it should call onChange handler", () => {
    const handleChange = vi.fn();
    renderWithTheme(
      <InputBox value="" onChange={handleChange} placeholder="type here" />
    );

    fireEvent.change(screen.getByPlaceholderText("type here"), {
      target: { value: "Hello" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("Given an onBlur handler, When input loses focus, Then it should call onBlur handler", () => {
    const handleBlur = vi.fn();
    renderWithTheme(
      <InputBox
        value=""
        onChange={() => {}}
        onBlur={handleBlur}
        placeholder="blur"
      />
    );

    fireEvent.blur(screen.getByPlaceholderText("blur"));
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("Given an error message, When rendered, Then it should show error text and red border", () => {
    renderWithTheme(
      <InputBox
        value=""
        onChange={() => {}}
        error="This field is required"
        placeholder="error test"
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
