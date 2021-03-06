export default class RGB {
  private redChannel: number;
  private greenChannel: number;
  private blueChannel: number;

  private _alpha: number;

  // private alpha: number

  constructor(red: number, green: number, blue: number, alpha: number) {
    this.redChannel = red;
    this.greenChannel = green;
    this.blueChannel = blue;

    this.alpha = alpha;
  }

  get alpha() {
    return this._alpha;
  }

  set alpha(value: number) {
    if (value > 1) this._alpha = 1
    else if (value < 0) this._alpha = 0;
    else this._alpha = value;
  }

  darken(value: number) {
    this.redChannel -= value;
    this.redChannel = this.redChannel < 0 ? 0 : this.redChannel
    this.greenChannel -= value;
    this.greenChannel = this.greenChannel < 0 ? 0 : this.greenChannel
    this.blueChannel -= value;
    this.blueChannel = this.blueChannel < 0 ? 0 : this.blueChannel
  }

  lighten(value: number) {
    this.redChannel += value;
    this.redChannel = this.redChannel > 255 ? 255 : this.redChannel
    this.greenChannel += value;
    this.greenChannel = this.greenChannel > 255 ? 255 : this.greenChannel
    this.blueChannel += value;
    this.blueChannel = this.blueChannel > 255 ? 255 : this.blueChannel
  }

  toString() {
    return `rgba(${this.redChannel},${this.greenChannel},${this.blueChannel},${this.alpha})`
  }
}