import ElectronStore from "electron-store";

const store = (() => {
  let instance: ElectronStore;

  function createInstance() {
    return new ElectronStore();
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export default store;
