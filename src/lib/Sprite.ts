import { rand } from "./helpers";
import Rect from "./Rect";
import Size from './Size';
import { ObjectType } from "./enums";
import { Angles, Boundable, Collidable, Animatable } from "./types";

export default class Sprite extends Rect implements Collidable, Boundable, Animatable {
  rect: Rect;
  frames: number;
  hit: boolean;
  colorString: string;
  speedX: number;
  speedY: number;
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
    size?: Size,
    hitEffectDuration?: number,
    type?: ObjectType,
    animationFrame?: number,
  ) {
    super(rect.x, rect.y, rect.w, rect.h);
    this.hit = false;
    this.colorString =
      colorString || `rgb(${rand(0, 25)}, ${rand(0, 25)}, ${rand(0, 255)})`;
    this.speedX = vx;
    this.speedY = vy;
    this.animationFrame = animationFrame !== undefined ? animationFrame : rand(0, frames);
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

  collidesWith(other: Rect): boolean {
    return (
      this.x < other.x + other.w &&
      this.x + this.w > other.x &&
      this.y < other.y + other.h &&
      this.y + this.h > other.y
    );
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
    if (this.x >= this.containerRect.w - this.w && this.speedX > 0) {
      this.speedX = -this.speedX;
    }

    if (this.x <= this.containerRect.x && this.speedX < 0) {
      this.speedX = -this.speedX;
    }

    if (this.y >= this.containerRect.h - this.h && this.speedY > 0) {
      this.speedY = -this.speedY;
    }

    if (this.y <= this.containerRect.y && this.speedY < 0) {
      this.speedY = -this.speedY;
    }
  }

  updateAnimation() {
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
  }

  update() {
    this.updateAnimation()
    this.x += this.speedX;
    this.y += this.speedY;
  }
}
