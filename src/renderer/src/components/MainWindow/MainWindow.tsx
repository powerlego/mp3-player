import React from "react";
import SongCover from "./SongCoverCard";
import placholderImg from "@/assets/icons/placeholder.png";
import Shelf from "@renderer/components/Shelf";

type MainWindowProps = {
  audio: React.RefObject<HTMLAudioElement>;
  className?: string;
};

function MainWindow({ className }: MainWindowProps) {
  const arr: string[] = [];
  for (let i = 0; i < 100; i++) {
    arr.push(
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum asperiores harum minima nemo sunt deserunt, error sint recusandae modi, repellendus impedit officiis eius necessitatibus atque sed esse rem assumenda illum!"
    );
  }

  return (
    <div className={className}>
      <div className="h-16 sticky top-0" />
      <section>
        <div className="flex flex-col pt-6 isolate">
          <div
            className="flex flex-row gap-6 px-4"
            style={{
              flexFlow: "row wrap",
            }}
          >
            <Shelf title="Recently Played">
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
            </Shelf>
          </div>
        </div>
      </section>
      <div className="h-full w-full grid auto-rows-min grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-scroll mx-2 items-center justify-center"></div>
    </div>
  );
}

export default MainWindow;
