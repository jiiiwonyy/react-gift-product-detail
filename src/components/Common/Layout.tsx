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
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 오타 수정 */
  justify-content: flex-start;
  background-color: ${({ theme }) => theme.colors.backgroundDefault};
`;
