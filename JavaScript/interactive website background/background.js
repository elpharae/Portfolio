const dotMin = 50;
const dotMax = 100;
const dotAmount = Math.floor(Math.random() * (dotMax - dotMin + 1) + dotMin);
const dotRadius = 5;
const cursorRadius = 50;

const canvas = document.getElementById('background');

drawDots();

window.addEventListener('resize', drawDots)

window.addEventListener('mousemove', (event) => {
    const cursorX = event.clientX;
    const cursorY = event.clientY;
});

function drawDots() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    for (let i = 0; i < dotAmount; i++) {
        const dotX = Math.floor(Math.random() * width);
        const dotY = Math.floor(Math.random() * height);
    
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}
