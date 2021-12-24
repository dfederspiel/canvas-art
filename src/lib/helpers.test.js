import { calculate, collision, rand } from "./helpers"

describe('the helpers', () => {
  it('can detect when two rects overlap', () => {
    expect(calculate.hit({
      x: 0, y: 0, w: 10, h: 10
    }, {
      x: 0, y: 0, w: 10, h: 10
    })).toBeTruthy()
  })

  it('can detect when two rects do not overlap', () => {
    expect(calculate.hit({
      x: 0, y: 0, w: 10, h: 10
    }, {
      x: 10.000000001, y: 11, w: 10, h: 10
    })).toBeFalsy()
  })

  it('can plot a vertex from x, y, angle, and distance', () => {
    expect(calculate.getVertexFromAngle(100, 100, 45, 10)).toEqual({
      x: 105.2532198881773,
      y: 108.50903524534118,
    })
  })

  it('can find the angle between two center points of a rect', () => {
    expect(calculate.angle({
      x: 0, y: 0, w: 10, h: 10
    }, {
      x: 11, y: 11, w: 10, h: 10
    })).toEqual(45)
  })

  it('can find the angle between two center points of a rect', () => {
    expect(calculate.angle({
      x: 11, y: 11, w: 10, h: 10
    }, {
      x: 0, y: 0, w: 10, h: 10
    })).toEqual(225)
  })

  it('can get random numbers from min to max', () => {
    expect(rand(5, 10)).toBeGreaterThanOrEqual(5)
    expect(rand(5, 10)).toBeLessThanOrEqual(10)
  })

  it('can detect angle of attack between two rects', () => {
    expect(collision.collides({
      x: 0, y: 0, w: 10, h: 10
    }, {
      x: 0, y: 1, w: 10, h: 10
    })).toEqual(90)
  })

  it('will return null if no collision is detected', () => {
    expect(collision.collides({
      x: 0, y: 0, w: 10, h: 10
    }, {
      x: 200, y: 20, w: 10, h: 10
    })).toEqual(null)
  })
})