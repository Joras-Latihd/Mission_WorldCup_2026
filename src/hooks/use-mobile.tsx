import * as React from "react";

const MOBILE_BREAKPOINT = 768;

let isMobileGlobal = false;
const listeners = new Set<(value: boolean) => void>();
let mql: MediaQueryList | null = null;

function notifyAll(value: boolean) {
  isMobileGlobal = value;
  listeners.forEach((cb) => cb(value));
}

if (typeof window !== "undefined") {
  mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

  const update = () => notifyAll(mql!.matches);

  // initialize once
  isMobileGlobal = mql.matches;

  mql.addEventListener("change", update);
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(isMobileGlobal);

  React.useEffect(() => {
    listeners.add(setIsMobile);

    // sync immediately
    setIsMobile(isMobileGlobal);

    return () => {
      listeners.delete(setIsMobile);
    };
  }, []);

  return isMobile;
}