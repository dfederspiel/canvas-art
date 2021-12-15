import { rand } from './helpers'

export default class Drop {
    constructor(x, y, w, h, frames, colorString, ease) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.colorString = colorString || `rgb(${rand(0, 25)}, ${rand(0, 25)}, ${rand(0, 255)})`;
        this.speed = rand(0, 2.5)
        this.size = rand(1, 5)
        this.xdir = Math.round(Math.random());
        this.ydir = Math.round(Math.random());
        this.animationFrame = Math.floor(rand(0, frames));
        this.frames = frames;
        this.ease = ease;
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

        if(this.x > this.width && this.xdir == 1) {
            this.xdir = 0
        }

        if(this.x < 0 && this.xdir == 0) {
            this.xdir = 1
        }

        if(this.y > this.height && this.ydir == 1) {
            this.ydir = 0;
        }

        if(this.y < 0 && this.ydir == 0) {
            this.ydir = 1;
        }

        // console.log((this.speed * (this.xdir == 0 ? -1 : 1)))

        this.x += (this.speed * (this.xdir == 0 ? -1 : 1));
        this.y += (this.speed * (this.ydir == 0 ? -1 : 1));

        const currentFrame = this.getAnimationFrame();
        this.size = this.ease(currentFrame, 10, 25, this.frames);
        
    }
}