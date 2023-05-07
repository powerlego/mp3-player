import React, { forwardRef } from "react";
import getPosX from "@utils/getPosX";
import throttle from "@utils/throttle";

interface ProgressBarForwardRefProps {
  audio: HTMLAudioElement | null;
  currentTime?: number;
  progressUpdateInterval?: number;
  srcDuration?: number;
  i18nProgressBar?: string;
  style?: React.CSSProperties;
}

interface ProgressBarProps extends ProgressBarForwardRefProps {
  progressRef: React.RefObject<HTMLDivElement>;
}

interface TimePosInfo {
  currentTime: number;
  currentTimePos: string;
}

function ProgressBar({
  audio,
  progressUpdateInterval = 0,
  srcDuration,
  i18nProgressBar,
  style,
  progressRef,
}: ProgressBarProps): JSX.Element {
  const hasAddedAudioEventListener = React.useRef(false);
  const isDraggingProgress = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(isDraggingProgress.current);
  const timeOnMouseMove = React.useRef(0);
  const [currentTimePos, setCurrentTimePos] = React.useState("0.00%");
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);

  const getDuration = React.useCallback((): number => {
    if (!audio) {
      return 0;
    }
    return typeof srcDuration === "undefined" ? audio.duration : srcDuration;
  }, [audio, srcDuration]);

  const getCurrentProgress = React.useCallback(
    (event: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent): TimePosInfo => {
      if (!progressRef.current) {
        return { currentTime: 0, currentTimePos: "0%" };
      }
      const rect = progressRef.current.getBoundingClientRect();
      const maxRelativePos = rect.width;

      let relativePos = getPosX(event) - rect.left;

      if (relativePos < 0) {
        relativePos = 0;
      }
      else if (relativePos > maxRelativePos) {
        relativePos = maxRelativePos;
      }
      const duration = getDuration();
      const currentTime = (duration * relativePos) / maxRelativePos;
      const currentTimePos = `${((relativePos / maxRelativePos) * 100).toFixed(2)}%`;
      return { currentTime, currentTimePos };
    },
    [getDuration, progressRef]
  );

  const handleMouseOrTouchMove = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }

    event.stopPropagation();
    const windowSelection: Selection | null = window.getSelection();
    if (windowSelection && windowSelection.type === "Range") {
      windowSelection.empty();
    }
    if (isDraggingProgress.current) {
      const { currentTime, currentTimePos } = getCurrentProgress(event);
      timeOnMouseMove.current = currentTime;
      setCurrentTimePos(currentTimePos);
    }
  };

  const handleMouseOrTouchUp = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    isDraggingProgress.current = false;
    setIsDragging(isDraggingProgress.current);
    const newTime = timeOnMouseMove.current;
    if (!audio) {
      return;
    }
    if (audio.readyState === audio.HAVE_NOTHING || audio.readyState === audio.HAVE_METADATA || !isFinite(newTime)) {
      setCurrentTimePos("0.00%");
    }
    else {
      audio.currentTime = newTime;
    }
    if (event instanceof MouseEvent) {
      window.removeEventListener("mousemove", handleMouseOrTouchMove);
      window.removeEventListener("mouseup", handleMouseOrTouchUp);
    }
    else {
      window.removeEventListener("touchmove", handleMouseOrTouchMove);
      window.removeEventListener("touchend", handleMouseOrTouchUp);
    }
  };

  const handleMouseDownOrTouchStart = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
    const { currentTime, currentTimePos } = getCurrentProgress(event);
    if (isFinite(currentTime)) {
      timeOnMouseMove.current = currentTime;
      isDraggingProgress.current = true;
      setIsDragging(isDraggingProgress.current);
      setCurrentTimePos(currentTimePos);
      if (event.nativeEvent instanceof MouseEvent) {
        window.addEventListener("mousemove", handleMouseOrTouchMove);
        window.addEventListener("mouseup", handleMouseOrTouchUp);
      }
      else {
        window.addEventListener("touchmove", handleMouseOrTouchMove);
        window.addEventListener("touchend", handleMouseOrTouchUp);
      }
    }
  };

  const handleAudioTimeUpdate = throttle((e: Event): void => {
    const audio = e.target as HTMLAudioElement;
    if (isDraggingProgress.current) {
      return;
    }
    const { currentTime } = audio;
    const duration = getDuration();
    const currentTimePos = `${((currentTime / duration) * 100).toFixed(2)}%`;
    setCurrentTimePos(currentTimePos);
  }, progressUpdateInterval);

  React.useEffect(() => {
    if (audio && !hasAddedAudioEventListener.current) {
      audio.addEventListener("timeupdate", handleAudioTimeUpdate);
      hasAddedAudioEventListener.current = true;
    }
    return () => {
      if (audio && hasAddedAudioEventListener.current) {
        audio.removeEventListener("timeupdate", handleAudioTimeUpdate);
        hasAddedAudioEventListener.current = false;
      }
    };
  }, [audio, handleAudioTimeUpdate]);

  if (!currentTimePos) {
    return <></>;
  }
  return isAudioAvailable
    ? (
      <div
        aria-label={i18nProgressBar}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Number(currentTimePos.split("%")[0])}
        className="h-5 w-4/5 flex flex-row flex-1 items-center justify-center group "
        ref={progressRef}
        style={style}
        onMouseDown={handleMouseDownOrTouchStart}
        onTouchStart={handleMouseDownOrTouchStart}
      >
        <div className="relative box-border rounded-full h-1 w-full bg-gray-350 dark:bg-gray-750 ">
          <div
            style={{ left: currentTimePos }}
            className={`absolute z-20 box-border rounded-full h-13/4 aspect-square group-hover:scale-100 ${
              isDragging ? "scale-100" : "scale-0"
            }`}
          >
            <div
              className={`absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full group-hover:bg-gray-550 dark:group-hover:bg-gray-250 shadow shadow-gray-800 dark:shadow-gray-250 ${
                isDragging ? "bg-gray-550 dark:bg-gray-250" : "bg-gray-450 dark:bg-gray-600"
              }`}
            />
          </div>
          <div
            style={{ width: currentTimePos }}
            className={`absolute z-10 box-border rounded-full h-full group-hover:bg-green-700 dark:group-hover:bg-green-600 ${
              isDragging ? "bg-green-700 dark:bg-green-600" : "bg-gray-550 dark:bg-gray-250"
            }`}
          />
        </div>
      </div>
    )
    : (
      <div
        aria-label={i18nProgressBar}
        className="h-5 w-4/5 flex flex-row flex-1 items-center justify-center group"
        ref={progressRef}
        role="progressbar"
      >
        <div className="relative box-border h-1 w-full rounded-full bg-gray-350 dark:bg-gray-750">
          <div className="absolute z-10 box-border h-full rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>
      </div>
    );
}

function ProgressBarForwardRef(props: ProgressBarForwardRefProps, ref: React.Ref<HTMLDivElement>): React.ReactElement {
  return <ProgressBar {...props} progressRef={ref as React.RefObject<HTMLDivElement>} />;
}

export default forwardRef(ProgressBarForwardRef);
export { ProgressBar, ProgressBarForwardRef };
