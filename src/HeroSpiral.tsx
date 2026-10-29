import { useEffect, useRef } from "react";

export default function HeroSpiral() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (reduce.matches) {
        video.pause();
        video.currentTime = 0.35;
        return;
      }
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadeddata", sync);
    reduce.addEventListener("change", sync);
    if (video.readyState >= 2) sync();

    return () => {
      video.removeEventListener("loadeddata", sync);
      reduce.removeEventListener("change", sync);
    };
  }, []);

  return (
    <div className="hero-spiral" aria-hidden="true">
      <span className="hero-spiral__glow" />
      <video
        ref={ref}
        className="hero-spiral__video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        src="/images/hero-spiral.mp4?v=opt1"
      />
    </div>
  );
}
