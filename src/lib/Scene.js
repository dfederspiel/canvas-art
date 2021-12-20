export default class Scene {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    window.onresize = () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;

      document.body.appendChild(this.scene.canvas);
    };
  }

  render() {}
}
