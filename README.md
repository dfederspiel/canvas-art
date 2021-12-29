# Canvas Art

Deep dive into canvas rendering, collision detection, coordinate mapping, and all the various concepts within a game loop.

## Setup

clone this repo, then:

```
npm install
npm start
```

## Examples

This repo is hosted at [https://canvas.codefly.ninja](https://canvas.codefly.ninja/)

Each example is represented as a `Scene`, which can be cycled through using the numeric keys on your keyboard.

### Orbital Clock

Using radian calculations to caluclate a coordinate at an angle and distance. Shows hours, minutes, seconds, milliseconds, plotted at vertecies from a center point. (the sun)
![alt text](images/scene-clock.png)

### Sea Space

The first of scenes, showcasing basic boundary detection and rendering thousands
of particles to the screen simultaneaously
![alt text](images/scene-seaspace.png)

### Walls

Introuction of walls for testing collision detection between objects. Showcases boundary and hit detection
![alt text](images/scene-walls.png)

### Orbiter

First of the radian calculations, where circles are drawn around a central point
in 2d space.
![alt text](images/scene-orbiter.png)
