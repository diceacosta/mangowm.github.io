import { useEffect, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

const EMPTY: ElementSize = { width: 0, height: 0 };

/** Tracks the `clientWidth`/`clientHeight` of an element via a single ResizeObserver. */
export function useElementSize<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [size, setSize] = useState<ElementSize>(EMPTY);

  useEffect(() => {
    if (!element) return;

    const measure = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight });
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return { ref: setElement, size };
}
