global.window.HTMLMediaElement.prototype._mock = {
  duration: NaN,
};

Object.defineProperty(global.window.HTMLMediaElement.prototype, "duration", {
  get: function getDuration() {
    return this._mock.duration;
  },
  set: function setDuration(value) {
    this._mock.duration = value;
  },
});
