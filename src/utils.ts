import React from "react";

export const getPosX = (
  event: TouchEvent | React.TouchEvent | MouseEvent | React.MouseEvent
): number => {
  if (event instanceof MouseEvent) {
    return event.clientX;
  } else if (event instanceof TouchEvent) {
    return event.touches[0].clientX;
  } else if (event.nativeEvent instanceof MouseEvent) {
    return event.nativeEvent.clientX;
  } else {
    return event.nativeEvent.touches[0].clientX;
  }
};
