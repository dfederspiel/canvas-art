import { easeInOutSine, easeOutSine } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
import Size from "../../../lib/Size";
import HSL from '../../../lib/HSL';
import Phosphorous from './Phosphorous';

export default class Hue extends Phosphorous {

  private originalColor: HSL;

  constructor(c1: HSL, c2: HSL, x: number, y: number, cx: number, cy: number) {
    super(
      x,
      y,
      cx,
      cy,
      new Size(0.8, rand(1, 2), 0.8, rand(1, 2)),
      c1,
      c2,
      easeOutSine
    );
    this.ageLimit = rand(10, 300);
    this.frames = Math.floor(rand(1, 100));
    this.originalColor = c1.clone(); // Save the original start color
  }

  update(): void {
    super.update();

    // Calculate the progress of the hue transition
    const progress = this.age / this.ageLimit;

    // Calculate the hue difference between the start and end color
    const hueDifference = this.secondaryColor.h - this.originalColor.h;
  
    // Update the hue based on the progress
    this.color.h = this.originalColor.h + (hueDifference * progress);

    // Update the alpha values
    // let a = easeInOutSine(this.animationFrame / 2, 0.1, 1, this.frames);
    // this.color.a = a < 0 ? 0 : a;
    //this.secondaryColor.a = a < 0 ? 0 : a;
  }
}
