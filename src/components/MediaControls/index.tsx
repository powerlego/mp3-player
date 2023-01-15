import React, { ReactNode } from "react";
import { useState } from "react";
import { FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { BiShuffle } from "react-icons/bi";
import { TbRepeat, TbRepeatOnce } from "react-icons/tb";
import TrackProgress from "../TrackProgress";
import { AUDIO_PRELOAD_ATTRIBUTE, TIME_FORMAT } from "../../constants";
import "./MediaControls.css";

interface I18nAriaLabels {
  player?: string;
  progressControl?: string;
  volumeControl?: string;
  play?: string;
  pause?: string;
  rewind?: string;
  forward?: string;
  previous?: string;
  next?: string;
  loop?: string;
  loopOff?: string;
  volume?: string;
  volumeMute?: string;
}
interface MediaControlsBarProps {
  src?: string;

  /**
   * HTML5 Audio tag preload property
   */
  preload?: AUDIO_PRELOAD_ATTRIBUTE;
  i18nAriaLabels?: I18nAriaLabels;
  defaultCurrentTime?: ReactNode;
  defaultDuration?: ReactNode;
  timeFormat?: TIME_FORMAT;
  volume?: number;
}

class MediaControlsBar extends React.Component<MediaControlsBarProps> {
  audio = React.createRef<HTMLAudioElement>();
  togglePlay = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
    const audio = this.audio.current;
    if (!audio) return;
    if ((audio.paused || audio.ended) && audio.src) {
      this.playAudioPromise();
    } else if (!audio.paused) {
      audio.pause();
    }
  };

  playAudioPromise = (): void => {
    const audio = this.audio.current;
    if (!audio) return;
    const playPromise = audio.play();
    // playPromise is null in IE 11

    playPromise.then(null).catch((err) => {
      console.log(err);
    });
  };

  componentDidMount() {
    this.forceUpdate();
  }
  isPlaying = (): boolean => {
    const audio = this.audio.current;
    if (!audio) return false;

    return !audio.paused && !audio.ended;
  };

  render() {
    if (!this.audio.current) {
      return (
        <div>
          <p>Audio element not found</p>
        </div>
      );
    }
    return (
      <div>
        <footer className="media-controls">
          <div className="m-0 flex h-full w-56 bg-gray-200"></div>
          <div className="media-controls__center">
            <div className="media-controls__controls">
              <ShuffleButton />
              <SkipBackButton />
              <PlayButton
                togglePlay={this.togglePlay}
                audio={this.audio.current}
              />

              <SkipForwardButton />
              <RepeatButton />
            </div>
            <TrackProgress audio={this.audio.current} />
          </div>
          <div className="m-0 flex h-full w-56 bg-gray-200">
            <div className="media-controls__mute" />
            <div className="media-controls__volume"></div>
          </div>
        </footer>
      </div>
    );
  }
}
function ShuffleButton() {
  const [isShuffle, setIsShuffle] = useState(false);
  const handleShuffle = () => setIsShuffle(!isShuffle);
  return (
    <div onClick={() => handleShuffle()}>
      {isShuffle ? (
        <BiShuffle className="media-icon shuffle-button shuffling" />
      ) : (
        <BiShuffle className="media-icon shuffle-button" />
      )}
    </div>
  );
}

function SkipBackButton() {
  return (
    <div onClick={() => console.log("skipBack")}>
      <BsFillSkipStartFill className="media-icon skip-button" />
    </div>
  );
}

interface PlayButtonProps {
  audio?: HTMLAudioElement;
  togglePlay?: (e: React.SyntheticEvent) => void;
}

class PlayButton extends React.Component<PlayButtonProps> {
  isPlaying = (): boolean => {
    const { audio } = this.props;
    if (!audio) return false;

    return !audio.paused && !audio.ended;
  };
  isAudioAvailable = (): boolean => {
    const { audio } = this.props;
    if (!audio) return false;
    if (audio.src === "") return false;
    return true;
  };
  render() {
    const { togglePlay } = this.props;
    if (!this.isAudioAvailable()) {
      return (
        <div>
          <FaPauseCircle className="media-icon play-button" />
        </div>
      );
    } else {
      return (
        <div onClick={togglePlay}>
          {this.isPlaying() ? (
            <FaPauseCircle className="media-icon play-button has-media" />
          ) : (
            <FaPlayCircle className="media-icon play-button has-media" />
          )}
        </div>
      );
    }
  }
}

function SkipForwardButton() {
  return (
    <div onClick={() => console.log("skipForward")}>
      <BsFillSkipEndFill className="media-icon skip-button" />
    </div>
  );
}
function RepeatButton() {
  const [repeat, setRepeat] = useState(0);
  const handleRepeat = () => {
    if (repeat === 2) {
      setRepeat(0);
    } else {
      setRepeat(repeat + 1);
    }
  };
  return (
    <div onClick={() => handleRepeat()}>
      {repeat === 1 ? (
        <TbRepeat className="media-icon repeat-button repeating" />
      ) : repeat === 2 ? (
        <TbRepeatOnce className="media-icon repeat-button repeating" />
      ) : (
        <TbRepeat className="media-icon repeat-button" />
      )}
    </div>
  );
}

export default MediaControlsBar;
