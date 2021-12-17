import { rand } from './helpers'

export default class Drop {
    constructor(rect, frames, colorString, easeFn, vx, vy, duration) {
        this.x = rect.x;
        this.y = rect.y;
        this.w = rect.w;
        this.h = rect.h;
        this.rect = rect;
        this.hit = false;
        this.colorString = colorString || `rgb(${rand(0, 25)}, ${rand(0, 25)}, ${rand(0, 255)})`;
        this.speedx = vx
        this.speedy = vy
        this.xdir = 1 // Math.round(Math.random()) == 0 ? -1 : 1;
        this.ydir = 1 // Math.round(Math.random()) == 0 ? -1 : 1;
        this.animationFrame = Math.floor(rand(0, frames));
        this.frames = frames;
        this.easeFn = easeFn;
        this.animationDirection = 1;
        this.alpha = .5;
        this.hitTime = 0;
        this.hitEffectDuration = duration || 5000
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
        const currentFrame = this.getAnimationFrame();

        this.w = this.easeFn(currentFrame, this.rect.size.min.w, this.rect.size.max.w, this.frames);
        this.h = this.easeFn(currentFrame, this.rect.size.min.h, this.rect.size.max.h, this.frames);

        this.x += ((this.speedx) * (this.xdir < 0 ? -1 : 1));
        this.y += ((this.speedy) * (this.ydir < 0 ? -1 : 1));
    }
}