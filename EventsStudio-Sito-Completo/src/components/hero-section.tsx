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
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('webkit-playsinline', 'true');
    let disposed = false;
    const play = () => {
      if (disposed || !motionAllowed || document.hidden) return;
      void video.play().catch(() => { if (!disposed) setHasFrame(false); });
    };
    const restart = () => {
      try { video.currentTime = 0; } catch { /* Metadata not loaded yet. */ }
      play();
    };
    const recoverPause = () => {
      if (video.ended || (Number.isFinite(video.duration) && video.duration - video.currentTime < .1)) restart();
    };
    const resumeGesture = () => { if (video.paused) play(); };
    function syncPlayback() {
      if (!video) return;
      if (!motionAllowed || document.hidden) video.pause();
      else play();
    }
    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    video.addEventListener('ended', restart);
    video.addEventListener('pause', recoverPause);
    video.addEventListener('canplay', play);
    window.addEventListener('pageshow', syncPlayback);
    window.addEventListener('events-studio:restart-hero', restart);
    document.addEventListener('touchend', resumeGesture, { passive: true });
    document.addEventListener('pointerup', resumeGesture, { passive: true });
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', syncPlayback);
      video.removeEventListener('ended', restart);
      video.removeEventListener('pause', recoverPause);
      video.removeEventListener('canplay', play);
      window.removeEventListener('pageshow', syncPlayback);
      window.removeEventListener('events-studio:restart-hero', restart);
      document.removeEventListener('touchend', resumeGesture);
      document.removeEventListener('pointerup', resumeGesture);
    };
  }, [motionAllowed]);

  return <section aria-labelledby="hero-title" className="hero relative isolate overflow-hidden bg-ink">
    <h1 id="hero-title" className="sr-only">Events Studio — Party, Events, Tourism</h1>
    {/* Real frame remains visible if autoplay or decoding is unavailable. */}
    <img src={heroMedia.poster} alt="" aria-hidden="true" fetchPriority="high" width={1920} height={1334} className="absolute inset-0 -z-30 size-full object-cover object-center" />
    {/* Remount on media changes: browsers can retain the old resource when only source children change. */}
    <video key={`${heroMedia.video}|${heroMedia.mobileVideo ?? ""}`} ref={videoRef} muted loop playsInline autoPlay={motionAllowed} preload={motionAllowed ? "auto" : "none"} poster={heroMedia.poster} aria-hidden="true" tabIndex={-1} onPlaying={() => setHasFrame(true)} onError={() => setHasFrame(false)} className={`absolute inset-0 -z-20 size-full object-cover object-center transition-opacity duration-700 ${hasFrame && !reducedMotion ? "opacity-100" : "opacity-0"}`}>
      {heroMedia.mobileVideo && <source src={heroMedia.mobileVideo} media="(max-width: 767px)" type="video/mp4" />}
      <source src={heroMedia.video} type="video/mp4" />
    </video>
    <div aria-hidden="true" className="hero-veil absolute inset-0 -z-10" />
  </section>;
}
