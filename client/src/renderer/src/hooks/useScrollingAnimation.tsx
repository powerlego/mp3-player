import { SyntheticEvent, useCallback, useEffect, useRef } from "react";
import { ScrollingAnimationProps } from "@/types";

interface HookProps {
  containerRef: React.RefObject<HTMLDivElement>;
  offsetRef: React.RefObject<HTMLDivElement>;
  animationProps: ScrollingAnimationProps;
}

const useScrollingAnimation = (props: HookProps) => {
  const {
    containerRef,
    offsetRef,
    animationProps: {
      speed = 0.2,
      pauseAtEndEdgeDurationMs = 1200,
      initialMouseIntDelayMs = 200,
      iterationType = "single",
    },
  } = props;

  const animationFrameId = useRef<number>(0);
  const textDirRef = useRef("ltr");
  const timeOuts = useRef<{ initialMouseInteraction: NodeJS.Timeout }>({
    initialMouseInteraction: setTimeout(() => {
      /* do nothing */
    }, 0),
  });
  const scrollingState = useRef("scrolling");

  const getDisplayWidth = useCallback(
    () =>
      containerRef.current && offsetRef.current ? offsetRef.current.clientWidth - containerRef.current.clientWidth : 0,
    [containerRef, offsetRef]
  );

  const getDirection = useCallback(() => (textDirRef.current === "rtl" ? 1 : -1), [textDirRef]);

  const getOffset = useCallback(() => {
    const displayWidth = getDisplayWidth();
    return displayWidth > 0 && textDirRef.current === "rtl" ? 0 + -1 * getDirection() * displayWidth : 0;
  }, [getDisplayWidth, getDirection]);

  const resetTransform = useCallback(() => {
    const offsetElement = offsetRef.current;
    if (offsetElement) {
      offsetElement.style.setProperty("--trans-x", `${getOffset()}px`);
    }
  }, [getOffset, offsetRef]);

  const updateAnimation = useCallback(() => {
    if (animationFrameId.current) {
      return;
    }
    let endTime: DOMHighResTimeStamp = 0;
    let prevOffset = 0;
    let direction = 1;
    let prevTime: DOMHighResTimeStamp = 0;
    const animationCallback = (startTime: DOMHighResTimeStamp) => {
      const displayWidth = getDisplayWidth();
      if (displayWidth <= 0) {
        return;
      }
      let isInfinite = true;
      let offset = prevOffset;
      if (endTime) {
        if (prevTime) {
          startTime > prevTime + pauseAtEndEdgeDurationMs && (prevTime = 0);
        }
        else if (scrollingState.current !== "paused") {
          offset += direction * ((60 * (startTime - endTime)) / 1e3) * speed;
          offset > displayWidth
            ? ((direction *= -1), (prevTime = startTime), (offset = displayWidth))
            : offset < 0
              && ((direction *= -1), (prevTime = startTime), (offset = 0), (isInfinite = iterationType === "infinite"));
        }
        prevOffset = offset;
        const offsetValue = getDirection() * prevOffset + getOffset();
        if (offsetRef.current) {
          offsetRef.current.style.setProperty("--trans-x", `${offsetValue}px`);
        }
      }
      endTime = startTime;
      animationFrameId.current = 0;
      if (isInfinite) {
        animationFrameId.current = requestAnimationFrame(animationCallback);
      }
    };
    scrollingState.current = "scrolling";
    animationCallback(0);
  }, [speed, pauseAtEndEdgeDurationMs, getDirection, getOffset, getDisplayWidth, iterationType, offsetRef]);

  const getCurrentAnimationId = useCallback(() => animationFrameId.current, []);

  const setScrollingStatePaused = useCallback(() => {
    scrollingState.current = "paused";
  }, []);

  const setScrollingStateScrolling = useCallback(() => {
    scrollingState.current = "scrolling";
  }, []);

  const resetAnimation = useCallback(() => {
    cancelAnimationFrame(animationFrameId.current);
    scrollingState.current = "paused";
    animationFrameId.current = 0;
  }, []);

  const clearTimeOuts = useCallback(() => {
    Object.values(timeOuts.current).forEach((e) => e && clearTimeout(e));
  }, []);

  const handleMouseOver = useCallback(
    (event: SyntheticEvent) => {
      const focused = event.type === "mouseover" && event.currentTarget === event.target ? true : false;
      if (getCurrentAnimationId()) {
        setScrollingStatePaused();
      }
      else if (!focused) {
        timeOuts.current.initialMouseInteraction = setTimeout(() => {
          updateAnimation();
        }, initialMouseIntDelayMs);
      }
    },
    [getCurrentAnimationId, setScrollingStatePaused, updateAnimation, initialMouseIntDelayMs]
  );

  const handleMouseOut = useCallback(() => {
    if (timeOuts.current.initialMouseInteraction) {
      clearTimeout(timeOuts.current.initialMouseInteraction);
    }
    if (getCurrentAnimationId()) {
      setScrollingStateScrolling();
    }
  }, [getCurrentAnimationId, setScrollingStateScrolling]);

  useEffect(
    () => () => {
      resetAnimation();
      clearTimeOuts();
      resetTransform();
    },
    [resetAnimation, clearTimeOuts, resetTransform]
  );

  return [handleMouseOver, handleMouseOut];
};

export default useScrollingAnimation;
