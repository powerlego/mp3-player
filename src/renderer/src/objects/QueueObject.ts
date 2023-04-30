import { Track } from "@/types";
import React from "react";

export class QueueObject {
  private _originalQueue: Track[];
  private _queue: Track[];
  private _currentTrack: Track | undefined;

  constructor() {
    this._originalQueue = [];
    this._queue = [];
    this._currentTrack = {} as Track;
  }

  enqueue(item: Track) {
    this._queue.push(item);
  }

  dequeue() {
    const track = this._queue.shift();
    this._currentTrack = track;
    return track;
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

  set originalQueue(queue: Track[]) {
    this._originalQueue = queue;
  }

  get originalQueue() {
    return this._originalQueue;
  }

  clear() {
    this._originalQueue = [];
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
