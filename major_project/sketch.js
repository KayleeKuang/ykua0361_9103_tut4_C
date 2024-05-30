let circleRadius = 75;
let initialDotNumber = 60;
let dotNumberDecrement = 5;
let wheelPositions = [];
let wheelIndex = 0;
let isAllWheelsDisplayed = false;

// Setup function to initialize canvas and position data
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  noLoop();

  // Calculate and store positions for drawing wheels
  let spacing = 160;
  let rows = height / spacing;
  let cols = width / spacing;
  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= cols; j++) {
      let x = j * spacing + spacing / 2;
      let y = i * spacing + spacing / 2;
      wheelPositions.push({x, y});
    }
  }

  // Shuffle the wheel positions for random appearance
  // https://p5js.org/reference/#/p5/shuffl
  wheelPositions = shuffle(wheelPositions);
  drawNextWheel();
}

function draw() {
  background(195, 99, 40);
  scale(1.8); 
  translate(width / 2, height / 2);
  rotate(PI / 12);
  translate(-width / 2 - 80, -height / 2 - 80);

  // If all wheels are shown, start erasing
  if (isAllWheelsDisplayed) {
    eraseNextWheel();
  }
}

// Draw each wheel at calculated positions
// Set the Erase Timer
// learn 'setTimeout()' from https://www.youtube.com/watch?v=nGfTjA8qNDA
function drawNextWheel() {
  if (wheelIndex < wheelPositions.length) {
    let pos = wheelPositions[wheelIndex];
    drawWheels(pos.x, pos.y, circleRadius);
    wheelIndex++;
    // Random delay between 100ms and 500ms
    let delay = random(100, 500); 
    // Set timer erase wheel
    setTimeout(drawNextWheel, delay); 
  } else {
    isAllWheelsDisplayed = true;
    // Start erasing when all wheels are displayed.
    setTimeout(eraseNextWheel, 1000); 
  }
}

// Erase next wheel
function eraseNextWheel() {
  if (wheelIndex > 0) {
    wheelIndex--;
    let pos = wheelPositions[wheelIndex]; 
    eraseWheel(pos.x, pos.y, circleRadius); 
    let delay = random(100, 500); 
    setTimeout(eraseNextWheel, delay); 
  } else {
    isAllWheelsDisplayed = false; 
    // After erasing, start drawing again
    setTimeout(drawNextWheel, 1000); 
  }
}

// Draw the background color to cover the wheel to achieve the erase effect
function eraseWheel(x, y, radius) {
  let eraseSize = radius * 2.2; 
  fill(195, 99, 40); 
  noStroke(); 
  rectMode(CENTER); 
  rect(x, y, eraseSize, eraseSize); 
}

// Draw a single wheel with varying elements
function drawWheels(x, y, radius) {
  // Draw line or dots
  let drawLines = random(1) > 0.5;
  // Whether to draw arc
  let drawArcs = random(1) > 0.8;
  let numDotRings = 5;
  let dotNumber = [];

  // The number of dots per ring
  for (let i = 0; i < numDotRings; i++) {
    let currentDotNumber = initialDotNumber - i * dotNumberDecrement;
    dotNumber.push(currentDotNumber);
  }

  // Outermost ring
  let ringRadius = radius;
  let col = color(50, random(0, 30), 95);
  fill(col);
  noStroke();
  ellipse(x, y, ringRadius * 2);

  // Using if-else to draw two different kinds of wheels
  if (drawLines) {
    let numLines = 70;
    stroke(random(360), 50, 60);
    strokeWeight(1.5);
    noFill(); 

    beginShape(); 
    for (let k = 0; k < numLines; k++) {
      let angle = TWO_PI / numLines * k;
      let startX = x + cos(angle) * radius * 0.7;
      let startY = y + sin(angle) * radius * 0.7;
      let endX = x + cos(angle) * radius * 0.94;
      let endY = y + sin(angle) * radius * 0.94;
      vertex(startX, startY); 
      vertex(endX, endY); 
    }
    endShape(CLOSE); 

    let dotColor = color(random(360), 50, 60);

    for (let i = 0; i < 3; i++) {
      let dotRingRadius = radius * (1 - i * 0.12);
      let numDots = dotNumber[i];
      for (let j = 0; j < numDots; j++) {
        let angle = j * TWO_PI / numDots;
        let dotX = x + cos(angle) * dotRingRadius * 0.63;
        let dotY = y + sin(angle) * dotRingRadius * 0.63;
        fill(dotColor);
        noStroke();
        ellipse(dotX, dotY, 5);
      }
    }
  } else {
    // Draw dots on rings
    let dotColor = color(random(360), 50, 60);
    for (let i = 0; i < numDotRings; i++) {
      let dotRingRadius = radius * (1 - i * 0.1);
      let numDots = dotNumber[i];
      for (let j = 0; j < numDots; j++) {
        let angle = j * TWO_PI / numDots;
        let dotX = x + cos(angle) * dotRingRadius * 0.95;
        let dotY = y + sin(angle) * dotRingRadius * 0.95;
        fill(dotColor);
        noStroke();
        ellipse(dotX, dotY, 6);
      }
    }
  }

  // Center inner circle 
  let numInnerCircles = 5;
  for (let i = 0; i < numInnerCircles; i++) {
    let innerRadius = radius * 0.5 * (1 - i * 0.2);
    fill(color(random(330), 50, random(30, 90)));
    stroke(color(random(330), 50, random(30, 90)));
    strokeWeight(1)
    ellipse(x, y, innerRadius * 1.8);
  }

  // Pink arcs
  if (drawArcs) {
    stroke(348, 63, 90);
    strokeWeight(4);
    noFill();
    let arcRadius = radius * 2;
    let startAngle = PI / 2;
    let endAngle = PI;
    arc(x, y - radius, arcRadius, arcRadius, startAngle, endAngle);
  }
}

// Handle window size changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}