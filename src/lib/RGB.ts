export default class RGB {
  redChannel: number;
  greenChannel: number;
  blueChannel: number;

  private _alpha: number;

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
    if (value > 1) this._alpha = 1;
    else if (value < 0) this._alpha = 0;
    else this._alpha = value;
  }

  darken(value: number) {
    return `rgba(${this.redChannel - value},${this.greenChannel - value},${
      this.blueChannel - value
    },${this.alpha})`;
  }

  lighten(value: number) {
    return `rgba(${this.redChannel + value},${this.greenChannel + value},${
      this.blueChannel + -value
    },${this.alpha})`;
  }

  toString() {
    return `rgba(${this.redChannel},${this.greenChannel},${this.blueChannel},${this.alpha})`;
  }
}
