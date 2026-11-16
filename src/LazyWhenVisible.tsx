import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: number | string;
  className?: string;
};

/** Mount children only once near viewport — keeps initial JS/paint light. */
export function LazyWhenVisible({
  children,
  rootMargin = "240px 0px",
  minHeight,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || show) return;

    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShow(true);
        io.disconnect();
      },
      { rootMargin, threshold: 0.01 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={ref} className={className} style={minHeight != null ? { minHeight } : undefined}>
      {show ? children : null}
    </div>
  );
}

export function SoftSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
