import type { ReactNode } from "react";

export function OfficialLink({ href, children, external = true }: { href: string | null; children: ReactNode; external?: boolean }) {
  const style = "inline-flex min-h-11 items-center border-b border-sand/60 py-3 text-sm leading-relaxed tracking-[.025em]";
  return href
    ? <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`${style} text-white transition-colors hover:text-sand`}>{children}</a>
    : <div className="py-3"><p className="text-sm leading-relaxed text-white/60">{children}</p><p className="mt-1 text-xs text-white/55">Link ufficiale da fornire</p></div>;
}

