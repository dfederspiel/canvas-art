export default class Size {
  constructor(minW, maxW, minH, maxH) {
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
