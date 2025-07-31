import styled from "@emotion/styled";

type Props = {
  description: string;
};

export default function DescriptionTab({ description }: Props) {
  return (
    <DescriptionContainer dangerouslySetInnerHTML={{ __html: description }} />
  );
}

const DescriptionContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-wrap: break-word;
  word-break: break-all;
  box-sizing: border-box;

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;
