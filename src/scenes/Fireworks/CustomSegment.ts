import Segment from "./Segment";
import Phosphorous from "./Phosphorous/Phosphorous";

export default class CustomSegment extends Segment {
  constructor(customPoints: Phosphorous[]) {
    super(0, 0, 0, 0, 0, 0, () => {});

    this.lPoints = customPoints;
  }
}