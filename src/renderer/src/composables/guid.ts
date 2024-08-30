export const useGuid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x1_00_00)
      .toString(16)
      .slice(1);
  }

  const newGuid = () => {
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  };

  return { newGuid };
};
