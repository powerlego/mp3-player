import React, { Component, forwardRef } from "react";
import { getPosX, throttle } from "../../utils";
import "./ProgressBar.css";

interface ProgressBarState {
    isDraggingProgress: boolean;
    currentTimePos?: string;
}

interface ProgressBarForwardRefProps {
    audio: HTMLAudioElement;
    progressUpdateInterval?: number;
    srcDuration?: number;
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
        return typeof srcDuration === "undefined" ? audio.duration : srcDuration;
    }

    getCurrentProgress = (event: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent): TimePosInfo => {
        const { progressRef } = this.props;
        const rect = progressRef.current!.getBoundingClientRect();
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
        if (isDraggingProgress) {return;}

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
            audio.addEventListener("timeupdate", this.handleAudioTimeUpdate);
        }
    }

    componentWillUnmount(): void {
        if (this.audio && this.hasAddedAudioEventListener) {
            this.audio.removeEventListener("timeupdate", this.handleAudioTimeUpdate);
        }
    }

    render(): React.ReactNode {
        const { progressRef } = this.props;
        const { currentTimePos, isDraggingProgress } = this.state;
        let indicatorClassNames = "media-controls__progress__bar__scrubber ";

        let progressClassNames = "media-controls__progress__bar__progress ";

        if (isDraggingProgress) {
            indicatorClassNames += "media-controls__progress__bar__scrubber__dragging";
            progressClassNames += "media-controls__progress__bar__progress__dragging";
        }
        else {
            indicatorClassNames += "group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250";
            progressClassNames += "group-hover:bg-green-500 dark:group-hover:bg-green-500";
        }
        return (
            <div
                className="media-controls__progress__container group "
                onTouchStart={this.handleMouseDownOrTouchStart}
                onMouseDown={this.handleMouseDownOrTouchStart}
                ref={progressRef}
            >
                <div className="media-controls__progress__bar ">
                    <div className={indicatorClassNames} style={{ left: currentTimePos }} />
                    <div className={progressClassNames} style={{ width: currentTimePos }}></div>
                </div>
            </div>
        );
    }
}

function ProgressBarForwardRef(props: ProgressBarForwardRefProps,ref: React.Ref<HTMLDivElement>): React.ReactElement {
    return <ProgressBar {...props} progressRef={ref as React.RefObject<HTMLDivElement>} />;
}

export default forwardRef(ProgressBarForwardRef);
export { ProgressBar, ProgressBarForwardRef };
