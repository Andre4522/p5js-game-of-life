var grid;



function setup() {
  createCanvas(1200, 1200);
  grid = new Grid(10);
  // frame rate
   frameRate(20);
   angleMode(DEGREES);
  // Step 5 
  grid.randomize();
  var button = createButton("reset");
  button.mousePressed(resetSketch);
 
  song = loadSound("rainbow.mp3", loaded);
  button = createButton("play");
  button.mousePressed(togglePlaying);
  song.setVolume(0.3);

}
function loaded(){
  console.log("loaded"); 
}

function togglePlaying(){
  song.play();
}

function resetSketch() {
    grid = new Grid(10);
  // Step 5 
  grid.randomize();
}

function draw() {
  var angle = map(frameCount, 0, 10, 0, TWO_PI);
  var cos_a = cos(angle);
  var sin_a = sin(angle);
  background(50, 20, 70);
  translate(600, 600); // takes back to origin 0,0 location
  rotate(angle);
  rectMode(CENTER);
  translate(-600, -600);
  grid.draw();

   
 grid.updateNeighborCounts();
 //print(grid.cells);
 grid.updatePopulation(); 
}
 

function mousePressed() {
  var randomColumn = floor(random(grid.numberOfColumns));
  var randomRow = floor(random(grid.numberOfRows));
  var randomCell = grid.cells[randomColumn][randomRow];
  print("cell at " + randomCell.column + ", " + randomCell.row);
  var neighborCount = grid.getNeighbors(randomCell).length;
  print("cell at " + randomCell.column + ", " + randomCell.row + " has " + neighborCount + " neighbors");
  // step 8
  // print(grid.isValidPosition(0, 0)); // should be true
  // print(grid.isValidPosition(-1, -1)); // should be false
  // // Add an example for all of the possible ways that it should return false
  // // print(grid.isValidPosition(-1, -10000000000)); // should be false 
  // // print(grid.isValidPosition(4, 7)); // true
  //print(grid.isValidPosition(20, 5)); // false
 // print(grid.updateNeighborCounts(grid.cells));

 

}

class Grid {
  constructor(cellSize) {
    // update the contructor to take cellSize as a parameter
    // use cellSize to calculate and assign values for numberOfColumns and numberOfRows
    this.cellSize = cellSize;
    this.numberOfRows = width / cellSize;
    this.numberOfColumns = height / cellSize;

    // step 2 
    var x = this.numberOfColumns; // how big the first array should be
    var y = this.numberOfRows; // how big each array inside of the first array should be
    var twoDArray = new Array(x);
    for (var i = 0; i < twoDArray.length; i++) {
      twoDArray[i] = new Array(y);

    }
    this.cells = twoDArray;
    //print(twoDArray); // prints [[null, null],[null, null]] in the console

    // Step 3 
    for (var column = 0; column < this.numberOfColumns; column++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row] = new Cell(column, row, cellSize);
      }

    }
    //  print(this.cells);
  }

  draw() {
    for (var column = 0; column < this.numberOfColumns; column++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var cell = this.cells[column][row];
        cell.draw();
      }
    }
  }
  // step 5 
  randomize() {
    for (var column = 0; column < this.numberOfColumns; column++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var cell = this.cells[column][row];
        cell.setIsAlive(floor(random(2)));
      }
    }
  }
  updatePopulation() {
    for (var column = 0; column < this.numberOfColumns; column++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        var cell = this.cells[column][row];
        cell.liveOrDie();
      }
    }
  }
  getNeighbors(currentCell) {
    var neighbors = [];
    // add logic to get neighbors and add them to the array
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
      for (var yOffset = -1; yOffset <= 1; yOffset++) {
        var neighborColumn = currentCell.column + xOffset;
        var neighborRow = currentCell.row + yOffset;
        // do something with neighborColumn and neighborRow
        if (this.isValidPosition(neighborColumn, neighborRow)) {
          var cell = this.cells[neighborColumn][neighborRow];
          if (cell != currentCell){
            neighbors.push(cell);
          }
        }
      }

    }
    return neighbors;
  }
  isValidPosition(column, row) {
    // add logic that checks if the column and row exist in the grid
    // return true if they are valid and false if they are not
    if (column >= 0 && row >= 0 && column < this.numberOfColumns && row < this.numberOfRows) {
      return true;
    } else {
      return false;
    }
  }
  // Step 10
  updateNeighborCounts() {
      // for each cell in the grid
      for (var column = 0; column < this.numberOfColumns; column++) {
        for (var row = 0; row < this.numberOfRows; row++) {
          // reset it's neighbor count to 0
          // get the cell's neighbors
          var cell = this.cells[column][row];
          cell.liveNeighborCount = 0;
          var friends = this.getNeighbors(cell);
          for (var index in friends) {
            var neighbor = friends[index];
            if (neighbor.isAlive == true) {
              cell.liveNeighborCount += 1;
            }
          }
        }
      }
  }

      } // closing class Grid
      // Step 4
      class Cell {
        constructor(column, row, size) {
          this.column = column;
          this.row = row;
          this.size = size;
          this.isAlive = true;
          this.liveNeighborCount = 0;
        }

        draw() {
          // step 4
          if (this.isAlive == false) {
            fill(240);
          } else {
            fill(200, 0, 200);
          }
          noStroke();
          rect(this.column * this.size + 1, this.row * this.size + 1, this.size - 1, this.size - 1);
        }
        // step 5
        setIsAlive(value) {
          if (value == true) {
            this.isAlive = true;
          } else {
            this.isAlive = false;
          }
        }
        liveOrDie() {
          if (this.isAlive == true && this.liveNeighborCount < 2) {
            this.isAlive = false;
          } else if (this.isAlive == true && this.liveNeighborCount == 2 || this.liveNeighborCount == 3) {
            this.isAlive = true;
          } else if (this.isAlive == true && this.liveNeighborCount > 3) {
            this.isAlive = false;
          } else if (this.isAlive == false && this.liveNeighborCount == 3) {
            this.isAlive = true;
          }

        }

      } // End Cell Class