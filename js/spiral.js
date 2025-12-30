// Variables Globales
var Width = window.innerWidth;
var Height = window.innerHeight;
var color = '#000';
var zoom = 0.2;
var PrecisionSpeed = 50000 / 50000; // Doubled the base speed
var seed = Math.floor(Math.random() * 100000000000);
var grosor = 0.5;
var Size = 3, SizeSpiral, memopathX, memopathY;
var mouseX = Width / 2;
var mouseY = Height / 2;
var NumLog = 10;
var IntervalSpeed = 0.1 * Height;

// Golden colors with opacity
var goldenColors = [
    'rgba(218, 165, 32, 0.6)',  // Golden
    'rgba(255, 215, 0, 0.5)',   // Gold
    'rgba(255, 223, 0, 0.4)',   // Golden yellow
    'rgba(238, 232, 170, 0.3)', // Pale goldenrod
    'rgba(250, 250, 210, 0.2)'  // Light goldenrod
];

function getDistanceFromCenter(x, y) {
    const centerX = Width / 2;
    const centerY = Height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    return Math.sqrt(dx * dx + dy * dy);
}

function updateSpeed(x, y) {
    const distance = getDistanceFromCenter(x, y);
    const maxDistance = Math.sqrt((Width / 2) * (Width / 2) + (Height / 2) * (Height / 2));
    const normalizedDistance = distance / maxDistance;
    PrecisionSpeed = normalizedDistance * 0.002; // Doubled the speed multiplier
}

function LargoX(a,b){
    var numeroRadio = a;
    var numeroAngulo = Math.cos(b);
    return numeroRadio * numeroAngulo;
}

function AltoY(a,b){
    var numeroRadio = a;
    var numeroAngulo = Math.sin(b);
    return numeroRadio * numeroAngulo;
}

function TipoExperimento(b) {
    return Math.log(b) / Math.log(NumLog);
}

function draw() {
    SizeSpiral = Size * Height;
    seed = seed + PrecisionSpeed;
    var canvas = document.getElementById('spiral');
    var context = canvas.getContext("2d");
    var radio = 0.75;
    var angulo = seed / 50;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.lineWidth = grosor;
    context.lineJoin = "round";
    memopathX = canvas.width / 2;
    memopathY = canvas.height / 2;

    for (var n = 0; n < SizeSpiral; n++) {
        radio += zoom;
        angulo += seed / 50;
        angulo = angulo + TipoExperimento(angulo);

        var x = canvas.width / 2 + LargoX(radio,angulo);
        var y = canvas.height / 2 + AltoY(radio,angulo);
        context.beginPath();
        context.moveTo(memopathX, memopathY);
        context.lineTo(x, y);
        memopathX = x;
        memopathY = y;

        // Use golden colors with gradual transition
        const colorIndex = Math.floor((n / SizeSpiral) * goldenColors.length);
        context.strokeStyle = goldenColors[Math.min(colorIndex, goldenColors.length - 1)];
        context.stroke();
    }
}

function animation(){
    draw();
    requestAnimationFrame(animation);
}

// Handle window resize
window.addEventListener('resize', function() {
    Width = window.innerWidth;
    Height = window.innerHeight;
    const canvas = document.getElementById('spiral');
    canvas.width = Width;
    canvas.height = Height;
});

// Handle mouse movement
window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    updateSpeed(mouseX, mouseY);
});

// Initialize on load
window.addEventListener('load', function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'spiral';
    canvas.width = Width;
    canvas.height = Height;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);
    
    animation();
});
