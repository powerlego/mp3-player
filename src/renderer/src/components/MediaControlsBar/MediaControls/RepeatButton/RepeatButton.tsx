import React, { useState } from "react";
import { ReactComponent as LoopIcon } from "@/assets/icons/loop.svg";
import { ReactComponent as LoopOnceIcon } from "@/assets/icons/loop_once.svg";

interface RepeatButtonProps {
  audio?: HTMLAudioElement | null;
}

export default function RepeatButton({ audio }: RepeatButtonProps): JSX.Element {
  const [repeat, setRepeat] = useState(0);
  const [loopOnce, setLoopOnce] = useState(false);
  const isAudioAvailable = React.useMemo(() => audio && audio.src !== "", [audio]);
  const handleRepeat = () => {
    if (!audio) {
      return;
    }
    if (!isAudioAvailable) {
      return;
    }
    if (repeat === 0) {
      setLoopOnce(false);
      audio.loop = true;
      setRepeat(1);
    }
    else if (repeat === 1) {
      audio.loop = false;
      setLoopOnce(true);
      setRepeat(2);
    }
    else if (repeat === 2) {
      setLoopOnce(false);
      audio.loop = false;
      setRepeat(0);
    }
  };

  React.useEffect(() => {
    if (audio) {
      audio.addEventListener("ended", () => {
        if (loopOnce) {
          audio.currentTime = 0;
          audio
            .play()
            .then(null)
            .catch((err) => {
              console.log(err);
            });
          setLoopOnce(false);
        }
      });
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", () => {
          if (loopOnce) {
            audio.load();
            audio
              .play()
              .then(null)
              .catch((err) => {
                console.log(err);
              });
            setLoopOnce(false);
          }
        });
      }
    };
  }, [audio, loopOnce]);

  return isAudioAvailable
    ? (
      <div className="h-8 aspect-square flex justify-center items-center" onClick={() => handleRepeat()}>
        {repeat === 1
          ? (
            <LoopIcon
              className="m-0 w-4 h-4 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
              id="repeat-all"
            />
          )
          : repeat === 2
            ? (
              <LoopOnceIcon
                className="m-0 w-4 h-4 transition-all duration-300 ease-in-out fill-green-700 hover:fill-green-800 dark:fill-green-600 hover:dark:fill-green-700"
                id="repeat-one"
              />
            )
            : (
              <LoopIcon
                className="m-0 w-4 h-4 transition-all duration-300 ease-in-out non-scale-stroke fill-gray-750 hover:fill-gray-600 dark:fill-gray-300 hover:dark:fill-gray-150"
                id="repeat-none"
              />
            )}
      </div>
    )
    : (
      <div className="h-8 aspect-square flex justify-center items-center">
        <LoopIcon className="m-0 w-4 h-4 fill-gray-350 dark:fill-gray-750" id="repeat-none" />
      </div>
    );
}
