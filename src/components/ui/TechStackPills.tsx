export default function TechStackPills({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tech) => (
        <li
          key={tech}
          // Tech stack is a key fact for recruiters: 12px pixel type, not 10px.
          className="border border-border px-2 py-1 font-pixel text-xs text-muted"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
