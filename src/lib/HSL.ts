export default class HSL {
    h: number;
    s: number;
    l: number;
    a: number;
  
    constructor(h: number, s: number, l: number, a: number = 1) {
      this.h = h;
      this.s = s;
      this.l = l;
      this.a = a;
    }

    static fromRGB(r: number, g: number, b: number, a: number = 1): HSL {
        r /= 255;
        g /= 255;
        b /= 255;
    
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h: number;
        let s: number;
        const l = (max + min) / 2;
    
        if (max === min) {
          h = s = 0;
        } else {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0);
              break;
            case g:
              h = (b - r) / d + 2;
              break;
            case b:
              h = (r - g) / d + 4;
              break;
          }
    
          h /= 6;
        }
    
        return new HSL(h * 360, s * 100, l * 100, a);
      }
  
    toString(): string {
      return `hsla(${this.h}, ${this.s}%, ${this.l}%, ${this.a})`;
    }
  
    lighten(amount: number): HSL {
      this.l = Math.min(100, this.l + amount);
      return this;
    }
  
    darken(amount: number): HSL {
      this.l = Math.max(0, this.l - amount);
      return this;
    }
  
    saturate(amount: number): HSL {
      this.s = Math.min(100, this.s + amount);
      return this;
    }
  
    desaturate(amount: number): HSL {
      this.s = Math.max(0, this.s - amount);
      return this;
    }
  
    setAlpha(alpha: number): HSL {
      this.a = alpha;
      return this;
    }
  
    clone(): HSL {
      return new HSL(this.h, this.s, this.l, this.a);
    }
  }
  