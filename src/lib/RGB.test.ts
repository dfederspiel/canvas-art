import RGB from "./RGB"

describe('the RGB object', () => {
  it('initializes', () => {
    const rgb = new RGB(1, 1, 1, .01)
    expect(rgb.toString()).toEqual('rgba(1,1,1,0.01)')
  })

  it('can darken a color', () => {
    const rgb = new RGB(50, 40, 20, .802)
    rgb.darken(10)
    expect(rgb.toString()).toEqual('rgba(40,30,10,0.802)')

    rgb.darken(40)
    expect(rgb.toString()).toEqual('rgba(0,0,0,0.802)')
  })

  it('can lighten a color', () => {
    const rgb = new RGB(110, 2, 200, .802)
    rgb.lighten(10)
    expect(rgb.toString()).toEqual('rgba(120,12,210,0.802)')

    rgb.lighten(60)
    expect(rgb.toString()).toEqual('rgba(180,72,255,0.802)')
  })
})