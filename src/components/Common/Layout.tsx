import styled from "@emotion/styled";
import type { PropsWithChildren } from "react";

type PageWrapperProps = PropsWithChildren;

const Layout = ({ children }: PageWrapperProps) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
`;
