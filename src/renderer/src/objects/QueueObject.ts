import { Track } from "@/types";
import React from "react";

export class QueueObject {
  private _shuffle: boolean;
  private _repeat: boolean;
  private _queue: Track[];
  private _originalQueue: Track[];
  private _currentTrack: Track | undefined;

  constructor() {
    this._shuffle = false;
    this._repeat = false;
    this._queue = [];
    this._originalQueue = [];
    this._currentTrack = {} as Track;
  }

  enqueue(item: Track) {
    this._queue.push(item);
  }

  dequeue() {
    const trck = this._queue.shift();
    this._currentTrack = trck;
    return trck;
  }

  get currentTrack() {
    return this._currentTrack;
  }

  get length() {
    return this._queue.length;
  }

  get queue() {
    return this._queue;
  }

  set queue(queue: Track[]) {
    this._queue = queue;
  }

  clear() {
    this._queue = [];
  }

  get isEmpty() {
    return this._queue.length === 0;
  }

  get peek() {
    return this._queue[0];
  }

  nextN(count: number) {
    return this._queue.slice(1, count + 1);
  }
}

export const Queue = React.createContext(new QueueObject());
