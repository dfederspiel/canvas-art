export function rand(min, max) {
  return Math.random() * (max - min) + min;
}
/**
 *
 */
export const calculate = {
  angle: (r1, r2) => {
    var dx = r2.x + r2.w / 2 - (r1.x + r1.w / 2);
    var dy = r2.y + r2.h / 2 - (r1.y + r1.h / 2);

    /// for simplicity convert radians to degrees
    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  },
  hit: (r1, r2) => {
    return !(
      r1.x + r1.w < r2.x ||
      r2.x + r2.w < r1.x ||
      r1.y + r1.h < r2.y ||
      r2.y + r2.h < r1.y
    );
  },
  getVertexFromAngle: (x, y, angle, distance) => {
    return {
      x: x + Math.cos(angle) * distance,
      y: y + Math.sin(angle) * distance,
    };
  },
};

export const collision = {
  collides: (r1, r2) => {
    var hit = calculate.hit(r1, r2);
    if (hit) {
      return calculate.angle(r1, r2);
    } else return null;
  },
};
