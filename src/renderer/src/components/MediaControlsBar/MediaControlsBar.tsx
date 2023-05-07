import { I18nAriaLabels, FilePayload } from "@/types";
import { TIME_FORMAT } from "@renderer/constants";
// import useForceUpdate from "@renderer/hooks/useForceUpdate";
import React, { ReactNode } from "react";
import MediaControls from "./MediaControls";
import SongDetails from "./SongDetails";
import TrackProgress from "./TrackProgress";
import VolumeControls from "./VolumeControls";
import useQueue from "@renderer/hooks/useQueue";
import useForceUpdate from "@renderer/hooks/useForceUpdate";
import useMediaKeyBindings from "@renderer/hooks/useMediaKeyBindings";
import combineKeyCodes from "@utils/combineKeyCodes";
import throttle from "@utils/throttle";

type MediaControlsBarProps = {
  audio: React.RefObject<HTMLAudioElement>;
  progressUpdateInterval?: number;
  i18nAriaLabels?: I18nAriaLabels;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  volume?: number;
  muted?: boolean;
  isPlaying?: boolean;
  setIsPlaying?: React.Dispatch<React.SetStateAction<boolean>>;
  expandFunc?: () => void;
  className?: string;
  progressJumpStep?: number;
  progressJumpSteps?: {
    backward?: number;
    forward?: number;
  };
  volumeJumpStep?: number;
};

