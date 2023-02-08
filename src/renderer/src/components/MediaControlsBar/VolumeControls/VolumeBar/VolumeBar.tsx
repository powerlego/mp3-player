import React, { SyntheticEvent } from "react";
import { getPosX } from "@renderer/utils";

type VolumeBarProps = {
  audio: HTMLAudioElement | null;
  initVolume: number;
  i18nVolumeControl?: string;
};

type VolumePosInfo = {
  currentVol: number;
  currentVolPos: string;
};

function VolumeBar({ audio, initVolume, i18nVolumeControl }: VolumeBarProps): JSX.Element {
  const volumeBar = React.useRef<HTMLDivElement>(null);
  const lastVolume = React.useRef(initVolume);
  const [currentVolumePos, setCurrentVolumePos] = React.useState(
    `${((lastVolume.current / 1) * 100 || 0).toFixed(2)}%`
  );
  const isDraggingVolume = React.useRef(false);
  const [isDragging, setIsDragging] = React.useState(isDraggingVolume.current);
  const hasAddedAudioEventListener = React.useRef(false);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);

  const getCurrentVolume = (event: TouchEvent | MouseEvent): VolumePosInfo => {
    if (!audio) {
      return {
        currentVol: lastVolume.current,
        currentVolPos: `${((lastVolume.current / 1) * 100 || 0).toFixed(2)}%`,
      };
    }
    if (!volumeBar.current) {
      return {
        currentVol: audio.volume,
        currentVolPos: currentVolumePos,
      };
    }
    const volumeBarRect = volumeBar.current.getBoundingClientRect();
    const maxRelativePos = volumeBarRect.width;
    const relativePos = getPosX(event) - volumeBarRect.left;
    let currentVol;
    let currentVolPos;

    if (relativePos < 0) {
      currentVol = 0;
      currentVolPos = "0%";
    } else if (relativePos > volumeBarRect.width) {
      currentVol = 1;
      currentVolPos = "100%";
    } else {
      currentVol = relativePos / maxRelativePos;
      currentVolPos = `${(relativePos / maxRelativePos) * 100}%`;
    }

    return { currentVol, currentVolPos };
  };

  const handleContextMenu = (event: SyntheticEvent): void => {
    event.preventDefault();
  };

  const handleWindowMouseOrTouchMove = (event: TouchEvent | MouseEvent): void => {
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
    event.stopPropagation();
    if (!audio) {
      return;
    }
    const windowSelection: Selection | null = window.getSelection();
    if (windowSelection && windowSelection.type === "Range") {
      windowSelection.empty();
    }
    if (isDraggingVolume.current) {
      const { currentVol, currentVolPos } = getCurrentVolume(event);
      audio.volume = currentVol;
      setCurrentVolumePos(currentVolPos);
    }
  };

  const handleWindowMouseOrTouchUp = (event: TouchEvent | MouseEvent): void => {
    event.stopPropagation();
    isDraggingVolume.current = false;
    setIsDragging(isDraggingVolume.current);
    if (event instanceof MouseEvent) {
      window.removeEventListener("mousemove", handleWindowMouseOrTouchMove);
      window.removeEventListener("mouseup", handleWindowMouseOrTouchUp);
    } else {
      window.removeEventListener("touchmove", handleWindowMouseOrTouchMove);
      window.removeEventListener("touchend", handleWindowMouseOrTouchUp);
    }
  };

  const handleVolumeControlMouseOrTouchDown = (event: React.MouseEvent | React.TouchEvent): void => {
    event.stopPropagation();
    const { currentVol, currentVolPos } = getCurrentVolume(event.nativeEvent);
    if (!audio) {
      return;
    }
    audio.volume = currentVol;
    setCurrentVolumePos(currentVolPos);
    isDraggingVolume.current = true;
    setIsDragging(isDraggingVolume.current);
    if (event.nativeEvent instanceof MouseEvent) {
      window.addEventListener("mousemove", handleWindowMouseOrTouchMove);
      window.addEventListener("mouseup", handleWindowMouseOrTouchUp);
    } else {
      window.addEventListener("touchmove", handleWindowMouseOrTouchMove);
      window.addEventListener("touchend", handleWindowMouseOrTouchUp);
    }
  };

  const handleAudioVolumeChange = React.useCallback((): void => {
    (e: Event): void => {
      const { volume } = e.target as HTMLAudioElement;
      lastVolume.current = volume;
      if (isDraggingVolume.current) {
        return;
      }
      setCurrentVolumePos(`${((volume / 1) * 100 || 0).toFixed(2)}%`);
    };
  }, [isDraggingVolume]);
  React.useEffect(() => {
    if (audio && !hasAddedAudioEventListener.current) {
      audio.addEventListener("volumechange", handleAudioVolumeChange);
      hasAddedAudioEventListener.current = true;
    }
    return () => {
      if (audio && hasAddedAudioEventListener.current) {
        audio.removeEventListener("volumechange", handleAudioVolumeChange);
        hasAddedAudioEventListener.current = false;
      }
    };
  }, [audio, handleAudioVolumeChange]);

  if (typeof audio?.volume === "undefined") {
    return (
      <div
        aria-label={i18nVolumeControl}
        className="flex h-5 w-full flex-1 flex-row items-center justify-center"
        ref={volumeBar}
        role="progressbar"
      >
        <div className="relative box-border h-1 w-full rounded-full bg-gray-450 dark:bg-gray-600">
          <div className="absolute z-10 box-border h-full rounded-full bg-gray-500 dark:bg-gray-550" />
        </div>
      </div>
    );
  }
  return !isAudioAvailable ? (
    <div
      aria-label={i18nVolumeControl}
      className="flex h-5 w-full flex-1 flex-row items-center justify-center"
      ref={volumeBar}
      role="progressbar"
    >
      <div className="relative box-border h-1 w-full rounded-full bg-gray-450 dark:bg-gray-600">
        <div className="absolute z-10 box-border h-full rounded-full bg-gray-500 dark:bg-gray-550" />
      </div>
    </div>
  ) : (
    <div
      aria-label={i18nVolumeControl}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Number((audio.volume * 100).toFixed(0))}
      className="flex h-5 w-full flex-1 flex-row items-center justify-center group"
      ref={volumeBar}
      role="progressbar"
      onContextMenu={handleContextMenu}
      onMouseDown={handleVolumeControlMouseOrTouchDown}
      onTouchStart={handleVolumeControlMouseOrTouchDown}
    >
      <div className="relative box-border h-1 w-full rounded-full bg-gray-450 dark:bg-gray-600">
        <div
          style={{ left: currentVolumePos }}
          className={`absolute z-20 box-border rounded-full h-13/4 aspect-square group-hover:scale-100 ${
            isDragging ? "scale-100" : "scale-0"
          }`}
        >
          <div
            className={`absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full shadow shadow-gray-800 dark:shadow-gray-250 group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250 ${
              isDragging ? "bg-gray-550 dark:bg-gray-250" : "bg-gray-450 dark:bg-gray-600"
            }`}
          />
        </div>
        <div
          style={{ width: currentVolumePos }}
          className={`absolute z-10 box-border h-full rounded-full group-hover:bg-green-500 dark:group-hover:bg-green-500 ${
            isDragging
              ? "bg-green-500 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-500"
              : "bg-gray-800 dark:bg-gray-150"
          }`}
        />
      </div>
    </div>
  );
}

