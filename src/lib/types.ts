import Rect from "./Rect";

export interface Angles {
  tl: number;
  tr: number;
  bl: number;
  br: number;
}

export interface Distance {
  dx: number;
  dy: number;
}

export interface Collidable {
  hit: boolean;
  collidesWith(reference: Rect): boolean;
}

export interface Boundable {
  checkBoundaries(): void;
}

export interface Animatable {
  animationDirection: number;
  updateAnimation(): void;
}

export interface Randomizable {
  randomize(): void;
}

export interface Scene {
  width: number;
  height: number;
  render(): void;
}
