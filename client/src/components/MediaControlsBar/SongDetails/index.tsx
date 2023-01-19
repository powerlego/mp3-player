import React from "react";
import { CoverArt } from "../../../types";
import { BsChevronUp } from "react-icons/bs";
import "./SongDetails.css";

interface SongDetailsProps {
  songName: string;
  artistName: string;
  coverArt: CoverArt;
}

class SongDetails extends React.Component<SongDetailsProps> {
  static defaultProps = {
    songName: "Song Name",
    artistName: "Artist Name",
    coverArt: {
      src: "https://via.placeholder.com/150",
    },
  };

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

  render() {
    const { songName, artistName, coverArt } = this.props;
    const artists = artistName.split(",");
    const renderedArtists = this.renderArtists(artists);
    return (
      <div className="media-controls-song-details">
        <div className="media-controls-song-details-cover-art group/parent">
          <div className="media-controls-song-details-expand group/tooltip group-hover/parent:scale-100">
            <span className="media-controls-song-details-expand-tooltip group-hover/tooltip:opacity-100"> Expand </span>
            <div className="media-controls-song-details-expand-button">
              <BsChevronUp className="media-controls-song-details-expand-button-icon" />
            </div>
          </div>
          <img
            alt="Cover Art"
            className="media-controls-song-details-cover-art-image"
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            src={!coverArt.data ? coverArt.src : `data:${coverArt.format!};base64,${coverArt.data}`}
          />
        </div>
        <div className="media-controls-song-details-text-container">
          <span className="media-controls-song-details-name">{songName}</span>
          <div className="media-controls-song-details-artist">{renderedArtists}</div>
        </div>
      </div>
    );
  }
}

export default SongDetails;
