import { wrapPromise } from "@renderer/utils";
import React, { Suspense } from "react";

type SongCoverCardProps = {
  fileLocation: string;
};
function SongCoverCard({ fileLocation }: SongCoverCardProps) {
  return (
    <div>
      <h1>Test</h1>
    </div>
  );
}

type SongCoverProps = {
  fileLocation: string;
};

const SongCover = (props: SongCoverProps) => {
  const { fileLocation } = props;
  const resource = React.useMemo(() => wrapPromise(window.api.getAudioInfo(fileLocation)), [fileLocation]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SongCoverAsync fileLocation={fileLocation} resource={resource} />
    </Suspense>
  );
};

type SongCoverAsyncProps = {
  fileLocation: string;
  resource: { read: () => { title: string; artist: string; pictureFormat: string; pictureBase64: string } };
};

const SongCoverAsync = (props: SongCoverAsyncProps) => {
  const { fileLocation, resource } = props;

  const data = React.useMemo(() => resource.read(), [resource]);

  return (
    <button
      className="hover:scale-95 transition ease-in-out duration-300 self-center justify-self-center flex flex-col items-center justify-center"
      onClick={() => {
        window.api.loadAudioFile(fileLocation);
      }}
    >
      <img
        className="w-32 h-32 sm:w-40 sm:h-40 shadow-md shadow-gray-750 dark:shadow-gray-450/30"
        src={`data:${data.pictureFormat};base64,${data.pictureBase64}`}
      />
      <div className="flex flex-row justify-center items-center gap-2">
        <span className="text-sm text-gray-800 dark:text-white">{data.title}</span>
        <span className="text-xs text-gray-800 dark:text-white">{data.artist}</span>
      </div>
    </button>
  );
};

export default SongCover;
