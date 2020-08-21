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

let shapes = [shapeLine, shapeRectangle, shapeCircle];

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


// ---------------- CODE ----------------

// Set canvas w x h
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// Request first frame and install the callback
window.requestAnimationFrame(gameLoop);


// ----------- EVENT HANDLERS -----------

document.addEventListener('mousedown', e => {
    let point = {
        x: e.clientX,
        y: e.clientY
    };

    // Left mouse button
    if (e.buttons == 1) {
        // If not already drawing...
        if (currentlyDrawn === undefined) {
            console.log ('Start drawing');
            // get create function, pass the point, initial size 0, color
            let createShape = shapeSelector.selected.create;
            currentlyDrawn = createShape(point, new RandomColor().css);
            drawableObjects.push(currentlyDrawn);
        }
    // Center mouse button
    } else if (e.buttons == 4) {
        shapeSelector.nextShape();
    }
});

document.addEventListener('mousemove', e => {
    let point = {
        x: e.clientX,
        y: e.clientY
    };

    // Left mouse button
    if (e.buttons == 1)  {
        // Check for drawing
        if (currentlyDrawn) {
            currentlyDrawn.update(point.x, point.y);
        }
    }
});

document.addEventListener('mouseup', e => {
    let point = {
        x: e.clientX,
        y: e.clientY
    };

    // Finish drawing
    if (currentlyDrawn) {
        // This is not needed after drawing is finished
        // TODO: move this to class and leave for object manipulation
        delete currentlyDrawn.update;
        console.log ('Stopped drawing');
        currentlyDrawn = undefined;
    }
})


// ---------------- FUNCTIONS ----------------

function Line(pointA, pointB, color) {
    console.log(`Creating line: [${pointA.x}, ${pointA.y}] [${color}]`);
    this.pointA = pointA;
    this.pointB = pointB;
    this.color = color;

    this.draw = function () {
        drawLine(this.pointA, this.pointB, this.color);
    };

    // Add update method with mouse coordinates
    this.update = function (x, y) {
        this.pointB = {x, y};
    }
}

function Circle(centerPoint, r, color) {
    console.log(`Creating circle: [${centerPoint.x}, ${centerPoint.y}] [${color}]`);
    this.center = centerPoint;
    this.radius = r;
    this.color = color;

    this.draw = function () {
        drawCircle(this.center, this.radius, this.color);
    };

    // Add update method with mouse coordinates
    this.update = function (x, y) {
        this.radius = Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }
}

function Rectangle(upperLeft, width, height, color) {
    console.log(`Creating rectangle: [${upperLeft.x}, ${upperLeft.y}] [${width}x${height}] [${color}]`);
    this.upperLeft = upperLeft;
    this.width = width;
    this.height = height;
    this.color = color;

    this.draw = function () {
        drawRectangle(this.upperLeft, this.width, this.height, this.color);
    };

    // Add update method with mouse coordinates
    this.update = function (x, y) {
        this.width =  x - this.upperLeft.x;
        this.height =  y - this.upperLeft.y;
    };
}

function RandomPoint() {
    this.x = Math.floor(Math.random() * ctx.canvas.width);
    this.y = Math.floor(Math.random() * ctx.canvas.height);
}

function RandomLength(max) {
    this.value = Math.floor(Math.random() * max);
}

function RandomColor() {
    this.value = Math.floor(Math.random() * 0xFFFFFF);
    this.css = '#' + this.value.toString(16);
}

function RandomObject() {
    let choice = Math.floor(Math.random() * shapeSelector.shapes.length);
    let newObject = undefined;

    switch (choice) {
        case 0: newObject = new Line(new RandomPoint(), new RandomPoint(), new RandomColor().css);
                break;
        case 1: newObject = new Circle(new RandomPoint(), new RandomLength(300).value, new RandomColor().css);
                break;
        case 2: newObject = new Rectangle(new RandomPoint(), new RandomLength(300).value, new RandomLength(300).value, new RandomColor().css);
                break;
    }

    return newObject;
}

function drawLine(pointA, pointB, color) {

    if (color) {
        ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
}

function drawCircle(centerPoint, r, color) {

    if (color) {
        ctx.fillStyle = color;
    }

    ctx.beginPath();
    ctx.arc(centerPoint.x, centerPoint.y, r, 0, 2 * Math.PI);
    ctx.fill();
}

function drawRectangle(upperLeft, width, height, color) {

    if (color) {
        ctx.fillStyle = color;
    }

    ctx.fillRect(upperLeft.x, upperLeft.y, width, height);
}

function drawFPS(fps, x = 0, y = 40) {
    ctx.clearRect(0, 0, 60, 50);
    ctx.font = '48px serif';
    ctx.fillText(fps, x, y);
}

function drawObjectNumber(array) {
    ctx.clearRect(0, 0, 160, 50);
    ctx.font = '48px serif';
    ctx.fillText(array.length, 0, 40);
}

function drawObjects() {
    for (ob of drawableObjects) {
        ob.draw();
    }
}

function drawScene() {
    drawObjects();
    drawObjectNumber(drawableObjects);
    // drawFPS(fps);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawScene();
}

function update(milliseconds) {
    moveScene(milliseconds);
}

function moveScene(milliseconds) {
    // drawableObjects.push(new RandomObject());

}

function gameLoop(timestamp) {
    elapsed = timestamp - last;
    fps = Math.floor(1000 / elapsed);
    last = timestamp;
    ++frame;

    update(elapsed);
    draw();

    requestAnimationFrame(gameLoop);
}
