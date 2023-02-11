import { I18nAriaLabels } from "@/types";
import { TIME_FORMAT } from "@renderer/constants";
import useForceUpdate from "@renderer/hooks/useForceUpdate";
import React, { ReactNode } from "react";
import MediaControls from "./MediaControls";
import SongDetails from "./SongDetails";
import TrackProgress from "./TrackProgress";
import VolumeControls from "./VolumeControls";
import { FilePayload } from "@/types";

type MediaControlsBarProps = {
  audio: React.RefObject<HTMLAudioElement>;
  progressUpdateInterval?: number;

  /**
   * HTML5 Audio tag preload property
   */
  i18nAriaLabels?: I18nAriaLabels;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  volume?: number;
  muted?: boolean;
  expandFunc?: () => void;
  className?: string;
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
  } = props;

  const forceUpdate = useForceUpdate();
  const [songName, setSongName] = React.useState("");
  const [artistName, setArtistName] = React.useState("");
  const [coverArt, setCoverArt] = React.useState("");

  const lastVolume = React.useRef(volume);

  const togglePlay = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if ((aud.paused || aud.ended) && aud.src) {
      playAudioPromise();
    } else if (!aud.paused) {
      aud.pause();
    }
  };

  const playAudioPromise = (): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    const playPromise = aud.play();
    // playPromise is null in IE 11

    playPromise.then(null).catch((err) => {
      console.log(err);
    });
  };

  const handleClickVolumeButton = (): void => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (aud.volume > 0) {
      lastVolume.current = aud.volume;
      aud.volume = 0;
    } else {
      aud.volume = lastVolume.current;
    }
  };

  const handleClickLoopButton = (): void => {
    if (!audio.current) {
      return;
    }
    audio.current.loop = !audio.current.loop;
    forceUpdate();
  };

  const handleFileOpen = (_event: Electron.IpcRendererEvent, file: FilePayload, _play: boolean) => {
    setSongName(file.metadata.common.title ?? "");
    setArtistName(file.metadata.common.artist ?? "");
    if (file.picture.base64 !== "") {
      setCoverArt(`data:${file.picture.format};base64,${file.picture.base64}`);
    }
  };

  React.useEffect(() => {
    const aud = audio.current;
    if (!aud) {
      return;
    }
    if (muted) {
      aud.volume = 0;
    } else {
      aud.volume = lastVolume.current;
    }
    window.api.onFileOpen(handleFileOpen);
    return () => {
      window.api.offFileOpen(handleFileOpen);
    };
  });

  if (!timeFormat) {
    return <></>;
  }
  return (
    <div aria-label={i18nAriaLabels?.player} className={className}>
      <div className="flex h-full w-full flex-row justify-between items-center">
        <SongDetails artistName={artistName} coverArt={coverArt} expandFunc={expandFunc} songName={songName} />
        <div className="flex w-1/2 min-w-fit max-w-[45rem] flex-col items-center justify-center">
          <MediaControls audio={audio.current} i18nAriaLabels={i18nAriaLabels} togglePlay={togglePlay} />
          <TrackProgress
            audio={audio.current}
            defaultCurrentTime={defaultCurrentTime}
            defaultDuration={defaultDuration}
            i18nAriaLabels={i18nAriaLabels}
            progressUpdateInterval={progressUpdateInterval}
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
