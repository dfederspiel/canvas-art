import { Scene } from "./types";

export default class BaseScene {
  width: number;
  height: number;
  private context: CanvasRenderingContext2D;


  constructor(width: number, height: number, context: CanvasRenderingContext2D) {
    this.width = width;
    this.height = height;
    this.context = context;
  }
}