function MediaControlsBar(props: MediaControlsBarProps): JSX.Element {
  const {
    audio,
    progressUpdateInterval,
    i18nAriaLabels = {
      player: "Audio player",
      progressControl: "Audio progress control",
      volumeControl: "Volume control",
      play: "Play",
      pause: "Pause",
      rewind: "Rewind",
      shuffle: "Shuffle",
      shuffleOn: "Shuffle enabled",
      previous: "Previous",
      next: "Skip",
      loop: "Disable loop",
      loopOnce: "Enable loop once",
      loopOff: "Enable loop",
      volume: "Mute",
      volumeMute: "Unmute",
    },
    defaultCurrentTime = "--:--",
    defaultDuration = "--:--",
    timeFormat = "auto",
    volume = 1,
    muted = false,
    expandFunc,
    className,
    progressJumpStep = 5000,
    progressJumpSteps = {},
    volumeJumpStep = 0.05,
    isPlaying: isPlayingProp,
    setIsPlaying: setIsPlayingProp,
  } = props;

  // const forceUpdate = useForceUpdate();
  const [songName, setSongName] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [coverArt, setCoverArt] = React.useState("");
  const [mediaKeyBindings] = useMediaKeyBindings();
  const [currTime, setCurrTime] = React.useState(0);
  const [isPlayingL, setIsPlayingL] = React.useState(false);
  const isPlaying = isPlayingProp ?? isPlayingL;
  const setIsPlaying = setIsPlayingProp ?? setIsPlayingL;
  const forceUpdate = useForceUpdate();

  const seekingTimer: React.MutableRefObject<ReturnType<typeof setTimeout> | null> = React.useRef(null);
  const seekingDelay = 200;
  const seekingSpeed = 100;
  const curTime = React.useRef(-1);

  const [repeat, setRepeat, shuffle, setShuffle, repeatCount, getNextSong] = useQueue();

  const lastVolume = React.useRef(volume);
  const container = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const stopSeekingTimer = (): void => {
    if (seekingTimer.current) {
      clearTimeout(seekingTimer.current);
      seekingTimer.current = null;
    }
  };

  const togglePlay = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if ((aud.paused || aud.ended) && aud.src) {
      playAudioPromise();
      setIsPlaying(true);
    }
    else if (!aud.paused) {
      aud.pause();
      setIsPlaying(false);
    }
  };

  const playAudioPromise = (): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    const playPromise = aud.play();
    // playPromise is null in IE 11

    if (repeat === 2 && repeatCount.current > 0) {
      repeatCount.current = 0;
    }

    playPromise.then(null).catch((err) => {
      console.log(err);
      setIsPlaying(false);
    });
  };

  const handleRepeatOnce = (): void => {
    const aud = audio.current;
    const repeatCnt = repeatCount.current;
    if (!aud) {
      return;
    }
    if (repeatCnt === 0) {
      repeatCount.current = 1;
    }
  };

  const handleClickRepeatButton = (): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (repeat === 0) {
      aud.loop = true;
      repeatCount.current = 0;
      setRepeat(1);
    }
    else if (repeat === 1) {
      aud.loop = false;
      aud.addEventListener("ended", handleRepeatOnce);
      setRepeat(2);
    }
    else {
      aud.loop = false;
      aud.removeEventListener("ended", handleRepeatOnce);
      setRepeat(0);
      repeatCount.current = 0;
    }
  };

  const handleClickVolumeButton = (): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (aud.volume > 0) {
      lastVolume.current = aud.volume;
      aud.volume = 0;
    }
    else {
      aud.volume = lastVolume.current;
    }
  };

  const handleFileOpen = (_event: Electron.IpcRendererEvent, file: FilePayload) => {
    setSongName(file.metadata.common.title ?? "");
    setArtistName(file.metadata.common.artist ?? "");
    if (file.picture.base64 !== "") {
      setCoverArt(`data:${file.picture.format};base64,${file.picture.base64}`);
    }
  };

  const handleJumpBackward = (recurse = false): void => {
    stopSeekingTimer();
    const jumpStep = progressJumpSteps.backward ?? progressJumpStep;
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (!aud.paused) {
      aud.pause();
    }
    const { duration } = aud;

    const prevTime = curTime.current === -1 ? aud.currentTime : curTime.current;
    if (
      aud.readyState !== aud.HAVE_NOTHING
      && aud.readyState !== aud.HAVE_METADATA
      && isFinite(duration)
      && isFinite(prevTime)
    ) {
      let currentTime = prevTime - jumpStep / 1000;
      if (currentTime < 0) {
        currentTime = 0;
      }
      curTime.current = currentTime;
      setCurrTime(currentTime);
      if (currentTime > 0) {
        seekingTimer.current = setTimeout(() => handleJumpBackward(true), recurse ? seekingSpeed : seekingDelay);
      }
    }
  };

  const handleJumpForward = (recurse = false): void => {
    stopSeekingTimer();
    const jumpStep = progressJumpSteps.forward ?? progressJumpStep;
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (!aud.paused) {
      aud.pause();
    }
    const { duration } = aud;

    const prevTime = curTime.current === -1 ? aud.currentTime : curTime.current;
    if (
      aud.readyState !== aud.HAVE_NOTHING
      && aud.readyState !== aud.HAVE_METADATA
      && isFinite(duration)
      && isFinite(prevTime)
    ) {
      let currentTime = prevTime + jumpStep / 1000;
      if (currentTime > duration) {
        currentTime = duration;
      }
      curTime.current = currentTime;
      setCurrTime(currentTime);
      if (currentTime < duration) {
        seekingTimer.current = setTimeout(() => handleJumpForward(true), recurse ? seekingSpeed : seekingDelay);
      }
    }
  };
  const setJumpVolume = (jumpVolume: number): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    const { volume: prevVolume } = aud;
    if (isFinite(prevVolume)) {
      let volume = prevVolume + jumpVolume;
      volume = Math.round(volume * 100) / 100;
      if (volume < 0) {
        volume = 0;
      }
      else if (volume > 1) {
        volume = 1;
      }
      aud.volume = volume;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const keys = combineKeyCodes(e);
    switch (keys) {
    case mediaKeyBindings.playPause:
      if (!progressRef.current) {
        return;
      }
      if (!container.current) {
        return;
      }
      if (e.target === container.current || e.target === progressRef.current) {
        e.preventDefault();
        togglePlay(e);
      }
      break;
    case mediaKeyBindings.jumpBackward:
      e.preventDefault();
      handleJumpBackward();
      break;
    case mediaKeyBindings.jumpForward:
      e.preventDefault();
      handleJumpForward();
      break;
    case mediaKeyBindings.volumeUp:
      e.preventDefault();
      setJumpVolume(volumeJumpStep);
      break;
    case mediaKeyBindings.volumeDown:
      e.preventDefault();
      setJumpVolume(-volumeJumpStep);
      break;
    case mediaKeyBindings.repeat:
      e.preventDefault();
      handleClickRepeatButton();
      break;
    case mediaKeyBindings.mute:
      e.preventDefault();
      handleClickVolumeButton();
      break;
    case mediaKeyBindings.shuffle:
      e.preventDefault();
      setShuffle(!shuffle);
      break;
    default:
      break;
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    const keys = combineKeyCodes(e);
    const aud = audio.current;
    switch (keys) {
    case mediaKeyBindings.jumpBackward:
    case mediaKeyBindings.jumpForward:
      e.preventDefault();
      stopSeekingTimer();
      if (!aud) {
        break;
      }
      aud.currentTime = curTime.current;
      curTime.current = -1;
      if (isPlaying) {
        playAudioPromise();
      }
      break;
    }
  };

  React.useEffect(() => {
    forceUpdate();
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (muted) {
      aud.volume = 0;
    }
    else {
      aud.volume = lastVolume.current;
    }
    aud.addEventListener("ended", getNextSong);
    aud.addEventListener("ended", () => {
      setIsPlaying(false);
    });
    aud.addEventListener(
      "timeupdate",
      throttle(() => {
        const { currentTime } = aud;
        setCurrTime(currentTime);
      }, progressUpdateInterval ?? 0)
    );
    window.api.onFileOpen(handleFileOpen);
    return () => {
      window.api.offFileOpen(handleFileOpen);
      aud.removeEventListener("ended", getNextSong);
      aud.removeEventListener(
        "timeupdate",
        throttle(() => {
          const { currentTime } = aud;
          setCurrTime(currentTime);
        }, progressUpdateInterval ?? 0)
      );
      aud.removeEventListener("ended", () => {
        setIsPlaying(false);
      });
    };
  }, []);

  if (!timeFormat) {
    return <></>;
  }
  return (
    <div
      aria-label={i18nAriaLabels?.player}
      className={className}
      ref={container}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div className="flex h-full w-full flex-row justify-between items-center">
        <SongDetails artistName={artistName} coverArt={coverArt} expandFunc={expandFunc} songName={songName} />
        <div className="flex w-1/2 min-w-fit max-w-[45rem] flex-col items-center justify-center">
          <MediaControls
            audio={audio.current}
            handleClickRepeatButton={handleClickRepeatButton}
            i18nAriaLabels={i18nAriaLabels}
            isPlaying={isPlaying}
            repeat={repeat}
            setShuffle={setShuffle}
            shuffle={shuffle}
            togglePlay={togglePlay}
          />
          <TrackProgress
            audio={audio.current}
            curTime={currTime}
            defaultCurrentTime={defaultCurrentTime}
            defaultDuration={defaultDuration}
            i18nAriaLabels={i18nAriaLabels}
            progressUpdateInterval={progressUpdateInterval}
            ref={progressRef}
            timeFormat={timeFormat}
          />
        </div>
        <div className="w-[20%] min-w-[11.25rem] flex flex-row justify-end items-center">
          <div className="flex flex-grow justify-end items-center">
            <VolumeControls
              audio={audio.current}
              i18nAriaLabels={i18nAriaLabels}
              onClickedVolumeButton={handleClickVolumeButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaControlsBar;
