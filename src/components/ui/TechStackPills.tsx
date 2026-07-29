export default function TechStackPills({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          className="border border-border px-1.5 py-0.5 font-pixel text-[10px] text-muted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
