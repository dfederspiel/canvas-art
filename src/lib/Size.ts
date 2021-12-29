

export default class Size {
  min: {
    w: number;
    h: number;
  }

  max: {
    w: number;
    h: number;
  }

  constructor(minW: number, maxW: number, minH: number, maxH: number) {
    this.min = {
      w: minW,
      h: maxW,
    };
    this.max = {
      w: minH,
      h: maxH,
    };
  }
}
