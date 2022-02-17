/*******************************************************************************************************************
    Moods Example
    by Scott Kildall
    Uses the p5.SimpleStateMachine library. Check the README.md + source code documentation
    The index.html needs to include the line:  <script src="p5.simpleStateManager.js"></script>
    ADDITIONALLY MODIFIED BY SARAH CRUZ
    personalized the UI edits
*********************************************************************************************************************/

var simpleStateMachine;           // the SimpleStateManager class
var selectedTransitionNum = 0;    // index into the array of transitions
var transitions = [];
var moodImage;

let myFont;
function preload() {
  simpleStateMachine = new SimpleStateManager("assets/moodStates.csv");
  //personal font used
  myFont = loadFont('assets/FredokaOne-Regular.ttf');
}

// Setup code goes here
function setup() {
  createCanvas(windowWidth, 600);
  imageMode(CENTER);
  // setup the state machine with callbacks
  simpleStateMachine.setup(setImage, setTransitionNames);
  textFont(myFont);
 }

// Draw code goes here
function draw() {
  drawBackground();
  drawImage();
  drawUI();
}

// this is a callback, which we use to set our display image
function setImage(imageFilename) {
  moodImage = loadImage(imageFilename);
} 

// this is a callback, which we use to diplay next state labels
function setTransitionNames(transitionArray) {
  transitions = transitionArray;
}

//==== KEYPRESSED ====/
function keyPressed() {
  // forward one, check for overflow
  if (keyCode === RIGHT_ARROW) {
    selectedTransitionNum++;
    if( selectedTransitionNum === transitions.length ) {
      selectedTransitionNum = 0;
    }
  }
  
  // back one, check for underflow
  if (keyCode === LEFT_ARROW ) {
    selectedTransitionNum--;
    if( selectedTransitionNum === -1 ) {
      selectedTransitionNum = transitions.length -1;
      if( selectedTransitionNum === -1 ) {
        console.log("error: transition array probably empty");
      }
    }
  }

  // Space or ENTER or RETURN will activate a sections
  if( key === ' ' || keyCode === RETURN || keyCode === ENTER ) {
    simpleStateMachine.newState(transitions[selectedTransitionNum]);
  }
}

//==== MODIFY THIS CODE FOR UI =====/

function drawBackground() {
  background(0);
}

function drawImage() {

  //middle circle
  stroke(255);
  strokeWeight(10);
  var red = color('#e82c0c');
  fill(red);
  ellipse(width/2, (height/2)-75, 400, 400);
  var pink = color('#DF6873');
  fill(pink);
  ellipse(width/2, (height/2)-75, 350, 350);
  //left circle
  strokeWeight(15);
  fill(pink);
  ellipse(width/6, (height/2)-75, 200, 200);
  fill(red);
  ellipse(width/6, (height/2)-75, 100, 100);
  //right circle
  strokeWeight(15);
  fill(pink);
  ellipse(width/2 +width/3, (height/2)-75, 200, 200);
  fill(red);
  ellipse(width/2+ width/3, (height/2)-75, 100, 100);
  //png files
  if( moodImage !== undefined ) {
    image(moodImage, width/2, height/2-75, 350, 350);

  }  
}

function drawUI() {
  push();

  textAlign(CENTER);
  textSize(24);
  //sets x in position
  x = (width/2-345);
  //sets in y position
  y = (height/2)+200;
  var red = color('#e82c0c');

  for( let i = 0; i < transitions.length; i++ ) {
    fill(0);
    if( selectedTransitionNum === i ) {
      fill(red);
      text
    }
    strokeWeight(3);
    text( transitions[i], x + (i*250), y,  210);
  }

  pop();
}