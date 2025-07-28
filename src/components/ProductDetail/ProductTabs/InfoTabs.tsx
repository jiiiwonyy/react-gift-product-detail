type AnnouncementsItem = {
  name: string;
  value: string;
  displayOrder: number;
};

type Props = {
  announcements: AnnouncementsItem[];
};

export default function InfoTab({ announcements }: Props) {
  if (!announcements || announcements.length === 0) {
    return <p>상세 정보가 없습니다.</p>;
  }

  const sorted = [...announcements].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <ul>
      {sorted.map((item) => (
        <li key={item.name}>
          <strong>{item.name}</strong>: {item.value}
        </li>
      ))}
    </ul>
  );
}
