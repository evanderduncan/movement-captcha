let video;
let poseNet;
let poses = [];
let rightWrist;
let leftWrist;
let blueCircle;
let redCircle;
let blueCircleSize = 40;
let blueCircleAttached = false;
let detachDelay = 100; // milliseconds
let counter = 0;
let counterElem;


function setup() {
  var canvas = createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  counterElem = document.getElementById("counter-value");

  let nextPageBtn = document.getElementById("next-page-btn");
  nextPageBtn.classList.add("hidden");

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", function (results) {
    poses = results;
  });

  video.hide();

  // create a blue circle at a random location on the canvas
  blueCircle = createVector(random(width), random(height));
   blueCircleAttached = false;
  //same with red circle - reciever
  redCircle = createVector(random(width), random(height));
}

function modelLoaded() {
  console.log("Model Loaded!");
}

function draw() {
  // draw the video to the canvas
  image(video, 0, 0, width, height);

  textSize(25);
  fill(255);
  counterElem.innerHTML = counter;
  console.log("Counter: " + counter);
  
  // check if there is at least one pose detected
  if (poses.length > 0) {
    // get the first pose detected
    let pose = poses[0].pose;
    let rightWrist = pose.rightWrist;
    let leftWrist = pose.leftWrist;
    //console.log("Right wrist:", rightWrist);
    //console.log("Left wrist:", leftWrist);

    // draw red dots on the right and left wrists
    if (rightWrist) {
      fill(255, 255, 255);
      noStroke();
      ellipse(rightWrist.x, rightWrist.y, 10, 10);

      // check if the right wrist is inside the blue circle
      if (dist(rightWrist.x, rightWrist.y, blueCircle.x, blueCircle.y) < blueCircleSize/2) {
        blueCircleAttached = true;
      }
      
      // check if the blue circle is overlapping the red circle
      if (dist(blueCircle.x, blueCircle.y, redCircle.x, redCircle.y) < blueCircleSize/2 + 25) {
        setup();
        counter++;
        if (counter === 5) {
          // show the button
          let nextPageBtn = document.getElementById("next-page-btn");
          nextPageBtn.classList.remove("hidden");
        }
        return;
      }
    }

    if (leftWrist) {
      fill(255, 255, 255);
      noStroke();
      ellipse(leftWrist.x, leftWrist.y, 10, 10);

      // check if the left wrist is inside the blue circle
      if (dist(leftWrist.x, leftWrist.y, blueCircle.x, blueCircle.y) < blueCircleSize/2) {
        blueCircleAttached = true;
      }
      
      // check if the blue circle is overlapping the red circle
      if (dist(blueCircle.x, blueCircle.y, redCircle.x, redCircle.y) < blueCircleSize/2 + 25) {
        setup();
        return;
      }
      
    }

    // draw the blue circle
    fill(46, 56, 149);
    stroke(255);
    strokeWeight(2);
    ellipse(blueCircle.x, blueCircle.y, blueCircleSize, blueCircleSize);
    
    fill(149, 56, 46);
    stroke(255);
    strokeWeight(2);
    ellipse(redCircle.x, redCircle.y, 50, 50);

    // if either wrist is attached to the blue circle, move the circle to the wrist position
    if (blueCircleAttached) {
      blueCircle.x = (rightWrist ? rightWrist.x : leftWrist.x);
      blueCircle.y = (rightWrist ? rightWrist.y : leftWrist.y);
      detachDelay = 100;
    } else if (detachDelay > 0) {
      detachDelay -= deltaTime;
      if (detachDelay <= 0) {
        blueCircle.x = random(width);
        blueCircle.y = random(height);
        blueCircleAttached = false;
      }
    }
  }
}

function resetcircle() {
  // Reset blue circle to a random location
  //blueCircle = createVector(random(width), random(height));
  //blueCircleAttached = false;
  
  // Reset red circle to a random location
  redCircle = createVector(random(width), random(height));

  // Reset poseNet and poses array
  poseNet.removeAllListeners();
  poses = [];
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", function (results) {
    poses = results;
  });
}





