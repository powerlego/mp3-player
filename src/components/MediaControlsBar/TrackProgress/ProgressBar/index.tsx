import React, { Component, forwardRef } from "react";
import { getPosX, throttle } from "../../../../utils";

interface ProgressBarState {
  isDraggingProgress: boolean;
  currentTimePos?: string;
}

interface ProgressBarForwardRefProps {
  audio: HTMLAudioElement | null;
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
class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
  audio?: HTMLAudioElement;
  progressUpdateInterval = 0;

  hasAddedAudioEventListener = false;

  timeOnMouseMove = 0;

  state: ProgressBarState = {
    isDraggingProgress: false,
    currentTimePos: "0%",
  };

  getDuration(): number {
    const { audio, srcDuration } = this.props;
    if (!audio) {
      return 0;
    }
    return typeof srcDuration === "undefined" ? audio.duration : srcDuration;
  }

  getCurrentProgress = (event: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent): TimePosInfo => {
    const { progressRef } = this.props;
    console.log("progressRef", progressRef);
    if (!progressRef.current) {
      return { currentTime: 0, currentTimePos: "0%" };
    }
    const rect = progressRef.current.getBoundingClientRect();
    console.log("rect", rect);
    const maxRelativePos = rect.width;

    let relativePos = getPosX(event) - rect.left;

    if (relativePos < 0) {
      relativePos = 0;
    }
    else if (relativePos > maxRelativePos) {
      relativePos = maxRelativePos;
    }
    const duration = this.getDuration();
    const currentTime = (duration * relativePos) / maxRelativePos;
    const currentTimePos = `${((relativePos / maxRelativePos) * 100).toFixed(2)}%`;
    return { currentTime, currentTimePos };
  };

  handleMouseDownOrTouchStart = (event: React.MouseEvent | React.TouchEvent): void => {
    event.stopPropagation();
    const { currentTime, currentTimePos } = this.getCurrentProgress(event);
    console.log("handleMouseDownOrTouchStart", currentTime, currentTimePos);
    if (isFinite(currentTime)) {
      this.timeOnMouseMove = currentTime;
      this.setState({
        isDraggingProgress: true,
        currentTimePos,
      });
      if (event.nativeEvent instanceof MouseEvent) {
        window.addEventListener("mousemove", this.handleMouseOrTouchMove);
        window.addEventListener("mouseup", this.handleMouseOrTouchUp);
      }
      else {
        window.addEventListener("touchmove", this.handleMouseOrTouchMove);
        window.addEventListener("touchend", this.handleMouseOrTouchUp);
      }
    }
  };

  handleMouseOrTouchMove = (event: MouseEvent | TouchEvent) => {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }

    event.stopPropagation();
    const windowSelection: Selection | null = window.getSelection();
    if (windowSelection && windowSelection.type === "Range") {
      windowSelection.empty();
    }
    if (this.state.isDraggingProgress) {
      const { currentTime, currentTimePos } = this.getCurrentProgress(event);
      this.timeOnMouseMove = currentTime;
      this.setState({ currentTimePos });
    }
  };

  handleMouseOrTouchUp = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    this.setState({ isDraggingProgress: false });
    event.stopPropagation();
    const newTime = this.timeOnMouseMove;
    const { audio } = this.props;
    const newProps: { isDraggingProgress: boolean; currentTimePos?: string } = {
      isDraggingProgress: false,
    };
    if (!audio) {
      return;
    }
    if (audio.readyState === audio.HAVE_NOTHING || audio.readyState === audio.HAVE_METADATA || !isFinite(newTime)) {
      newProps.currentTimePos = "0%";
    }
    else {
      audio.currentTime = newTime;
    }

    this.setState(newProps);

    if (event instanceof MouseEvent) {
      window.removeEventListener("mousemove", this.handleMouseOrTouchMove);
      window.removeEventListener("mouseup", this.handleMouseOrTouchUp);
    }
    else {
      window.removeEventListener("touchmove", this.handleMouseOrTouchMove);
      window.removeEventListener("touchend", this.handleMouseOrTouchUp);
    }
  };

  handleAudioTimeUpdate = throttle((e: Event): void => {
    const { isDraggingProgress } = this.state;
    const audio = e.target as HTMLAudioElement;
    if (isDraggingProgress) {
      return;
    }
    const { currentTime } = audio;
    const duration = this.getDuration();

    this.setState({
      currentTimePos: `${((currentTime / duration) * 100 || 0).toFixed(2)}%`,
    });
  }, this.progressUpdateInterval);

  componentDidUpdate(): void {
    const { audio } = this.props;
    if (audio && !this.hasAddedAudioEventListener) {
      this.audio = audio;
      this.hasAddedAudioEventListener = true;
      audio.addEventListener("timeupdate", (e: Event) => {
        this.handleAudioTimeUpdate(e);
      });
    }
  }

  componentWillUnmount(): void {
    if (this.audio && this.hasAddedAudioEventListener) {
      this.audio.removeEventListener("timeupdate", (e: Event) => {
        this.handleAudioTimeUpdate(e);
      });
    }
  }

  render(): React.ReactNode {
    const { progressRef, i18nProgressBar, style } = this.props;
    const { currentTimePos, isDraggingProgress } = this.state;
    if (!currentTimePos) {
      return null;
    }
    let indicatorClassNames
      = "absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full bg-gray-450 dark:bg-gray-600 shadow shadow-gray-800 dark:shadow-gray-250 ";
    let indicatorContainerClassNames = "absolute z-20 box-border rounded-full h-13/4 aspect-square scale-0 ";
    let progressClassNames = "absolute z-10 box-border rounded-full h-full bg-gray-550 dark:bg-gray-250 ";

    if (isDraggingProgress) {
      indicatorClassNames += "bg-gray-550 dark:bg-gray-250";
      indicatorContainerClassNames += "scale-100";
      progressClassNames += "bg-green-500 dark:bg-green-500";
    }
    else {
      indicatorClassNames += "group-hover:bg-gray-550 dark:group-hover:bg-gray-250";
      indicatorContainerClassNames += "group-hover:scale-100";
      progressClassNames += "group-hover:bg-green-500 dark:group-hover:bg-green-500";
    }
    return (
      <div
        aria-label={i18nProgressBar}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Number(currentTimePos.split("%")[0])}
        className="h-5 w-4/5 flex flex-row flex-1 items-center justify-center group "
        ref={progressRef}
        style={style}
        onMouseDown={this.handleMouseDownOrTouchStart}
        onTouchStart={this.handleMouseDownOrTouchStart}
      >
        <div className="relative box-border rounded-full h-1 w-full bg-gray-450 dark:bg-gray-600 ">
          <div className={indicatorContainerClassNames} style={{ left: currentTimePos }}>
            <div className={indicatorClassNames} />
          </div>
          <div className={progressClassNames} style={{ width: currentTimePos }} />
        </div>
      </div>
    );
  }
}

function ProgressBarForwardRef(props: ProgressBarForwardRefProps, ref: React.Ref<HTMLDivElement>): React.ReactElement {
  return <ProgressBar {...props} progressRef={ref as React.RefObject<HTMLDivElement>} />;
}

export default forwardRef(ProgressBarForwardRef);
export { ProgressBar, ProgressBarForwardRef };
