import React, { ReactNode } from "react";
import { AUDIO_PRELOAD_ATTRIBUTE, TIME_FORMAT } from "../../constants";
import "./MediaControlsBar.css";
import TrackProgress from "./TrackProgress";
import MediaControls from "./MediaControls";
import { CoverArt, I18nAriaLabels, MetaDataPayload } from "../../types";
import VolumeControls from "./VolumeControls";
import SongDetails from "./SongDetails";

type MediaControlsBarProps = {
  src?: string;
  progressUpdateInterval?: number;

  /**
   * HTML5 Audio tag preload property
   */
  preload?: AUDIO_PRELOAD_ATTRIBUTE;
  i18nAriaLabels?: I18nAriaLabels;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  volume?: number;
  muted?: boolean;
  expandFunc?: () => void;
};

type MediaControlsBarState = {
  songName: string;
  coverArt: CoverArt;
};

class MediaControlsBar extends React.Component<MediaControlsBarProps, MediaControlsBarState> {
  hasFetchedMetadata = false;

  static defaultProps: MediaControlsBarProps = {
    timeFormat: "auto",
    defaultCurrentTime: "--:--",
    defaultDuration: "--:--",
    i18nAriaLabels: {
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
  };

  state: MediaControlsBarState = {
    songName: "",
    coverArt: {
      data: "",
      format: "",
    },
  };

  audio = React.createRef<HTMLAudioElement>();

  lastVolume = this.props.volume ? this.props.volume : 1;

  togglePlay = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    if ((audio.paused || audio.ended) && audio.src) {
      this.playAudioPromise();
    }
    else if (!audio.paused) {
      audio.pause();
    }
  };

  playAudioPromise = (): void => {
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    const playPromise = audio.play();
    // playPromise is null in IE 11

    playPromise.then(null).catch((err) => {
      console.log(err);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePlay = (e: Event): void => {
    this.forceUpdate();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handlePause = (e: Event): void => {
    if (!this.audio) {
      return;
    }
    this.forceUpdate();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEnded = (e: Event): void => {
    if (!this.audio) {
      return;
    }
    // Remove forceUpdate when stop supporting IE 11
    this.forceUpdate();
  };

  handleClickVolumeButton = (): void => {
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    if (audio.volume > 0) {
      this.lastVolume = audio.volume;
      audio.volume = 0;
    }
    else {
      audio.volume = this.lastVolume;
    }
  };

  handleMuteChange = (): void => {
    this.forceUpdate();
  };

  handleClickLoopButton = (): void => {
    if (!this.audio.current) {
      return;
    }
    this.audio.current.loop = !this.audio.current.loop;
    this.forceUpdate();
  };

  fetchMetadata = (): void => {
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    const { src } = audio;
    if (!this.hasFetchedMetadata) {
      this.hasFetchedMetadata = true;
      if (!import.meta.env.REACT_APP_SERVER_URL) {
        console.log("No server URL provided");
        return;
      }
      const url = new URL(import.meta.env.REACT_APP_SERVER_URL as string);
      if (src === "" || src === window.location.href) {
        return;
      }
      fetch(src)
        .then(async (res) => {
          if (res.ok) {
            if (res.body) {
              url.pathname = "/metadata";
              const resText = await res.blob();
              const form = new FormData();
              form.append("track", resText);
              const resp = await fetch(url, {
                method: "POST",
                body: form,
              });
              const payload = (await resp.json()) as MetaDataPayload;
              const { name, cover } = payload.data;
              this.setState({
                songName: name,
                coverArt: cover,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  componentDidMount() {
    this.forceUpdate();
    const audio = this.audio.current;
    if (!audio) {
      return;
    }
    if (this.props.muted) {
      audio.volume = 0;
    }
    else {
      audio.volume = this.lastVolume;
    }
    audio.addEventListener("loadstart", this.fetchMetadata);
    // mmb.fetchFromUrl(audio.src)
    //     .then((metadata) => {
    //         console.log(metadata);
    //     })
    //     .finally(() => {
    //         this.setState({
    //             songName: "Song Name",
    //         });
    //     });

    // When audio play starts
    audio.addEventListener("play", this.handlePlay);

    audio.addEventListener("ended", this.handleEnded);

    // When the user pauses playback
    audio.addEventListener("pause", this.handlePause);
  }

  componentDidUpdate(prevProps: MediaControlsBarProps): void {
    const { src } = this.props;
    if (prevProps.src !== src) {
      // if (autoPlayAfterSrcChange) {
      //     this.playAudioPromise();
      // }
      // else {
      // Updating pause icon to play icon
      this.forceUpdate();
      // }
    }
  }
  isPlaying = (): boolean => {
    const audio = this.audio.current;
    if (!audio) {
      return false;
    }

    return !audio.paused && !audio.ended;
  };

  render() {
    const { src, timeFormat, defaultCurrentTime, defaultDuration, i18nAriaLabels, expandFunc } = this.props;
    const { coverArt } = this.state;
    const audio = this.audio.current;
    if (!timeFormat) {
      return null;
    }
    return (
      <div aria-label={i18nAriaLabels?.player} className="media-container">
        <audio controls={false} ref={this.audio} src={src} />
        <div className="media-controls">
          <SongDetails coverArt={coverArt} expandFunc={expandFunc} songName={this.state.songName} />
          <div className="media-controls-center">
            <MediaControls audio={audio} i18nAriaLabels={i18nAriaLabels} togglePlay={this.togglePlay} />
            <TrackProgress
              audio={audio}
              defaultCurrentTime={defaultCurrentTime}
              defaultDuration={defaultDuration}
              i18nAriaLabels={i18nAriaLabels}
              timeFormat={timeFormat}
            />
          </div>
          <VolumeControls
            audio={audio}
            i18nAriaLabels={i18nAriaLabels}
            onClickedVolumeButton={this.handleClickVolumeButton}
            onMuteChange={this.handleMuteChange}
          />
        </div>
      </div>
    );
  }
}

export default MediaControlsBar;
