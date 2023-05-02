import { Track } from "@/types";
import { Queue } from "@renderer/objects/QueueObject";
import { useEffect, useState, useContext, useRef } from "react";
import shuffleQueue from "@utils/shuffle";

const useQueue = () => {
  const queue = useContext(Queue);
  const [repeat, setRepeat] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const repeatCount = useRef(0);

  const getNextSong = (): void => {
    if (queue.length > 0) {
      if (repeat === 1 || (repeat === 2 && repeatCount.current === 0)) {
        const song = queue.dequeue();
        if (song) {
          window.api.loadAudioFile(song.storageLocation, true).catch((err) => {
            console.log(err);
          });
          queue.enqueue(song);
        }
      }
      else {
        const song = queue.dequeue();
        if (song) {
          window.api.loadAudioFile(song.storageLocation, true).catch((err) => {
            console.log(err);
          });
        }
      }
    }
  };

  useEffect(() => {
    const originalQueue = queue.originalQueue;
    const currentQueue = queue.queue;
    const currentTrack = queue.currentTrack;
    if (!originalQueue || !currentQueue || !currentTrack) {
      return;
    }
    if (originalQueue.length === 0 || currentQueue.length === 0) {
      return;
    }
    if (shuffle) {
      const newQueue = shuffleQueue(currentQueue);
      queue.queue = newQueue;
    }
    else {
      const currentTrackIndex = originalQueue.findIndex((track: Track) => track.id === currentTrack.id);
      const newQueue = originalQueue.slice(currentTrackIndex);
      if (repeat === 0) {
        newQueue.push(...originalQueue.slice(0, currentTrackIndex));
      }
      else if (repeat === 1 && repeatCount.current === 0) {
        newQueue.push(...originalQueue.slice(0, currentTrackIndex + 1));
      }
      queue.queue = newQueue;
    }
  }, [shuffle, repeat, queue]);

  return [repeat, setRepeat, shuffle, setShuffle, repeatCount, getNextSong] as [
    number,
    React.Dispatch<React.SetStateAction<number>>,
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    React.MutableRefObject<number>,
    () => void
  ];
};

export default useQueue;
