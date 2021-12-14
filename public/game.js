// Create the canvas for the game to display in
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

let points = 0;
let count = 0;
let frameNumber = 0;

const SPEED = 4.7
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const FORWARD = 1;
const BACKWARD = 0

setInterval(() => { 
    count++;
}, 1000)

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

function easeLinear (t, b, c, d) {
    return c * t / d + b;
}

function easeInOutBack (t, b, c, d) {
    s = 1.70158;
    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
}

function easeInOutQuad (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

function easeInElastic (t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
    }
    else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
}

console.log(Date.now())
const d = Date.now() + 10000

class Drop {
    constructor(x, y, frames, colorString, ease) {
        this.x = x;
        this.y = y;
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

        if(this.x > WIDTH && this.xdir == 1) {
            this.xdir = 0
        }

        if(this.x < 0 && this.xdir == 0) {
            this.xdir = 1
        }

        if(this.y > HEIGHT && this.ydir == 1) {
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

let drops = [];
for(var x = 0; x < 5000; x++ ) {
    drops.push(
        new Drop(
            rand(0, WIDTH), 
            rand(0, HEIGHT),
            rand(60, 240),
            `rgb(${rand(0, 0)}, ${rand(0, 0)}, ${rand(0, 125)})`,
            easeLinear
        )
    )
}
for(var x = 0; x < 1000; x++ ) {
    drops.push(
        new Drop(
            rand(0, WIDTH), 
            rand(0, HEIGHT),
            rand(120, 480),
            `rgb(${rand(0, 0)}, ${rand(0, 0)}, ${rand(200, 255)})`,
            easeInElastic
        )
    )
}

for(var x = 0; x < 100; x++ ) {
    drops.push(
        new Drop(
            rand(0, WIDTH), 
            rand(0, HEIGHT),
            rand(30, 45),
            `rgb(${rand(100, 200)}, ${rand(0, 0)}, ${rand(0, 0)})`,
            easeInElastic
        )
    )
}

const displayText = () => {
    // Display score and time 
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "30px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Time: " + count, 20, 20);

    ctx.fillText("Frame: " + frameNumber, 20, 50);

    ctx.fillText("FPS: " + (frameNumber / count).toFixed(2), 20, 80)
}

// Draw everything on the canvas
var render = function () {
    frameNumber++;
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drops.forEach((drop, idx) => {
        ctx.fillStyle = drop.colorString;
        ctx.fillRect(drop.x - drop.size / 2, drop.y - drop.size / 2, drop.size, drop.size)
        drop.update();
    })

    //displayText();
  };

// The main game loop
var main = function () {
  // run the update function
  //update(0.02); // do not change
  // run the render function
  render();
  // Request to do this again ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

main();