// class VolumeBarClass extends Component<VolumeBarProps, VolumeBarState> {
//   audio?: HTMLAudioElement;

//   hasAddedAudioEventListener = false;

//   volumeBar = React.createRef<HTMLDivElement>();

//   lastVolume = this.props.initVolume;

//   state: VolumeBarState = {
//     currentVolumePos: `${((this.lastVolume / 1) * 100 || 0).toFixed(2)}%`,
//     isDraggingVolume: false,
//   };

//   // get volume info while dragging by indicator mouse or touch
//   getCurrentVolume = (event: TouchEvent | MouseEvent): VolumePosInfo => {
//     const { audio } = this.props;
//     if (!audio) {
//       return {
//         currentVolume: this.lastVolume,
//         currentVolumePos: `${((this.lastVolume / 1) * 100 || 0).toFixed(2)}%`,
//       };
//     }
//     if (!this.volumeBar.current) {
//       return {
//         currentVolume: audio.volume,
//         currentVolumePos: this.state.currentVolumePos,
//       };
//     }
//     const volumeBarRect = this.volumeBar.current.getBoundingClientRect();
//     const maxRelativePos = volumeBarRect.width;
//     const relativePos = getPosX(event) - volumeBarRect.left;
//     let currentVolume;
//     let currentVolumePos;

