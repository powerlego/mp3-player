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

type MediaControlsBarProps = {
  audio: React.RefObject<HTMLAudioElement>;
  progressUpdateInterval?: number;
  i18nAriaLabels?: I18nAriaLabels;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  volume?: number;
  muted?: boolean;
  expandFunc?: () => void;
  className?: string;
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
    volumeJumpStep = 0.05,
  } = props;

  // const forceUpdate = useForceUpdate();
  const [songName, setSongName] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [coverArt, setCoverArt] = React.useState("");
  const [mediaKeyBindings] = useMediaKeyBindings();
  const forceUpdate = useForceUpdate();

  const [repeat, setRepeat, shuffle, setShuffle, repeatCount, getNextSong, getPreviousSong] = useQueue();

  const lastVolume = React.useRef(volume);
  const container = React.useRef<HTMLDivElement>(null);
  const progressRef = React.useRef<HTMLDivElement>(null);

  const togglePlay = (e: React.SyntheticEvent | Event): void => {
    e.stopPropagation();
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if ((aud.paused || aud.ended) && aud.src) {
      playAudioPromise();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }
    }
    else if (!aud.paused) {
      aud.pause();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
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
    if ("mediaSession" in navigator) {
      const artwork = file.pictures.map((picture) => {
        return {
          src: `data:${file.picture.format};base64,${file.picture.base64}`,
          sizes: picture.dimensions,
          type: picture.format,
        };
      });
      const artist = (() => {
        if (file.metadata.common.artist) {
          const artists = file.metadata.common.artist.split(",");
          if (artists.length > 1) {
            return artists.join(", ");
          }
          return artists[0];
        }
        return "";
      })();

      navigator.mediaSession.metadata = new MediaMetadata({
        title: file.metadata.common.title ?? "",
        artist,
        album: file.metadata.common.album ?? "",
        artwork,
      });
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

  const handleSkipBackward = (): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    const curTime = aud.currentTime * 1000;
    if (curTime < 500) {
      getPreviousSong();
    }
    else {
      aud.currentTime = 0;
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

  const addMediaSessionActions = (): void => {
    if (!("mediaSession" in navigator)) {
      return;
    }
    navigator.mediaSession.setActionHandler("play", () => {
      const aud = audio.current;
      if (!aud) {
        return;
      }
      if ((aud.paused || aud.ended) && aud.src) {
        playAudioPromise();
        navigator.mediaSession.playbackState = "playing";
      }
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      const aud = audio.current;
      if (!aud) {
        return;
      }
      if (!aud.paused) {
        aud.pause();
        navigator.mediaSession.playbackState = "paused";
      }
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      handleSkipBackward();
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      getNextSong();
    });
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
    window.api.onFileOpen(handleFileOpen);
    addMediaSessionActions();
    return () => {
      window.api.offFileOpen(handleFileOpen);
      aud.removeEventListener("ended", getNextSong);
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
    >
      <div className="flex h-full w-full flex-row justify-between items-center">
        <SongDetails artistName={artistName} coverArt={coverArt} expandFunc={expandFunc} songName={songName} />
        <div className="flex w-1/2 min-w-fit max-w-[45rem] flex-col items-center justify-center">
          <MediaControls
            audio={audio.current}
            handleClickRepeatButton={handleClickRepeatButton}
            handleSkipBack={handleSkipBackward}
            handleSkipForward={getNextSong}
            i18nAriaLabels={i18nAriaLabels}
            repeat={repeat}
            setShuffle={setShuffle}
            shuffle={shuffle}
            togglePlay={togglePlay}
          />
          <TrackProgress
            audio={audio.current}
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
