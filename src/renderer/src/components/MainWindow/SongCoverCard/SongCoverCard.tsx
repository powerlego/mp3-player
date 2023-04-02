import wrapPromise from "@utils/wrapPromise";
import React, { Suspense } from "react";
import ImageCard, { ImageCardSkeleton } from "@renderer/components/ImageCard";

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
      className="box-border relative flex rounded-full bg-green-450 dark:bg-green-350 items-center justify-center group-hover/button:scale-105"
      style={{
        // eslint-disable-next-line @typescript-eslint/naming-convention
        WebkitTapHighlightColor: "transparent",
        minBlockSize: "48px",
        inlineSize: "48px",
        blockSize: "48px",
      }}
    >
      <span className="flex absolute top-3 left-3 ">
        <svg className="fill-black " height="24" role="img" viewBox="0 0 24 24" width="24">
          <path
            className="non-scaling-stroke"
            d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"
          />
        </svg>
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

  return (
    <ImageCard
      icon={<SongCoverButton />}
      line1={data.title}
      line2={data.artist}
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
