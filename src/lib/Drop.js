import { rand } from "./helpers";
import Rect from "./Rect";
import Wall from "./Wall";

export default class Drop extends Rect {
  constructor(
    rect,
    frames,
    colorString,
    easeFn,
    vx,
    vy,
    duration,
    containerRect
  ) {
    super(rect.x, rect.y, rect.w, rect.h, rect.size);
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
    this.hitEffectDuration = duration || 5000;
    this.containerRect = containerRect;
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
