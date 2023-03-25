import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const BOUNDED_HEIGHT = 500;
const BOUNDED_WIDTH = 300;

const windowStyle: React.CSSProperties = {
  height: BOUNDED_HEIGHT,
  width: BOUNDED_WIDTH,
  overflow: "auto",
  position: "relative",
  border: "1px solid red",
};

interface WindowedBoundaries {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const OVERFLOW_THRESHOLD = 100;

const defaultWindowedBoundaries = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

const WindowedBoundariesContext = createContext<WindowedBoundaries>(
  defaultWindowedBoundaries
);

function WindowedContainer({ children }: React.PropsWithChildren) {
  const windowedRef = useRef<HTMLDivElement>(null);

  const [windowedBoundaries, setWindowedBoundaries] =
    useState<WindowedBoundaries>(defaultWindowedBoundaries);

  const handleOnScroll: React.UIEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      const scrollEventTarget = event.target as HTMLDivElement;
      setWindowedBoundaries({
        top: Math.max(scrollEventTarget.scrollTop - OVERFLOW_THRESHOLD, 0),
        bottom: Math.min(
          scrollEventTarget.scrollTop + BOUNDED_HEIGHT + OVERFLOW_THRESHOLD,
          scrollEventTarget.scrollHeight
        ),
        left: Math.max(scrollEventTarget.scrollLeft - OVERFLOW_THRESHOLD, 0),
        right: Math.min(
          scrollEventTarget.scrollTop + BOUNDED_WIDTH + OVERFLOW_THRESHOLD,
          scrollEventTarget.scrollWidth
        ),
      });
    },
    []
  );

  return (
    <WindowedBoundariesContext.Provider value={windowedBoundaries}>
      <div onScroll={handleOnScroll} style={windowStyle} ref={windowedRef}>
        {children}
      </div>
    </WindowedBoundariesContext.Provider>
  );
}

export default WindowedContainer;

export function useWindowedBoundaries() {
  return useContext(WindowedBoundariesContext);
}
