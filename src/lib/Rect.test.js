import Rect from "./Rect";

describe("the rect", () => {
  it("exists", () => {
    const r = new Rect(0, 0, 50, 50);
    expect(r).toBeDefined();
    expect(r.angles).toBeDefined()
  });

  it("calculates angles from center point of a square", () => {
    const r = new Rect(0, 0, 50, 50);
    expect(r.angles).toBeDefined();
    const { bl, br, tl, tr } = r.angles;
    expect(bl).toEqual(315);
    expect(br).toEqual(225);
    expect(tl).toEqual(45);
    expect(tr).toEqual(135);
  });

  it("calculates angles from center point of a rectangle", () => {
    const r = new Rect(0, 0, 30, 60);
    expect(r.angles).toBeDefined();
    const { bl, br, tl, tr } = r.angles;
    expect(bl).toEqual(296.565051177078);
    expect(br).toEqual(243.43494882292202);
    expect(tl).toEqual(63.43494882292201);
    expect(tr).toEqual(116.56505117707799);
  });
});
