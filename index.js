let canvas = document.getElementById('app-canvas');
let ctx = canvas.getContext('2d');

// Set canvas w x h
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let frame = 0n;
let last = 0;
let fps = 0;
let elapsed = 0;

let drawableObjects = [];
let currentlyDrawn = undefined;

document.addEventListener('mousedown', e => {
    let point = {
        x: e.clientX,
        y: e.clientY
    };

    if (currentlyDrawn === undefined) {
        console.log ('Start drawing');
        currentlyDrawn = createLine(point, point, '#FF0000');
        drawableObjects.push(currentlyDrawn);
    }
});

document.addEventListener('mousemove', e => {
    let point = {
        x: e.clientX,
        y: e.clientY
    };

    // Check for dragging
    if (e.buttons == 1)  {
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

    if (currentlyDrawn) {
        delete currentlyDrawn.update;
        console.log ('Stopped drawing');
        currentlyDrawn = undefined;
    }
})
window.requestAnimationFrame(gameLoop);


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

function gameLoop(timestamp) {
    elapsed = timestamp - last;
    fps = Math.floor(1000 / elapsed);
   
    last = timestamp;
    ++frame;

    update(elapsed);
    draw();

    requestAnimationFrame(gameLoop);
}

function createLine(pointA, pointB, color) {
    console.log(`Creating line: [${pointA.x}, ${pointA.y} [${pointB.x}, ${pointB.y}] [${color}]`);
    let newLine = {
        pointA: pointA,
        pointB: pointB,
        color: color, 
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
