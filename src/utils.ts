import React from "react";
import { TIME_FORMAT } from "./constants";

type ThrottleFunction<T> = (arg: T) => void;
export const getPosX = (event: TouchEvent | React.TouchEvent | MouseEvent | React.MouseEvent): number => {
    if (event instanceof MouseEvent) {
        return event.clientX;
    }
    else if (event instanceof TouchEvent) {
        return event.touches[0].clientX;
    }
    else if (event.nativeEvent instanceof MouseEvent) {
        return event.nativeEvent.clientX;
    }
    else {
        return event.nativeEvent.touches[0].clientX;
    }
};

const addHeadingZero = (num: number): string => {
    return num > 9 ? num.toString() : `0${num}`;
};

export const getDisplayTimeBySeconds = (seconds: number, totalSeconds: number, timeFormat: TIME_FORMAT): string => {
    if (!isFinite(seconds)) {
        return "";
    }

    const min = Math.floor(seconds / 60);
    const minStr = addHeadingZero(min);
    const secStr = addHeadingZero(Math.floor(seconds % 60));
    const minStrForHour = addHeadingZero(Math.floor(min % 60));
    const hourStr = Math.floor(min / 60);

    const mmSs = `${minStr}:${secStr}`;
    const hhMmSs = `${hourStr}:${minStrForHour}:${secStr}`;

    if (timeFormat === "auto") {
        if (totalSeconds >= 3600) {
            return hhMmSs;
        }
        else {
            return mmSs;
        }
    }
    else if (timeFormat === "mm:ss") {
        return mmSs;
    }
    else if (timeFormat === "hh:mm:ss") {
        return hhMmSs;
    }
    else {
        return mmSs;
    }
};

export function throttle<K>(func: ThrottleFunction<K>, limit: number): ThrottleFunction<K> {
    let inThrottle = false;
    return (arg) => {
        if (!inThrottle) {
            func(arg);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
