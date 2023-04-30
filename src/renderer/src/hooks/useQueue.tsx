import { Track } from "@/types";
import { Queue } from "@renderer/objects/QueueObject";
import { useEffect, useState, useContext } from "react";

const useQueue = () => {
  const queue = useContext(Queue);
  const [repeat, setRepeat] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);

  const setShuffle = (shuffle: boolean): void => {
    const originalQueue = queue.originalQueue;
    const currentQueue = queue.queue;
    const currentTrack = queue.currentTrack;
    if (!originalQueue || !currentQueue || !currentTrack) {
      return;
    }
    if (shuffle) {
      queue.originalQueue = [...currentQueue];

      const newQueue = [];
    }
  };
};
