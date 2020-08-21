// ---------------- DATA ----------------

// Get HTML canvas
let canvas = document.getElementById('app-canvas');
let ctx = canvas.getContext('2d');

// Canvas animation data
let frame = 0n;
let last = 0;
let fps = 0;
let elapsed = 0;

let drawableObjects = [];
let currentlyDrawn = undefined;

// Available shapes
let shapeLine = {
    create(point, color) {
        return new Line(point, point, color);
    }
}

let shapeCircle = {
    create(point, color) {
        return new Circle(point, 0, color);
    }
}

let shapeRectangle = {
    create(point, color) {
        return new Rectangle(point, 0, 0, color);
    }
}

let shapes = [shapeLine, shapeCircle, shapeRectangle];

let shapeSelector = {
    shapes: shapes,
    selected: shapeLine,
    select(shape) {

    },
    nextShape() {
        let index = shapes.indexOf(this.selected);
        let nextIndex = (index + 1 == shapes.length ? 0 : index + 1);
        this.selected = this.shapes[nextIndex];
    }
}


// ---------------- CLASSES ------------------

class Line {

    constructor(pointA, pointB, color) {
        console.log(`Creating line: [${pointA.x}, ${pointA.y}] [${color}]`);
        this.pointA = pointA;
        this.pointB = pointB;
        this.color = color;
    }

    draw(ctx) {
        this._draw(ctx, this.pointA, this.pointB, this.color);
    }

    update(newX, newY) {
        this.pointB = {x: newX, y: newY};
    }

    _draw(ctx, pointA, pointB, color) {
        if (color) {
            ctx.strokeStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(pointA.x, pointA.y);
        ctx.lineTo(pointB.x, pointB.y);
        ctx.stroke();
    }
}


class Circle {
 
    constructor(centerPoint, r, color) {
        console.log(`Creating circle: [${centerPoint.x}, ${centerPoint.y}] [${r}] [${color}]`);
        this.center = centerPoint;
        this.radius = r;
        this.color = color;
    }

    draw(ctx) {
        this._draw(ctx, this.center, this.radius, this.color);
    }

    // Add update method with mouse coordinates
    update(newX, newY) {
        this.radius = Math.sqrt(Math.pow(this.center.x - newX, 2) + Math.pow(this.center.y - newY, 2));
    }

    _draw(ctx, centerPoint, r, color, fill = true) {
        if (fill) {
            ctx.fillStyle = color;
        } else {
            ctx.strokeStyle = color;
        }

        ctx.beginPath();
        ctx.arc(centerPoint.x, centerPoint.y, r, 0, 2 * Math.PI);

        if (fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }
}


class Rectangle {

    constructor(anchorPoint, width, height, color) {
        console.log(`Creating rectangle: [${anchorPoint.x}, ${anchorPoint.y}] [${width}x${height}] [${color}]`);
        this.anchorPoint = anchorPoint;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(ctx) {
        this._draw(ctx, this.anchorPoint, this.width, this.height, this.color);
    }

    // Add update method with mouse coordinates
    update(newX, newY) {
        this.width = newX - this.anchorPoint.x;
        this.height = newY - this.anchorPoint.y;
    }

    _draw(ctx, anchorPoint, width, height, color, fill = true) {
        if (fill) {
            ctx.fillStyle = color;
        } else {
            ctx.strokeStyle = color;
        }

        if (fill) {
            ctx.fillRect(anchorPoint.x, anchorPoint.y, width, height);
        } else {
            ctx.strokeRect(anchorPoint.x, anchorPoint.y, width, height);
        }
    }
}


class RandomPoint {

    constructor(ctx) {
        this.x = Math.floor(Math.random() * ctx.canvas.width);
        this.y = Math.floor(Math.random() * ctx.canvas.height);
    }
}


class RandomLength {

    constructor(maxLength) {
        this.value = Math.floor(Math.random() * max);
    }
}


class RandomColor {

    constructor() {
        this.value = Math.floor(Math.random() * 0xFFFFFF);
        this.css = '#' + this.value.toString(16);
    }
}


class RandomShape {