//     if (relativePos < 0) {
//       currentVolume = 0;
//       currentVolumePos = "0%";
//     }
//     else if (relativePos > volumeBarRect.width) {
//       currentVolume = 1;
//       currentVolumePos = "100%";
//     }
//     else {
//       currentVolume = relativePos / maxRelativePos;
//       currentVolumePos = `${(relativePos / maxRelativePos) * 100}%`;
//     }

//     return { currentVolume, currentVolumePos };
//   };

//   handleContextMenu = (event: SyntheticEvent): void => {
//     event.preventDefault();
//   };

//   handleVolumeControlMouseOrTouchDown = (event: React.MouseEvent | React.TouchEvent): void => {
//     event.stopPropagation();
//     const { audio } = this.props;
//     const { currentVolume, currentVolumePos } = this.getCurrentVolume(event.nativeEvent);
//     if (!audio) {
//       return;
//     }
//     audio.volume = currentVolume;
//     this.setState({ isDraggingVolume: true, currentVolumePos });

//     if (event.nativeEvent instanceof MouseEvent) {
//       window.addEventListener("mousemove", this.handleWindowMouseOrTouchMove);
//       window.addEventListener("mouseup", this.handleWindowMouseOrTouchUp);
//     }
//     else {
//       window.addEventListener("touchmove", this.handleWindowMouseOrTouchMove);
//       window.addEventListener("touchend", this.handleWindowMouseOrTouchUp);
//     }
//   };

//   handleWindowMouseOrTouchMove = (event: TouchEvent | MouseEvent): void => {
//     if (event instanceof MouseEvent) {
//       event.preventDefault();
//     }
//     event.stopPropagation();
//     const { audio } = this.props;
//     if (!audio) {
//       return;
//     }
//     // Prevent Chrome drag selection bug
//     const windowSelection: Selection | null = window.getSelection();
//     if (windowSelection && windowSelection.type === "Range") {
//       windowSelection.empty();
//     }

//     const { isDraggingVolume } = this.state;
//     if (isDraggingVolume) {
//       const { currentVolume, currentVolumePos } = this.getCurrentVolume(event);
//       audio.volume = currentVolume;
//       this.setState({ currentVolumePos });
//     }
//   };

//   handleWindowMouseOrTouchUp = (event: MouseEvent | TouchEvent): void => {
//     event.stopPropagation();
//     this.setState({ isDraggingVolume: false });

//     if (event instanceof MouseEvent) {
//       window.removeEventListener("mousemove", this.handleWindowMouseOrTouchMove);
//       window.removeEventListener("mouseup", this.handleWindowMouseOrTouchUp);
//     }
//     else {
//       window.removeEventListener("touchmove", this.handleWindowMouseOrTouchMove);
//       window.removeEventListener("touchend", this.handleWindowMouseOrTouchUp);
//     }
//   };

//   handleAudioVolumeChange = (e: Event): void => {
//     const { isDraggingVolume } = this.state;
//     const { volume } = e.target as HTMLAudioElement;
//     this.lastVolume = volume;
//     if (isDraggingVolume) {
//       return;
//     }
//     this.setState({
//       currentVolumePos: `${((volume / 1) * 100 || 0).toFixed(2)}%`,
//     });
//   };

