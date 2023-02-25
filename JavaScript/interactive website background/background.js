const canvas = document.getElementById('background');
const reset = document.getElementById('reset');
const inputLineCount = document.getElementById('lineCount');
const ctx = canvas.getContext('2d');

// this is the radius of a circle that the center of which is the user's cursor
// all dots that are within this radius will draw a line towards the cursor
let dots = [];
let lines = [];
let width = window.innerWidth;
let height = window.innerHeight;
let lineCount = inputLineCount.value;

// general dot and line properties
const dotAmountMin = 40;
const dotAmountMax = 60;
const dotRadiusMin = 5;
const dotRadiusMax = 15;
const lineThickness = 5;

const randomValue = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const distance = (aX, aY, bX, bY) => Math.sqrt(Math.pow(aX - bX, 2) + Math.pow(aY - bY, 2));

// this function creates new dots upon entering the website
const initDots = () => {
    dots = [];

    const dotAmount = randomValue(dotAmountMin, dotAmountMax);
    console.log(dotAmount);

    for (let i = 0; i < dotAmount; i++) {
        // the coordinates are stored as % values of width and height
        // storing coordinates as % values is better for seemles responsivity of the website
        // dot positions would have to be regenerated every time the window is resized
        // this way the dots stay in the same place even when the window size is changed
        const x = Math.random();
        const y = Math.random();

        const radius = randomValue(dotRadiusMin, dotRadiusMax);
        const dot = new Dot(x, y, radius);

        dots.push(dot);
    }
}

// this function draws dots onto the canvas background
const drawDots = () => {

    width = window.innerWidth;
    height = window.innerHeight;

    // drawDots is called every time the window size changes
    // so the canvas size has to be adjusted on every resize event
    canvas.width = width;
    canvas.height = height;

    // dots are drawn onto a properly sized canvas
    dots.forEach((dot) => {
        dot.draw();
    });
}

// this function draws lines from cursor's surrounding dots towards the cursor
const drawLines = (event) => {
    lines = []; // drawLines is called repeatedly, therefore lines array must be emptied

    const mouseX = event.clientX / width;
    const mouseY = event.clientY / height;

    // sort all existing dots by distance from cursor
    dots.sort((dot1, dot2) => {
        const dist1 = distance(dot1.x * width, dot1.y * height, mouseX * width, mouseY * height);
        const dist2 = distance(dot2.x * width, dot2.y * height, mouseX * width, mouseY * height);

        return dist1 > dist2 ? 1 : -1;
    });

    // create lines by taking the nearest lineCount dots and connecting them to the cursor
    for (let i = 0; i < lineCount; i++) {
        const line = new Line(dots[i].x, dots[i].y, mouseX, mouseY, lineThickness);

        lines.push(line);
    }

    // draw lines
    lines.forEach((line) => {
        line.draw();
    });
}

const redraw = (event) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear the canvas
    drawDots(); // redraw the dots
    drawLines(event); // draw new lines
}

function init() {
    initDots();
    drawDots();
}

reset.addEventListener('click', init);
inputLineCount.addEventListener('change', () => lineCount = inputLineCount.value);

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
