/**
 * This is a Processing Sketch which simulates Langton's Ant.
 *
 * Converted to JS and modified from: http://www.openprocessing.org/sketch/13653
 */
function sketchProc(processing) {

  // Stores the state of the squares that have been visited by the ant
  var state = null;

  // Stores the direction and location of the ant
  var ant = {};

  // Variables we'll need
  var squareSize = 15;
  var columns = 0, rows = 0;

  // Some colours
  var bgCol = processing.color(200,200,200);
  var antCol = processing.color(255,130,130);
  var sqCol = processing.color(180,180,180);

  /**
   * Initializes the values required by the simulation
   */
  var setup = function() {

    // Stretches the canvas to the maximum possible size
    processing.size(window.innerWidth, window.innerHeight);

    // Draws the sketch's background
    processing.background(bgCol);

    // Calculates the number of columns and rows that will be needed
    columns = Math.ceil(processing.width/squareSize);
    rows = Math.ceil(processing.height/squareSize);

    // Places the ant at a random location to start with
    ant.x = Math.ceil(processing.random(columns));
    ant.y = Math.ceil(processing.random(rows));

    // Initializes the 2D state array
    state = [];
    for (var i = 0; i < rows; ++i) {
      state[i] = [];
      for (var j = 0; j < columns; ++j) {
        state[i].push([]);
        state[i][j] = false;
      }
    }

    // Starts the ant off in some direction
    ant.direction = 4;
  }
  processing.setup = setup;

  /**
   * Draws the squares
   */
  var drawScene = function() {
    // Board squares
    processing.stroke(bgCol);
    processing.fill(sqCol);
    for (var j =  0; j < rows; ++j) {
      for (var i =  0; i < columns; ++i) {
        if (state[j][i]) {
          processing.rect(i * squareSize, j * squareSize, squareSize, squareSize);
        }
      }
    }

    // The ant's square
    processing.fill(antCol);
    processing.rect((ant.x >= 0 ? ant.x % columns : ant.x + columns)*squareSize,(ant.y >= 0 ? ant.y % rows : ant.y + rows)*squareSize,squareSize,squareSize);
  }
  processing.drawScene = drawScene;

  /**
   * Turns the ant left
   */
  var turnLeft = function() {
    if (ant.direction > 1) {
      ant.direction--;
    } else {
      ant.direction = 4;
    }
  }
  processing.turnLeft = turnLeft;

  /**
   * Turns the ant right
   */
  var turnRight = function() {
    if (ant.direction < 4){
      ant.direction++;
    } else {
      ant.direction = 1;
    }
  }
  processing.turnRight = turnRight;

  /**
   * Moves the ant forwards one, with a modular wraparound effect
   */
  var moveForward = function() {
    if (ant.direction == 1) {
      ant.x--;
      if (ant.x < 0) {
        ant.x += columns
      }
    }
    if (ant.direction == 2) {
      ant.y++;
      ant.y %= rows;
    }
    if (ant.direction == 3) {
      ant.x++;
      ant.x %= columns;
    }
    if (ant.direction == 4) {
      ant.y--;
      if (ant.y < 0) {
        ant.y += rows;
      }
    }
  }
  processing.moveForward = moveForward;

  /**
   * The update function which runs every draw loop. Moves the ant forward and
   * turns it in accordance to the simulation rules
   */
  var updateScene = function() {
    moveForward();
    if (state[ant.y][ant.x] == false) {
      state[ant.y][ant.x] = true;
      turnRight();
    } else {
      state[ant.y][ant.x] = false;
      turnLeft();
    }
  }
  processing.updateScene = updateScene;

  /**
   * Manages the drawing and updating of the simulation
   */
  var draw = function() {
    processing.size(window.innerWidth, window.innerHeight);
    processing.background(bgCol);
    drawScene();
    for (var i =  0;  i < 2; ++i) {
      updateScene();
    }
  }
  processing.draw = draw;
}

// Gets the canvas and resizes it with the window
var canvas = document.getElementById("background");
var resizeCanvas = function() {
  var ctx = canvas.getContext("2d");
  ctx.canvas.width  = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
};

/**
 * Mind-blowingly, Safari gives the incorrect value for window.innerHeight if
 * the resize happens outside of this 0 ms delay. I'm unsure of what's causing
 * this issue, but this is seemingly a valid workaround.
 *
 * The issue was only ever observed once in each brand-new tab. Refreshing
 * caused the problem to go away.
 */
setTimeout(function() {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, false);
  var processingInstance = new Processing(canvas, sketchProc);
}, 0);