export default function Bullets({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const children = items.map((item, i) => <li key={i}>{item}</li>);
  return ordered ? <ol className="bullets">{children}</ol> : <ul className="bullets">{children}</ul>;
}