//   componentDidUpdate(): void {
//     const { audio } = this.props;
//     if (audio && !this.hasAddedAudioEventListener) {
//       this.audio = audio;
//       this.hasAddedAudioEventListener = true;
//       audio.addEventListener("volumechange", (e: Event) => {
//         this.handleAudioVolumeChange(e);
//       });
//     }
//   }

//   componentWillUnmount(): void {
//     if (this.audio && this.hasAddedAudioEventListener) {
//       this.audio.removeEventListener("volumechange", (e: Event) => {
//         this.handleAudioVolumeChange(e);
//       });
//     }
//   }
//   isAudioAvailable = (): boolean => {
//     const { audio } = this.props;
//     if (!audio) {
//       return false;
//     }
//     if (audio.src === "" || audio.src === window.location.href) {
//       return false;
//     }
//     return true;
//   };

//   render(): React.ReactNode {
//     const { audio, i18nVolumeControl } = this.props;
//     const { currentVolumePos, isDraggingVolume } = this.state;

//     const { volume } = audio || {};
//     if (typeof volume === "undefined") {
//       return null;
//     }
//     let indicatorClassNames
//       = "absolute h-full w-full top-[calc((50%*-1)+1px)] ml-[calc(50%*-1)] box-border rounded-full bg-gray-450 dark:bg-gray-600 shadow shadow-gray-800 dark:shadow-gray-250 ";
//     let indicatorContainerClassNames = "absolute z-20 box-border rounded-full h-13/4 aspect-square scale-0 ";

//     let volumeClassNames = "absolute z-10 box-border h-full rounded-full bg-gray-500 dark:bg-gray-550 ";

//     if (!this.isAudioAvailable()) {
//       return (
//         <div
//           aria-label={i18nVolumeControl}
//           className="flex h-5 w-full flex-1 flex-row items-center justify-center"
//           ref={this.volumeBar}
//           role="progressbar"
//         >
//           <div className="relative box-border h-1 w-full rounded-full bg-gray-450 dark:bg-gray-600">
//             <div className={indicatorClassNames} style={{ left: currentVolumePos }} />
//             <div className={volumeClassNames} style={{ width: currentVolumePos }} />
//           </div>
//         </div>
//       );
//     }
//     else {
//       if (isDraggingVolume) {
//         indicatorClassNames += "bg-gray-550 dark:bg-gray-250";
//         indicatorContainerClassNames += "scale-100";
//         volumeClassNames
//           = "absolute z-10 box-border h-full rounded-full bg-green-500 dark:bg-green-500 hover:bg-green-500 dark:hover:bg-green-500";
//       }
//       else {
//         indicatorClassNames += "group-hover:scale-100 group-hover:bg-gray-550 dark:group-hover:bg-gray-250";
//         indicatorContainerClassNames += "group-hover:scale-100";
//         volumeClassNames
//           = "absolute z-10 box-border h-full rounded-full bg-gray-800 dark:bg-gray-150 group-hover:bg-green-500 dark:group-hover:bg-green-500";
//       }
//       return (
//         <div
//           aria-label={i18nVolumeControl}
//           aria-valuemax={100}
//           aria-valuemin={0}
//           aria-valuenow={Number((volume * 100).toFixed(0))}
//           className="flex h-5 w-full flex-1 flex-row items-center justify-center group"
//           ref={this.volumeBar}
//           role="progressbar"
//           onContextMenu={this.handleContextMenu}
//           onMouseDown={this.handleVolumeControlMouseOrTouchDown}
//           onTouchStart={this.handleVolumeControlMouseOrTouchDown}
//         >
//           <div className="relative box-border h-1 w-full rounded-full bg-gray-450 dark:bg-gray-600">
//             <div className={indicatorContainerClassNames} style={{ left: currentVolumePos }}>
//               <div className={indicatorClassNames} />
//             </div>
//             <div className={volumeClassNames} style={{ width: currentVolumePos }} />
//           </div>
//         </div>
//       );
//     }
//   }
// }

export default VolumeBar;
