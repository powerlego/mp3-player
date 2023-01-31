import React from "react";
import { CoverArt, IterationType } from "../../../types";
import { BsChevronUp } from "react-icons/bs";
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
      <span
        className="text-sm text-gray-800 dark:text-gray-200 font-normal truncate cursor-default hover:underline"
        key={index}
      >
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
          <span className="text-sm text-gray-800 dark:text-gray-200 font-normal truncate cursor-default" key={index}>
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
      <div className="m-0 flex flex-row items-center h-full w-[30%] min-w-[11.25rem]">
        <div className={`relative h-4/5 aspect-square group/parent ${expanded ? "scale-0" : ""}`}>
          <div className="absolute right-0 top-0 scale-0 group/tooltip group-hover/parent:scale-100">
            <div
              className="absolute right-0 top-0 object-cover rounded-full bg-opacity-75 dark:bg-opacity-75 bg-gray-350 dark:bg-black
      w-5 h-5 m-0.5 flex items-center justify-center hover:h-6 hover:w-6"
              onClick={this.onExpandClick}
            >
              <BsChevronUp className="fill-gray-800 dark:fill-gray-200 h-[90%] w-[90%] m-0 opacity-100 stroke-gray-800 dark:stroke-gray-200 hover:stroke-1" />
            </div>
          </div>
          <img
            alt="Cover Art"
            className={`h-full w-full ${expanded ? "scale-0" : ""}`}
            src={
              !coverArt.data || !coverArt.format
                ? "https://via.placeholder.com/150"
                : coverArt.data === "" || coverArt.format === ""
                  ? "https://via.placeholder.com/150"
                  : `data:${coverArt.format};base64,${coverArt.data}`
            }
          />
        </div>
        <div
          className={`items-center grid gap-x-2 mx-4 ${expanded ? "-translate-x-20" : ""}`}
          style={{
            gridTemplate: "'title title' 'badges subtitle' / auto 1fr",
          }}
        >
          <SongName songName={songName} />
          <div
            className="w-full min-w-0"
            style={{
              gridArea: "subtitle",
              gridColumnStart: "badges",
            }}
          >
            <div className="overflow-hidden -mx-2">
              <div
                className="flex whitespace-nowrap w-fit"
                style={{
                  paddingInlineStart: "6px",
                  paddingInlineEnd: "12px",
                  transform: "translateX(var(--trans-x))",
                }}
              >
                {renderedArtists}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SongDetails;
