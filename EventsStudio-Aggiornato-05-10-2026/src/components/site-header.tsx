"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "./brand-mark";
import { navigation, type NavigationItem } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<NavigationItem | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [open]);

  function openMenu(item: NavigationItem | null = null) {
    setPending(item);
    setOpen(true);
  }

  function navControl(item: NavigationItem, large = false, index = 0) {
    const classes = large
      ? "group flex min-h-14 w-full items-baseline gap-5 py-1 text-left transition-colors hover:text-sand focus-visible:text-sand"
      : "nav-control inline-flex min-h-11 items-center py-3 text-[.6875rem] lg:text-[.875rem] font-medium uppercase tracking-[.04em] lg:tracking-[.12em] text-white/90 transition-colors hover:text-sand";
    const content = large ? <>
      <span aria-hidden="true" className="w-5 shrink-0 font-sans text-xs tracking-normal text-sand">0{index + 1}</span>
      <span className="font-display text-[clamp(2.25rem,6vw,5.5rem)] leading-[1.1]">{item.label}</span>
    </> : <span className="nav-label relative">{item.label}</span>;
    return item.ready
      ? <Link aria-current={pathname === item.href || pathname.startsWith(`${item.href}/`) ? "page" : undefined} className={classes} href={item.href} onClick={() => setOpen(false)}>{content}</Link>
      : <button type="button" className={classes} onClick={() => openMenu(item)} aria-haspopup="dialog">{content}</button>;
  }

  return <>
    <header className="absolute inset-x-0 top-0 z-20 px-6 pt-[max(1.5rem,env(safe-area-inset-top))] md:px-10 md:pt-8 xl:px-16">
      <div className="relative mx-auto flex min-h-16 max-w-480 items-center justify-center">
        <nav aria-label="Lo studio" className="absolute left-0 hidden items-center gap-3 md:flex lg:gap-6 2xl:gap-9">
          {navigation.slice(0, 3).map(item => <div key={item.href}>{navControl(item)}</div>)}
        </nav>
        <BrandMark />
        <nav aria-label="I nostri mondi" className="absolute right-0 hidden items-center gap-3 md:flex lg:gap-6 2xl:gap-9">
          {navigation.slice(3).map(item => <div key={item.href}>{navControl(item)}</div>)}
        </nav>
        <button type="button" onClick={() => openMenu()} aria-label="Apri menu" aria-expanded={open} aria-controls="site-navigation" className="absolute right-0 flex size-12 flex-col items-center justify-center gap-1.5 md:hidden">
          <span aria-hidden="true" className="h-px w-6 bg-white" />
          <span aria-hidden="true" className="h-px w-6 bg-white" />
        </button>
      </div>
    </header>

    <dialog id="site-navigation" ref={dialogRef} aria-labelledby="navigation-title" onKeyDown={event => {
      if (event.key !== "Tab") return;
      const targets = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onCancel={event => { event.preventDefault(); setOpen(false); }} onClose={() => setOpen(false)} className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-0 text-white">
      <AnimatePresence onExitComplete={() => dialogRef.current?.close()}>
        {open && <motion.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .3, ease }} className="flex min-h-full flex-col bg-ink px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] md:px-16 md:pt-8">
          <div className="flex min-h-16 items-center justify-between border-b border-white/15 pb-6">
            <h2 id="navigation-title" className="text-sm uppercase tracking-[.18em] text-sand">Esplora</h2>
            <button autoFocus type="button" onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-4 text-sm" aria-label="Chiudi menu">
              <span>Chiudi</span><span aria-hidden="true" className="relative size-5"><span className="absolute left-0 top-2.5 h-px w-5 rotate-45 bg-sand" /><span className="absolute left-0 top-2.5 h-px w-5 -rotate-45 bg-sand" /></span>
            </button>
          </div>
          <div className="my-auto grid items-end gap-8 py-8 md:grid-cols-[1.2fr_1fr] md:gap-16 md:py-12">
            <nav aria-label="Navigazione principale">
              <ul className="space-y-1">
                {navigation.map((item, index) => <motion.li key={item.href} initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, delay: reducedMotion ? 0 : .06 + index * .035, ease }}>
                  {navControl(item, true, index)}
                </motion.li>)}
              </ul>
            </nav>
            <div role="status" aria-live="polite" aria-atomic="true" className="max-w-sm border-t border-sand/35 pt-6">
              {pending ? <>
                {/* <!-- [PLACEHOLDER: Pagina non ancora sviluppata nella Fase 2] --> */}
                <p className="mb-3 font-display text-3xl text-sand">{pending.label}</p>
                <p className="text-base leading-relaxed text-white/70">Questa pagina sarà disponibile in una prossima fase. L’anteprima attuale comprende la homepage, la gallery e la navigazione.</p>
              </> : <p className="text-sm leading-relaxed text-white/60">Party / Events / Tourism<br />Esplora lo studio</p>}
            </div>
          </div>
          <p className="border-t border-white/15 pt-5 text-xs uppercase tracking-[.2em] text-white/50">Events Studio</p>
        </motion.div>}
      </AnimatePresence>
    </dialog>
  </>;
}


