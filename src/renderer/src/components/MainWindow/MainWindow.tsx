import React from "react";
import SongCover from "./SongCoverCard";
import Shelf from "@renderer/components/Shelf";
import { Queue } from "@renderer/objects/QueueObject";
import shuffleQueue from "@utils/shuffle";

type MainWindowProps = {
  audio: React.RefObject<HTMLAudioElement>;
  className?: string;
};

function MainWindow({ className }: MainWindowProps) {
  const queue = React.useContext(Queue);
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
              <SongCover fileLocation="G:\\Music\\Asteroid 2467 - single version.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
              <SongCover fileLocation="G:\\Music\\0-59.mp3" />
            </Shelf>
            <button
              className="w-full h-8 dark:bg-white bg-black"
              onClick={() => console.log(shuffleQueue(queue.queue))}
            >
              Shuffle
            </button>
          </div>
        </div>
      </section>
      <div className="h-full w-full grid auto-rows-min grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-scroll mx-2 items-center justify-center" />
    </div>
  );
}

export default MainWindow;
