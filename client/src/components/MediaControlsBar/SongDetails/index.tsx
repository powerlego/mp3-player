import React, { ReactNode } from "react";
import { CoverArt } from "../../../types";

interface SongDetailsProps {
  songName: string;
  artistName: string;
  coverArt: CoverArt;
}

class SongDetails extends React.Component {
  render() {
    return (
      <div className="media-controls-song-details">
        <div className="media-controls-song-details-cover-art" />
        <div className="media-controls-song-details-name">
          <span className="media-controls-song-details-name-text">Song Name</span>
        </div>
        <div className="media-controls-song-details-artist">
          <span className="media-controls-song-details-artist-text">Artist Name</span>
        </div>
      </div>
    );
  }
}
