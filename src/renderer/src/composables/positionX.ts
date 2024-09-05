export const usePositionX = () => {
  function getPositionX(event: TouchEvent | MouseEvent) {
    if (event instanceof MouseEvent) {
      return event.clientX;
    }
    else {
      return event.touches[0].clientX;
    }
  }
  return { getPositionX };
};
