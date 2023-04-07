import { EasingFn } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
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

  ageLimit: number = rand(15, 120);

  private vx: number;
  private vy: number;

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

      this.vx += -this.vx / 50;
      this.vy += -this.vy / 50;

      this.vy += 0.035;
      this.updateAnimation();
    } else {
      this.isDead = true;
    }

    // Fade out the alpha values of c1 and c2 when the age is within 5% of the ageLimit
    // if (this.age >= this.ageLimit * 0.95) {
    //   const fadeOutProgress = (this.age - this.ageLimit * 0.95) / (this.ageLimit * 0.05);
    //   this.color.a = 1 - fadeOutProgress;
    //   this.secondaryColor.a = 1 - fadeOutProgress;
    // }

    this.age++;
  }
}