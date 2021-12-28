import { rand } from "./helpers";
import Rect from "./Rect";
import Size from './Size';
import { ObjectType } from "./enums";

export default class Drop extends Rect {
  rect: Rect;
  frames: number;
  hit: boolean;
  colorString: string;
  speedx: number;
  speedy: number;
  animationFrame: number;
  easeFn: Function;
  animationDirection: number;
  alpha: number;
  hitTime: number;
  hitEffectDuration: number;
  containerRect: Rect;
  size: Size;
  type: ObjectType;

  /**
   * @param {Rect} rect 
   * @param {number} frames 
   * @param {string} colorString 
   * @param {Function} easeFn 
   * @param {number} vx 
   * @param {number} vy 
   * @param {Rect} containerRect 
   * @param {Size} size
   * @param {ObjectType} type
   */
  constructor(
    rect: Rect,
    frames: number,
    colorString: string,
    easeFn: Function,
    vx: number,
    vy: number,
    containerRect: Rect,
    size: Size,
    hitEffectDuration: number,
    type: ObjectType
  ) {
    super(rect.x, rect.y, rect.w, rect.h);
    this.hit = false;
    this.colorString =
      colorString || `rgb(${rand(0, 25)}, ${rand(0, 25)}, ${rand(0, 255)})`;
    this.speedx = vx;
    this.speedy = vy;
    this.animationFrame = Math.floor(rand(0, frames));
    this.frames = frames;
    this.easeFn = easeFn;
    this.animationDirection = 1;
    this.alpha = 0.7;
    this.hitTime = 0;
    this.hitEffectDuration = hitEffectDuration || 5000;
    this.containerRect = containerRect;
    this.size = size;
    this.type = type
  }

  getAnimationFrame() {
    if (this.animationDirection === 1) {
      this.animationFrame++;
      if (this.animationFrame >= this.frames) this.animationDirection = 0;
    } else {
      this.animationFrame--;
      if (this.animationFrame <= 0) this.animationDirection = 1;
    }
    return this.animationFrame;
  }

  checkBoundaries() {
    if (!this.containerRect) return;
    if (this.x >= this.containerRect.w - this.w && this.speedx > 0) {
      this.speedx = -this.speedx;
    }

    if (this.x <= this.containerRect.x && this.speedx < 0) {
      this.speedx = -this.speedx;
    }

    if (this.y >= this.containerRect.h - this.h && this.speedy > 0) {
      this.speedy = -this.speedy;
    }

    if (this.y <= this.containerRect.y && this.speedy < 0) {
      this.speedy = -this.speedy;
    }
  }

  update() {
    const currentFrame = this.getAnimationFrame();

    this.w = this.easeFn(
      currentFrame,
      this.size.min.w,
      this.size.max.w,
      this.frames
    );

    this.h = this.easeFn(
      currentFrame,
      this.size.min.h,
      this.size.max.h,
      this.frames
    );

    this.x += this.speedx;
    this.y += this.speedy;
  }
}
