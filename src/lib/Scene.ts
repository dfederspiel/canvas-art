export default class Scene {
  width: number;
  height: number;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.onresize = () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    };
  }

  render() { }
}
