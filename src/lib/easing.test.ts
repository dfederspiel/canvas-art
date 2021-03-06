import { effects } from "./easing"

const ITERATIONS = 250;
const START = 50;
const END = 200; // to +10

describe('the easing functions', () => {
  let results: Array<number> = [];

  afterEach(() => {
    expect(results.join()).toMatchSnapshot()
    results = []
  })

  effects.forEach((effect) => {
    it(`can ease from ${START} to ${START + END} using the ${effect.name} effect`, () => {
      for (let x = 0; x <= ITERATIONS; x++) {
        results.push(effect(x, START, END, ITERATIONS));
      }
    })
  })

  effects.forEach((effect) => {
    it(`can ease from ${-START} to ${-START + -END} using the ${effect.name} effect`, () => {
      for (let x = 0; x <= ITERATIONS; x++) {
        results.push(effect(x, -START, -END, ITERATIONS));
      }
    })
  })

  effects.forEach((effect) => {
    it(`can ease from ${START} to ${START + -END} using the ${effect.name} effect`, () => {
      for (let x = 0; x <= ITERATIONS; x++) {
        results.push(effect(x, START, -END, ITERATIONS));
      }
    })
  })

  effects.forEach((effect) => {
    it(`can ease from ${-START} to ${-START + END} using the ${effect.name} effect`, () => {
      for (let x = 0; x <= ITERATIONS; x++) {
        results.push(effect(x, -START, END, ITERATIONS));
      }
    })
  })
})