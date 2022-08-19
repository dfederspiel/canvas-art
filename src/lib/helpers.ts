import Rect from "./Rect";
import RGB from "./RGB";
import { Distance } from "./types";

export function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function colorRand(alpha?: number): RGB {
  return new RGB(rand(0, 255), rand(0, 255), rand(0, 255), alpha || 1);
}

export const calculate = {
  /**
   *
   * @param r1 rectangle to compare
   * @param r2 rectangle to compare
   * @returns {Distance} distance between rects, represented as dx, dy
   */
  distance: (r1: Rect, r2: Rect): Distance => {
    var dx = r2.x + r2.w / 2 - (r1.x + r1.w / 2);
    var dy = r2.y + r2.h / 2 - (r1.y + r1.h / 2);
    return { dx, dy };
  },
  /**
   *
   * @param r1 rectangle to compare
   * @param r2 rectangle to compare
   * @returns angle (in degrees) between rects, relative to center
   */
  angle: (r1: Rect, r2: Rect) => {
    // var dx = r2.x + r2.w / 2 - (r1.x + r1.w / 2);
    // var dy = r2.y + r2.h / 2 - (r1.y + r1.h / 2);
    const { dx, dy } = calculate.distance(r1, r2);

    /// for simplicity convert radians to degrees
    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  },
  /**
   *
   * @param {Rect} r1 rectangle to compare
   * @param r2 rectangle to compare
   * @returns boolean indicating intersection in rects
   */
  hit: (r1: Rect, r2: Rect) => {
    return !(
      r1.x + r1.w < r2.x ||
      r2.x + r2.w < r1.x ||
      r1.y + r1.h < r2.y ||
      r2.y + r2.h < r1.y
    );
  },
  /**
   *
   * @param x point of origin x
   * @param y point of origin y
   * @param angle angle in radians where the new point will be plotted
   * @param distance distance from center to plot new point
   * @returns new point of origin x,y
   */
  getVertexFromAngle: (
    x: number,
    y: number,
    angle: number,
    distance: number
  ) => {
    return {
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
    };
  },
};

export const collision = {
  collides: (r1: Rect, r2: Rect) => {
    var hit = calculate.hit(r1, r2);
    if (hit) {
      return calculate.angle(r1, r2);
    } else return null;
  },
};
