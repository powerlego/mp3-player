import { Track } from "@/types";
import React from "react";

export class QueueObject {
  private _originalQueue: Track[];
  private _queue: Track[];
  private _currentIndex: number;

  constructor() {
    this._originalQueue = [];
    this._queue = [];
    this._currentIndex = 0;
  }

  enqueue(track: Track | Track[]) {
    if (Array.isArray(track)) {
      this._queue = this._queue.concat(track);
    }
    else {
      this._queue.push(track);
    }
  }

  dequeue() {
    if (this._currentIndex >= this._queue.length) {
      return null;
    }
    const track = this._queue[this._currentIndex];
    this._currentIndex++;
    return track;
  }

  get currentIndex() {
    return this._currentIndex;
  }

  set currentIndex(index: number) {
    this._currentIndex = index;
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
    this._currentIndex = 0;
  }

  isEmpty() {
    return this._queue.length === 0;
  }

  peek() {
    if (this._queue.length === 0) {
      return null;
    }
    return this._queue[this._currentIndex];
  }

  nextN(count: number) {
    if (this._currentIndex + count > this._queue.length) {
      return this._queue.slice(this._currentIndex, this._queue.length);
    }
    return this._queue.slice(this._currentIndex, count + 1);
  }
}

export const Queue = React.createContext(new QueueObject());
