export default class SmartTooltipDelay {
  resetSmartDelayTimeout;
  currentDelayTime;
  initialDelayTime;
  noDelayTime;
  resetAfterTime;

  constructor(options = {}) {
    if (
      !Number.isInteger(options.delay) ||
      !Number.isInteger(options.resetAfterTime) ||
      !Number.isInteger(options.noDelay)
    ) {
      throw Error(); // delay, resetAfterTime, and noDelay need to be set
    }

    this.initialDelayTime = options.delay;
    this.noDelayTime = options.noDelay;
    this.resetAfterTime = options.resetAfterTime;
    this.currentDelayTime = this.initialDelayTime;
  }

  _disableDelay = () => (this.currentDelayTime = this.noDelayTime);

  _enableDelay = () => (this.currentDelayTime = this.initialDelayTime);

  getCurrentDelay = () => {
    return this.currentDelayTime;
  };

  show = () => {
    clearTimeout(this.resetSmartDelayTimeout);
    this._disableDelay();
  };

  hide = () => {
    clearTimeout(this.resetSmartDelayTimeout);
    this.resetSmartDelayTimeout = setTimeout(
      this._enableDelay,
      this.resetAfterTime,
    );
  };
}
