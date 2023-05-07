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
    if (queue.length <= 0) {
      return;
    }
    const song = queue.dequeue();
    if (song) {
      window.api.loadAudioFile(song.storageLocation, true).catch(console.error);
      if ((repeat === 1 || (repeat === 2 && repeatCount.current === 0)) && queue.currentIndex > queue.length - 1) {
        queue.currentIndex = 0;
      }
    }
  };

  const getPreviousSong = (): void => {
    if (queue.length <= 0) {
      return;
    }
    const song = queue.queue[queue.currentIndex - 1];
    queue.currentIndex--;
    if (song) {
      window.api.loadAudioFile(song.storageLocation, true).catch(console.error);
    }
  };

  useEffect(() => {
    const originalQueue = queue.originalQueue;
    const currentQueue = queue.queue;
    const currentTrack = queue.peek();
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
      queue.currentIndex = currentTrackIndex;
      queue.queue = originalQueue;
    }
  }, [shuffle, repeat, queue]);

  return [repeat, setRepeat, shuffle, setShuffle, repeatCount, getNextSong, getPreviousSong] as [
    number,
    React.Dispatch<React.SetStateAction<number>>,
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    React.MutableRefObject<number>,
    () => void,
    () => void
  ];
};

export default useQueue;
