import { computed, onUnmounted, ref, Ref } from "vue";
import { IterationType, ScrollingAnimationProps } from "@/types";

export function useScrollingAnimation(
  containerRef: Ref<HTMLDivElement | null>,
  offsetRef: Ref<HTMLDivElement | null>,
  animationProps: ScrollingAnimationProps = {
    speed: 0.2,
    pauseAtEndEdgeDurationMs: 1200,
    initialMouseIntDelayMs: 200,
    iterationType: IterationType.SINGLE,
  },
) {
  const animationFrameId = ref(0);
  const textDirRef = ref("ltr");
  const initialMouseInteraction = ref(setTimeout(() => {}, 0));
  const scrollingState = ref("scrolling");

  const displayWidth = computed(() =>
    containerRef.value && offsetRef.value ? offsetRef.value.clientWidth - containerRef.value.clientWidth : 0);

  const direction = computed(() => (textDirRef.value === "rtl" ? 1 : -1));

  const offset = computed(() => {
    const displayWidthVal = displayWidth.value;
    return displayWidthVal > 0 && textDirRef.value === "rtl" ? 0 + -1 * direction.value * displayWidthVal : 0;
  });

  function resetTransform() {
    const offsetElement = offsetRef.value;
    if (offsetElement) {
      offsetElement.style.setProperty("--trans-x", `${offset.value}px`);
    }
  }

  function resetAnimation() {
    cancelAnimationFrame(animationFrameId.value);
    scrollingState.value = "paused";
    animationFrameId.value = 0;
  }

  function updateAnimation() {
    if (animationFrameId.value) {
      return;
    }
    let endTime: DOMHighResTimeStamp = 0;
    let prevOffset = 0;
    let directionVal = 1;
    let prevTime: DOMHighResTimeStamp = 0;
    const animationCallback = (startTime: DOMHighResTimeStamp) => {
      if (displayWidth.value <= 0) {
        return;
      }
      let isInfinite = true;
      let offsetVal = prevOffset;
      if (endTime) {
        if (prevTime) {
          if (startTime > prevTime + animationProps.pauseAtEndEdgeDurationMs) {
            prevTime = 0;
          }
        }
        else if (scrollingState.value !== "paused") {
          offsetVal += directionVal * ((60 * (startTime - endTime)) / 1e3) * animationProps.speed;
          if (offsetVal > displayWidth.value) {
            directionVal *= -1;
            prevTime = startTime;
            offsetVal = displayWidth.value;
          }
          else if (offsetVal < 0) {
            directionVal *= -1;
            prevTime = startTime;
            offsetVal = 0;
            isInfinite = animationProps.iterationType === IterationType.INFINITE;
          }
        }
        prevOffset = offsetVal;
        if (offsetRef.value) {
          offsetRef.value.style.setProperty("--trans-x", `${direction.value * prevOffset + offset.value}px`);
        }
      }
      endTime = startTime;
      animationFrameId.value = 0;
      if (isInfinite) {
        animationFrameId.value = requestAnimationFrame(animationCallback);
      }
    };
    scrollingState.value = "scrolling";
    animationCallback(0);
  }

  function handleMouseOver(event: Event) {
    const focused = event.type === "mouseover" && event.currentTarget === event.target;
    if (animationFrameId.value) {
      scrollingState.value = "paused";
    }
    else if (!focused) {
      initialMouseInteraction.value = setTimeout(() => {
        updateAnimation();
      }, animationProps.initialMouseIntDelayMs);
    }
  }

  function handleMouseOut() {
    if (initialMouseInteraction.value) {
      clearTimeout(initialMouseInteraction.value);
    }
    if (animationFrameId.value) {
      scrollingState.value = "scrolling";
    }
  }

  onUnmounted(() => {
    resetAnimation();
    if (initialMouseInteraction.value) {
      clearTimeout(initialMouseInteraction.value);
    }
    resetTransform();
  });

  return { handleMouseOver, handleMouseOut };
}
