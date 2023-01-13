import React, { Component, forwardRef } from "react";
import { getPosX } from "../../utils";
import "./ProgressBar.css";

interface ProgressBarState {
  isDraggingProgress: boolean;
  currentTimePos?: string;
}

interface ProgressBarForwardRefProps {
  progressUpdateInterval?: number;
}

interface ProgressBarProps extends ProgressBarForwardRefProps {
  progressRef: React.RefObject<HTMLDivElement>;
}

interface TimePosInfo {
  currentTime: number;
  currentTimePos: string;
}

class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
  timeOnMouseMove = 0;

  state: ProgressBarState = {
    isDraggingProgress: false,
    currentTimePos: "0%",
  };

  getCurrentProgress = (
    event: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent
  ): TimePosInfo => {
    const { progressRef } = this.props;
    const rect = progressRef.current!.getBoundingClientRect();
    const maxRelativePos = rect.width;

    let relativePos = getPosX(event) - rect.left;

    if (relativePos < 0) {
      relativePos = 0;
    } else if (relativePos > maxRelativePos) {
      relativePos = maxRelativePos;
    }

    const currentTime = (relativePos / maxRelativePos) * 100;
    const currentTimePos = `${currentTime.toFixed(2)}%`;
    return { currentTime, currentTimePos };
  };

  handleMouseDownOrTouchStart = (
    event: React.MouseEvent | React.TouchEvent
  ): void => {
    event.stopPropagation();
    const { currentTime, currentTimePos } = this.getCurrentProgress(event);

    if (isFinite(currentTime)) {
      this.timeOnMouseMove = currentTime;
      this.setState({
        isDraggingProgress: true,
        currentTimePos: currentTimePos,
      });
      if (event.nativeEvent instanceof MouseEvent) {
        window.addEventListener("mousemove", this.handleMouseOrTouchMove);
        window.addEventListener("mouseup", this.handleMouseOrTouchUp);
      } else {
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
    // const windowSelection: Selection | null = window.getSelection();
    // if (windowSelection && windowSelection.type === "Range") {
    //   windowSelection.empty();
    // }
    if (this.state.isDraggingProgress) {
      const { currentTime, currentTimePos } = this.getCurrentProgress(event);
      console.log(currentTimePos);
      this.timeOnMouseMove = currentTime;
      this.setState({ currentTimePos: currentTimePos });
    }
  };

  handleMouseOrTouchUp = (event: MouseEvent | TouchEvent) => {
    event.stopPropagation();
    this.setState({ isDraggingProgress: false });
    console.log("mouse up");

    if (event instanceof MouseEvent) {
      window.removeEventListener("mousemove", this.handleMouseOrTouchMove);
      window.removeEventListener("mouseup", this.handleMouseOrTouchUp);
    } else {
      window.removeEventListener("touchmove", this.handleMouseOrTouchMove);
      window.removeEventListener("touchend", this.handleMouseOrTouchUp);
    }
  };

  fillerStyle = {
    width: `${this.state.currentTimePos}`,
  };

  render(): React.ReactNode {
    const { progressRef } = this.props;
    const {currentTimePos} = this.state;
    return (
      <div
        className="media-controls__progress__container group "
        onTouchStart={this.handleMouseDownOrTouchStart}
        onMouseDown={this.handleMouseDownOrTouchStart}
        ref={progressRef}
      >
        <div className="media-controls__progress__bar ">
          <div
            className="media-controls__progress__bar__progress flex items-center justify-end group-hover:bg-green-500 dark:group-hover:bg-green-500"
            style={{width: currentTimePos}}
          ></div>
          <div className="media-controls__progress__bar__scrubber group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250" />
        </div>
      </div>
    );
  }
}

const ProgressBarForwardRef = (
  props: ProgressBarForwardRefProps,
  ref: React.Ref<HTMLDivElement>
): React.ReactElement => (
  <ProgressBar
    {...props}
    progressRef={ref as React.RefObject<HTMLDivElement>}
  />
);

export default forwardRef(ProgressBarForwardRef);
export { ProgressBar, ProgressBarForwardRef };
