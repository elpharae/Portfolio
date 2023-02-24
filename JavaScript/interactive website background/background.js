const canvas = document.getElementById('background');
const inputRadius = document.getElementById('cursorRadiusInput');
const reset = document.getElementById('reset');
const ctx = canvas.getContext('2d');

let dots = [];
let lines = [];
// this is the radius of a circle that the center of which is the user's cursor
// all dots that are within this radius will draw a line towards the cursor
let cursorRadius = inputRadius.value;

// general dot and line properties
const dotAmountMin = 300;
const dotAmountMax = 500;
const dotRadiusMin = 5;
const dotRadiusMax = 15;
const lineThickness = 2;

// this function creates new dots upon entering the website
function initDots() {
    dots = [];

    const dotAmount = Math.floor(
        Math.random() * (dotAmountMax - dotAmountMin + 1) + dotAmountMin
    );

    for (let i = 0; i < dotAmount; i++) {
        // the coordinates are stored as % values of width and height
        // storing coordinates as % values is better for seemles responsivity of the website
        // dot positions would have to be regenerated every time the window is resized
        // this way the dots stay in the same place even when the window size is changed
        const x = Math.random();
        const y = Math.random();

        const radius = Math.floor(
            Math.random() * (dotRadiusMax - dotRadiusMin + 1) + dotRadiusMin
        );

        const dot = new Dot(x, y, radius);

        dots.push(dot);
    }
}

// this function draws dots onto the canvas background
function drawDots() {
    // any existing lines are first cleared
    lines = [];

    // drawDots is called every time the window size changes
    // so the canvas size has to be adjusted on every resize event
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // dots are drawn onto a properly sized canvas
    dots.forEach((dot) => {
        dot.draw();
    });
}

// this function draws lines from cursor's surrounding dots towards the cursor
function drawLines(event) {
    const width = canvas.width;
    const height = canvas.height;

    const mouseX = event.clientX / width;
    const mouseY = event.clientY / height;

    dots.forEach((dot) => {
        // evaluate the distance to all existing dots on the canvas
        const distance = Math.sqrt(
            Math.pow(dot.x * width - mouseX * width, 2) +
                Math.pow(dot.y * height - mouseY * height, 2)
        );

        // if the dot is "around" the cursor
        // create a new line and push it to the lines array in order for it to be drawn on canvas
        if (distance <= cursorRadius) {
            const line = new Line(dot.x, dot.y, mouseX, mouseY, lineThickness);

            lines.push(line);
        }
    });

    // lines are drawn on canvas
    lines.forEach((line) => {
        line.draw();
    });
}

function redraw(event) {
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // redraw the dots
    drawDots();

    // draw new lines
    drawLines(event);
}

function init() {
    initDots();
    drawDots();
}

reset.addEventListener('click', init);

inputRadius.addEventListener('change', (event) => cursorRadius = event.target.value);

window.onload = init;

window.addEventListener('resize', drawDots);

window.addEventListener('mousemove', (event) => redraw(event));

class Dot {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw() {
        const width = canvas.width;
        const height = canvas.height;

        ctx.fillStyle = '#33ddff';

        ctx.beginPath();
        ctx.arc(this.x * width, this.y * height, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Line {
    constructor(startX, startY, endX, endY, thickness) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.thickness = thickness;
    }

    draw() {
        const width = canvas.width;
        const height = canvas.height;

        ctx.strokeStyle = '#33ddff';
        ctx.lineWidth = this.thickness;

        ctx.beginPath();
        ctx.moveTo(this.startX * width, this.startY * height);
        ctx.lineTo(this.endX * width, this.endY * height);
        ctx.stroke();
    }
}
