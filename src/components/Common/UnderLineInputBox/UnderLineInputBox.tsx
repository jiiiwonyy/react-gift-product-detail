import React from "react";
import styled from "@emotion/styled";

type InputBoxProps = {
  id?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler;
  error?: string;
};

const InputBox = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: InputBoxProps) => {
  return (
    <Wrapper>
      <StyledInput
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        hasError={!!error}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

export default InputBox;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.spacing1};
`;

const StyledInput = styled.input<{ hasError: boolean }>`
  border: none;
  border-bottom: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.critical : theme.colors.gray500};
  padding: ${({ theme }) => theme.spacing.spacing2};
  font-size: ${({ theme }) => theme.font.body1Regular.size};
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
  &:focus {
    outline: none;
    border-bottom-color: ${({ theme }) => theme.colors.gray700};
  }

  &::placeholder {
    font: ${({ theme }) => theme.font.title1Regular};
    color: ${({ theme }) => theme.colors.textPlaceholder};
  }
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.critical};
  font-size: ${({ theme }) => theme.font.label2Regular.size};
  margin-top: 4px;
`;
