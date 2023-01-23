import React from "react";
import { CoverArt, IterationType } from "../../../types";
import { BsChevronUp } from "react-icons/bs";
import "./SongDetails.css";
import SongName from "./SongName";

interface SongDetailsProps {
  songName: string;
  artistName: string;
  coverArt: CoverArt;
  expandFunc?: () => void;
  speed?: number;
  pauseAtEndEdgeDurationMs?: number;
  initialMouseIntDelayMs?: number;
  iterationType?: IterationType;
}

interface SongDetailsState {
  expanded: boolean;
}

class SongDetails extends React.Component<SongDetailsProps, SongDetailsState> {
  static defaultProps = {
    songName: "Song Name",
    artistName: "Artist Name",
    coverArt: { data: "", format: "" },
    speed: 0.2,
    pauseAtEndEdgeDurationMs: 1200,
    initialMouseIntDelayMs: 200,
    iterationType: "single",
  };

  state: SongDetailsState = {
    expanded: false,
  };

  artistNameContainer = React.createRef<HTMLDivElement>();
  artistNameOffset = React.createRef<HTMLDivElement>();

  renderArtist = (artist: string, index: number) => {
    return (
      <span className="artist-text artist" key={index}>
        {artist}
      </span>
    );
  };

  renderArtists = (artists: string[]) => {
    const artistsRendered = artists.map(this.renderArtist);

    const output: JSX.Element[] = [];

    artistsRendered.forEach((artist, index) => {
      output.push(artist);
      if (index < artistsRendered.length - 1) {
        output.push(
          <span className="artist-text" key={index}>
            ,{" "}
          </span>
        );
      }
    });

    return output;
  };

  onExpandClick = () => {
    const { expandFunc } = this.props;
    if (!expandFunc) {
      return;
    }
    expandFunc();
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { songName, artistName, coverArt } = this.props;
    const { expanded } = this.state;
    const artists = artistName.split(",");
    const renderedArtists = this.renderArtists(artists);
    return (
      <div className="song-details">
        <div className={`song-details-cover-art group/parent ${expanded ? "scale-0" : ""}`}>
          <div className="song-details-expand group/tooltip group-hover/parent:scale-100">
            <div className="song-details-expand-button" onClick={this.onExpandClick}>
              <BsChevronUp className="song-details-expand-button-icon" />
            </div>
          </div>
          <img
            alt="Cover Art"
            className={`song-details-cover-art-image ${expanded ? "scale-0" : ""}`}
            src={
              !coverArt.data || !coverArt.format
                ? "https://via.placeholder.com/150"
                : coverArt.data === "" || coverArt.format === ""
                  ? "https://via.placeholder.com/150"
                  : `data:${coverArt.format};base64,${coverArt.data}`
            }
          />
        </div>
        <div className={`song-details-text-container ${expanded ? "-translate-x-20" : ""}`}>
          <SongName songName={songName} />
          <div className="song-details-artist-align">
            <div className="song-details-artist-container">
              <div className="song-details-artist-offset">{renderedArtists}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SongDetails;
