import { Track } from "@/types";
import React from "react";

export class QueueObject {
  private _queue: Track[];

  constructor() {
    this._queue = [];
  }

  enqueue(item: Track) {
    this._queue.push(item);
  }

  dequeue() {
    return this._queue.shift();
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

  get first() {
    return this._queue[0];
  }

  get last() {
    return this._queue[this._queue.length - 1];
  }
}

export const Queue = React.createContext(new QueueObject());
