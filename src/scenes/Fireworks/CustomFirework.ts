import CustomSegment from './CustomSegment';
import Firework from "./Firework";
import Phosphorous from "./Phosphorous/Phosphorous";

export default class CustomFirework extends Firework {
  constructor(
    customPoints: Phosphorous[],
    context: CanvasRenderingContext2D
  ) {
    super(0, 0, context);
    this.segments = [new CustomSegment(customPoints)];
  }
}