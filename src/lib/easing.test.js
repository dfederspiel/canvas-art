import { easeInBack, easeInCirc, easeInCubic } from "./easing"

describe('the easing functions', () => {
  it('can easeInBack', () => {
    expect(easeInBack(0, 10, 10, 1000)).toEqual(10);
    expect(easeInBack(250, 10, 10, 1000)).toEqual(9.358634375);
    expect(easeInBack(500, 10, 10, 1000)).toEqual(9.123025);
    expect(easeInBack(750, 10, 10, 1000)).toEqual(11.825903124999998);
    expect(easeInBack(1000, 10, 10, 1000)).toEqual(20);
  })

  it('can easeInCirc', () => {
    expect(easeInCirc(0, 10, 10, 1000)).toEqual(10);
    expect(easeInCirc(250, 10, 10, 1000)).toEqual(10.317541634481458);
    expect(easeInCirc(500, 10, 10, 1000)).toEqual(11.339745962155614);
    expect(easeInCirc(750, 10, 10, 1000)).toEqual(13.385621722338524);
    expect(easeInCirc(1000, 10, 10, 1000)).toEqual(20);
  })

  it('can easeInCubic', () => {
    expect(easeInCubic(0, 10, 10, 1000)).toEqual(10);
    expect(easeInCubic(250, 10, 10, 1000)).toEqual(10.15625);
    expect(easeInCubic(500, 10, 10, 1000)).toEqual(11.25);
    expect(easeInCubic(750, 10, 10, 1000)).toEqual(14.21875);
    expect(easeInCubic(1000, 10, 10, 1000)).toEqual(20);
  })
})