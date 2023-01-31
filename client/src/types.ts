export interface I18nAriaLabels {
  player?: string;
  progressControl?: string;
  volumeControl?: string;
  play?: string;
  pause?: string;
  previous?: string;
  rewind?: string;
  shuffle?: string;
  shuffleOn?: string;
  next?: string;
  loop?: string;
  loopOnce?: string;
  loopOff?: string;
  volume?: string;
  volumeMute?: string;
}

export interface MetaDataPayload {
  status: boolean;
  message: string;
  data: {
    name: string;
    cover: CoverArt;
  };
}

export interface CoverArt {
  data?: string;
  format?: string;
}

export enum IterationType {
  single = "single",
  infinite = "infinite",
}

export interface ScrollingAnimationProps {
  speed: number;
  pauseAtEndEdgeDurationMs: number;
  initialMouseIntDelayMs: number;
  iterationType: IterationType;
}
