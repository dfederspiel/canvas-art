import { rand } from './helpers'

export default class Drop {
    constructor(x, y, w, h, frames, colorString, easeFn) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hit = false;
        this.colorString = colorString || `rgb(${rand(0, 25)}, ${rand(0, 25)}, ${rand(0, 255)})`;
        this.speedx = rand(1, 3)
        this.speedy = rand(1, 3)
        this.xdir = Math.round(Math.random()) == 0 ? -1 : 1;
        this.ydir = Math.round(Math.random()) == 0 ? -1 : 1;
        this.animationFrame = Math.floor(rand(0, frames));
        this.frames = frames;
        this.easeFn = easeFn;
        this.animationDirection = 1;
    }

    getAnimationFrame() {
        if(this.animationDirection === 1) {
            this.animationFrame ++;
            if(this.animationFrame >= this.frames) this.animationDirection = 0
        } else {
            this.animationFrame --;
            if(this.animationFrame <= 0) this.animationDirection = 1
        }
        return this.animationFrame;
    }

    update() {

        this.x += (this.speedx * (this.xdir < 0 ? -1 : 1));
        this.y += (this.speedy * (this.ydir < 0 ? -1 : 1));

        const currentFrame = this.getAnimationFrame();
        // this.w = this.h = this.easeFn(currentFrame, 10, 25, this.frames);
    }
}