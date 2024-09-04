// Import the ElectronStore class from the "electron-store" package. ElectronStore is a simple data persistence library 
// used in Electron.js applications to store and retrieve data locally on the user's system.
import ElectronStore from "electron-store";

// Create a singleton object `store` that encapsulates an instance of `ElectronStore`.
// This singleton pattern is used to ensure that only one instance of ElectronStore is created throughout the application.
const store = (() => {
  // Store the instance of ElectronStore locally within the scope of the store object.
  let instance: ElectronStore;

  // A function to create a new instance of ElectronStore, if one doesn't already exist.
  function createInstance() {
    return new ElectronStore();
  }

  // Public API of the store object.
  return {
    // getInstance is a function that returns the singleton instance of ElectronStore.
    // If the instance does not exist, it creates a new instance before returning it.
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// Export the `store` object as the default export of this module. Other parts of the application can import
// and use this object to interact with the ElectronStore instance.
export default store;
