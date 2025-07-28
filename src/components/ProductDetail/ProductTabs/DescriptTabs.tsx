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
`;