    constructor() {
        let choice = Math.floor(Math.random() * shapeSelector.shapes.length);
        let newObject = undefined;

        switch (choice) {
            case 0: newObject = new Line(new RandomPoint(this.ctx), new RandomPoint(this.ctx), new RandomColor().css);
            break;
            case 1: newObject = new Circle(new RandomPoint(this.ctx), new RandomLength(300).value, new RandomColor().css);
            break;
            case 2: newObject = new Rectangle(new RandomPoint(this.ctx), new RandomLength(300).value, new RandomLength(300).value, new RandomColor().css);
            break;
        }

        return newObject;
    }
}


class Game {
    constructor(canvasID) {
        // Get HTML canvas
        this.canvas = document.getElementById(canvasID);
        this.ctx = this.canvas.getContext('2d');

        // Set canvas w x h
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;

        // Canvas animation data
        this.frame = 0n;
        this.last = 0;
        this.fps = 0;

        this.drawableObjects = [];
        this.currentlyDrawn = undefined;

        // Bind the function to object for animation callback
        this._loop = this._loop.bind(this);

        this._installEventHandlers();
    }

    start() {
        requestAnimationFrame(this._loop);
    }

    _drawFPS(x = 0, y = 40) {
        this.ctx.clearRect(0, 0, 60, 50);
        this.ctx.font = '48px serif';
        this.ctx.fillText(fps, x, y);
    }

    _drawObjectNumber(array, x = 0, y = 40) {
        ctx.clearRect(0, 0, 160, 50);
        ctx.font = '48px serif';
        ctx.fillText(array.length, x, y);
    }

    _drawObjects() {
        for (let ob of this.drawableObjects) {
            ob.draw(ctx);
        }
    }

    _drawScene() {
        this._drawObjects();
        this._drawObjectNumber(this.drawableObjects);
        // this._drawFPS(this.fps);
    }

    _render() {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this._drawScene();
    }

    _update(milliseconds) {
        this._moveScene(milliseconds);
    }

    _moveScene(milliseconds) {
        // drawableObjects.push(new RandomObject());
    }

    _loop(timestamp) {
        let elapsed = timestamp - this.last;
        this.fps = Math.floor(1000 / elapsed);
        this.last = timestamp;
        ++this.frame;

        this._update(elapsed);
        this._render();

        requestAnimationFrame(this._loop);
    }

    _installEventHandlers() {
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        document.addEventListener('mousedown', this.onMouseDown);
        document.addEventListener('mouseup', this.onMouseUp);
        document.addEventListener('mousemove', this.onMouseMove);
    }

    // --------------- EVENT HANDLERS --------------

    onMouseMove(event) {
        let point = {
            x: event.clientX,
            y: event.clientY
        };

        // Left mouse button
        if (event.buttons == 1)  {
            // Check for drawing
            if (this.currentlyDrawn) {
                this.currentlyDrawn.update(point.x, point.y);
            }
        }
    }

    onMouseDown(event) {
        let point = {
            x: event.clientX,
            y: event.clientY
        };

        // Left mouse button
        if (event.buttons == 1) {
            // If not already drawing...
            if (this.currentlyDrawn === undefined) {
                console.log ('Start drawing');
                // get create function, pass the point, initial size 0, color
                let createShape = shapeSelector.selected.create;
                this.currentlyDrawn = createShape(point, new RandomColor().css);
                this.drawableObjects.push(this.currentlyDrawn);
            }
            // Center mouse button
        } else if (event.buttons == 4) {
            shapeSelector.nextShape();
        }
    }

    onMouseUp(event) {
        let point = {
            x: event.clientX,
            y: event.clientY
        };

        // Finish drawing
        if (this.currentlyDrawn) {
            // This is not needed after drawing is finished
            // TODO: move this to class and leave for object manipulation
            delete this.currentlyDrawn.update;
            console.log ('Stopped drawing');
            this.currentlyDrawn = undefined;
        }
    }
}


// ---------------- CODE ----------------

game = new Game('app-canvas');
game.start();
