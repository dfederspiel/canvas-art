import { EasingFn } from "../../../lib/easing";
import { calculate, rand } from "../../../lib/helpers";
import { Animatable } from "../../../lib/types";
import Rect from "../../../lib/Rect";
import Size from "../../../lib/Size";
import HSL from '../../../lib/HSL';

export default class Phosphorous extends Rect implements Animatable {

  size: Size;
  color: HSL;
  secondaryColor: HSL;
  isDead: boolean;
  animationDirection: number = 1;
  animationFrame: number = 0;
  frames: number = rand(5, 15);
  radius: number;

  ageLimit: number = rand(15, 120);

  vx: number;
  vy: number;

  age: number = 0;

  private easing?: EasingFn

  constructor(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: Size,
    color: HSL,
    secondaryColor: HSL,
    easing?: EasingFn,
  ) {
    super(x, y, size.min.w, size.min.h)
    this.size = size;
    this.color = color;
    this.secondaryColor = secondaryColor;

    this.easing = easing;

    this.vx = (x - cx) / rand(3, 8)
    this.vy = (y - cy) / rand(3, 8)
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

  updateAnimation(): void {
    const currentFrame = this.getAnimationFrame();
    this.w = this.easing(
      currentFrame,
      this.size.min.w,
      this.size.max.w,
      this.frames
    );

    this.h = this.easing(
      currentFrame,
      this.size.min.h,
      this.size.max.h,
      this.frames
    );
  }

  update() {
    if (this.ageLimit - this.age > 0) {
      this.x += this.vx;
      this.y += this.vy;

      this.vx += -this.vx / 40;
      this.vy += -this.vy / 40;

      this.vy += 0.035;
      this.updateAnimation();
    } else {
      this.isDead = true;
    }

    this.age++;
  }
}