import { EasingFn } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
import { Animatable } from "../../../lib/types";
import Rect from "../../../lib/Rect";
import RGB from "../../../lib/RGB";
import Size from "../../../lib/Size";

export default class Phosphorous extends Rect implements Animatable {

  size: Size;
  color: RGB;
  secondaryColor: RGB;
  isDead: boolean;
  animationDirection: number = 1;
  animationFrame: number = 0;
  frames: number = rand(5, 15);

  ageLimit: number = rand(15, 300)

  private vx: number;
  private vy: number;

  private age: number = 0;

  private easing?: EasingFn

  constructor(
    x: number,
    y: number,
    cx: number,
    cy: number,
    size: Size,
    color: RGB,
    secondaryColor: RGB,
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
      this.y += this.vy

      this.vx += -this.vx / 50
      this.vy += -this.vy / 50

      this.vy += .035
      this.updateAnimation()

    } else {
      this.isDead = true;
    }

    if (this.age > this.ageLimit / rand(1, 2)) this.color = this.secondaryColor
    this.age++
  }
}