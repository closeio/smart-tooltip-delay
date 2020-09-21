export default class SmartTooltipDelay {
  resetSmartDelayTimeout;
  currentDelayTime;
  initialDelayTime;
  noDelayTime;
  resetAfterTime;

  constructor(options = {}) {
    this.initialDelayTime = options.delay || 600;
    this.noDelayTime = options.noDelay || 0;
    this.resetAfterTime = options.resetAfterTime || 2500;
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
