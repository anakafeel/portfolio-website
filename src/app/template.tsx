/**
 * Re-mounts on every navigation, giving each page a small entrance
 * animation. Skipped entirely under prefers-reduced-motion.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-fade-up">{children}</div>;
}
