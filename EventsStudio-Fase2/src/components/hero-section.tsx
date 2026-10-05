"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { heroMedia } from "@/lib/site";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const motionAllowed = mounted && reducedMotion === false;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    function syncPlayback() {
      if (!video) return;
      if (!motionAllowed || document.hidden) video.pause();
      else void video.play().catch(() => setHasFrame(false));
    }
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    return () => document.removeEventListener("visibilitychange", syncPlayback);
  }, [motionAllowed]);

  return <section aria-labelledby="hero-title" className="hero relative isolate overflow-hidden bg-ink">
    <h1 id="hero-title" className="sr-only">Events Studio — Party, Events, Tourism</h1>
    {/* Real frame remains visible if autoplay or decoding is unavailable. */}
    <img src={heroMedia.poster} alt="" aria-hidden="true" fetchPriority="high" width={1920} height={1334} className="absolute inset-0 -z-30 size-full object-cover object-center" />
    <video ref={videoRef} muted loop playsInline autoPlay={motionAllowed} preload="none" poster={heroMedia.poster} aria-hidden="true" tabIndex={-1} onPlaying={() => setHasFrame(true)} onError={() => setHasFrame(false)} className={`absolute inset-0 -z-20 size-full object-cover object-center transition-opacity duration-700 ${hasFrame && !reducedMotion ? "opacity-100" : "opacity-0"}`}>
      {heroMedia.mobileVideo && <source src={heroMedia.mobileVideo} media="(max-width: 767px)" type="video/mp4" />}
      <source src={heroMedia.video} type="video/mp4" />
    </video>
    <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />
  </section>;
}
