import wrapPromise from "@utils/wrapPromise";
import React, { Suspense } from "react";
import ImageCard, { ImageCardSkeleton } from "@renderer/components/ImageCard";
import { Play24Filled } from "@fluentui/react-icons";

type SongCoverProps = {
  fileLocation: string;
};

function SongCover(props: SongCoverProps) {
  const { fileLocation } = props;
  const resource = React.useMemo(() => wrapPromise(window.api.getAudioInfo(fileLocation)), [fileLocation]);
  return (
    <Suspense fallback={<ImageCardSkeleton />}>
      <SongCoverAsync fileLocation={fileLocation} resource={resource} />
    </Suspense>
  );
}

function SongCoverButton() {
  return (
    <span
      className="box-border relative flex rounded-full bg-green-550 items-center justify-center group-hover/button:scale-105"
      style={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        WebkitTapHighlightColor: "transparent",
        minBlockSize: "48px",
        inlineSize: "48px",
        blockSize: "48px",
      }}
    >
      <span className="flex absolute top-3 left-3 ">
        <Play24Filled className="fill-black" primaryFill="" />
      </span>
    </span>
  );
}

type SongCoverAsyncProps = {
  fileLocation: string;
  resource: { read: () => { title: string; artist: string; pictureFormat: string; pictureBase64: string } };
};
function SongCoverAsync(props: SongCoverAsyncProps) {
  const { fileLocation, resource } = props;

  const data = React.useMemo(() => resource.read(), [resource]);
  const artist = React.useMemo(() => {
    const artists = data.artist.split(",");
    if (artists.length > 1) {
      return artists.join(", ");
    }
    return artists[0];
  }, [data.artist]);
  return (
    <ImageCard
      icon={<SongCoverButton />}
      line1={data.title}
      line2={artist}
      loading="lazy"
      src={`data:image/${data.pictureFormat};base64,${data.pictureBase64}`}
      onClickButton={() => {
        window.api.loadAudioFile(fileLocation, true).catch((err) => {
          console.error(err);
        });
      }}
    />
  );
}

export default SongCover;
