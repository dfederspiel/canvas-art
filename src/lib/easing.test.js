import { effects } from "./easing"

const ITERATIONS = 500;
const START = -10;
const END = 20; // to +10

describe('the easing functions', () => {
  let results = [];

  afterEach(() => {
    expect(results).toMatchSnapshot()
    results = []
  })

  effects.forEach((effect) => {
    it(`can ${effect.name}`, () => {
      for (let x = 0; x <= ITERATIONS; x++) {
        results.push(effect(x, -10, 20, ITERATIONS));
      }
    })
  })

  effects.forEach((effect) => {
    it(`can ${effect.name}`, () => {
      for (let x = 0; x <= ITERATIONS; x++) {
        results.push(effect(x, 10, -20, ITERATIONS));
      }
    })
  })
})