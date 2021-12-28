import Collider from './Collider';
import Rect from './Rect';


describe('the collider', () => {

  let rect1 = { x: 0, y: 0, w: 10, h: 10 } as Rect;
  let rect2 = { x: 20, y: 20, w: 10, h: 10 } as Rect;

  it('can detect collisions between two rects', () => {
    const collider = new Collider(rect1, rect2);

    expect(collider.collision).toBeFalsy()
    rect2.x = 5;
    rect2.y = 5;
    expect(collider.collision).toBeTruthy()
  })
});