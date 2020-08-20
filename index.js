// ---------------- DATA ----------------

let canvas = document.getElementById('app-canvas');
let ctx = canvas.getContext('2d');

// Canvas animation data
let frame = 0n;
let last = 0;
let fps = 0;
let elapsed = 0;

let drawableObjects = [];
let currentlyDrawn = undefined;

let shapeLine = {
    create(point, color) {
        return createLine(point, point, color);
    }
}

let shapeCircle = {
    create(point, color) {
        return createCircle(point, 0, color);
    }
}

let shapeRectangle = {
    create(point, color) {
        return createRectangle(point, 0, 0, color);
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


// ---------------- FUNCTIONS ----------------

// Set canvas w x h
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

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
            currentlyDrawn = createShape(point, '#FF0000');
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
            currentlyDrawn.update(e.x, e.y);
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

// Request first frame and install the callback
window.requestAnimationFrame(gameLoop);


// ---------------- FUNCTIONS ----------------

function gameLoop(timestamp) {
    elapsed = timestamp - last;
    fps = Math.floor(1000 / elapsed);
    last = timestamp;
    ++frame;

    update(elapsed);
    draw();

    requestAnimationFrame(gameLoop);
}

function drawFPS(fps, x = 0, y = 40) {
    ctx.clearRect(0, 0, 60, 50);
    ctx.font = '48px serif';
    ctx.fillText(fps, x, y);
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
        ctx.strokeStyle = color;
    }

    ctx.beginPath();
    ctx.arc(centerPoint.x, centerPoint.y, r, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawRectangle(upperLeft, width, height, color) {

    if (color) {
        ctx.strokeStyle = color;
    }

    ctx.strokeRect(upperLeft.x, upperLeft.y, width, height);
}

function createLine(pointA, pointB, color) {
    console.log(`Creating line: [${pointA.x}, ${pointA.y}] [${color}]`);
    let newLine = {
        pointA,
        pointB,
        color,
        draw() {
            drawLine(this.pointA, this.pointB, this.color);
        }
    }

    // Add update method with mouse coordinates
    newLine.update = function (x, y) {
        this.pointB = {x, y};
    }

    return newLine;
}

function createCircle(centerPoint, r, color) {
    console.log(`Creating circle: [${centerPoint.x}, ${centerPoint.y}] [${color}]`);
    let newCircle = {
        center: centerPoint,
        radius: r,
        color,
        draw() {
            drawCircle(this.center, this.radius, this.color);
        }
    };

    // Add update method with mouse coordinates
    newCircle.update = function (x, y) {
        this.radius = Math.sqrt(Math.pow(this.center.x - x, 2) + Math.pow(this.center.y - y, 2));
    }

    return newCircle;
}

function createRectangle(upperLeft, width, height, color) {
    console.log(`Creating rectangle: [${upperLeft.x}, ${upperLeft.y}] [${width}x${height}] [${color}]`);
    let newRectangle = {
       upperLeft,
       width,
       height,
       color,
       draw() {
        drawRectangle(this.upperLeft, this.width, this.height, this.color);
       }
    };

    // Add update method with mouse coordinates
    newRectangle.update = function (x, y) {
        this.width =  x - this.upperLeft.x;
        this.height =  y - this.upperLeft.y;
    };

    return newRectangle;
}

function drawObjects() {
    for (ob of drawableObjects) {
        ob.draw();
    }
}
function drawScene() {
    drawObjects();
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
}
