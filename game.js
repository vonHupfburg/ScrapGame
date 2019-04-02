// GLOBALS
// GLOBALS of GRID.
maxColumns = 10;
maxRows = 10;
startDrawX = 150;
startDrawY = 300;
var tileArray = [];

// GLOBALS of BALANCE.
var trashMaximum = 10000; // Sets the amount of trash to distribute in the game.
var trashMinimum = 0; // The minimum amount of trash on a tile.
var trashVariance = 1500; // The maximum that can be added to a tile at random for higher variance.
var trashDistributionPower = 1.25; // Lower values will result in more evenly distributed trash. Higher values push trash to the edges of the map.
// Starting square cannot be column 0, 1, 2 or column 7, 8, 9.
// Starting row cannot be row 0, 1, 2 or column 7, 8, 9.
var startingRow = 3 + Math.floor(Math.random()*(maxRows-3));
var startingColumn = 3 + Math.floor(Math.random()*(maxColumns-3));
// Clear this many cells INCLUDING the starting cell.
var startingClearCells = 4;

// CLLASSES

class InGameTile {
  // InGametile points to an object that is drawn and updated on events.
  // InGametile also holds some information about itself.
  constructor(whichRow, whichColumn) {
    // TILE DECLEARATION
    this.tileIndex = 0 // Points to the array index. Declearation is waiting for a function defintion.
    this.row = whichRow; // Tells you which row this grid element sits in.
    this.column = whichColumn; // Tells you which column this grid element sits in.
    this.trashAmount = trashMaximum; // Amount of trash on tile.

    // Creates a grid element for the corresponding tile.
    this.gridRepresentator = document.createElement("DIV");
    grid.appendChild(this.gridRepresentator);
    this.gridRepresentator.innerHTML = "";
    this.gridRepresentator.className = "tile"; // Formats the InGameTile object per style.css class "tile".
    this.gridRepresentator.style.left = locX + "px"; // Locks object at provided X.
    this.gridRepresentator.style.top = locY + "px"; // Locks object at provided Y.
  }
}

// FLOURISH / COSMETIC FUNCTIONS
// Without which the game will run but will heavily impact user experience.
function gridEl_updateTrash(whichTile) {
  // Change the trash display. This is intended to be temporary.
  if (whichTile.trashAmount !== 0) {
    whichTile.gridRepresentator.innerHTML = Math.floor(whichTile.trashAmount);
  } else {
    // Should later call the clear function.
    whichTile.gridRepresentator.innerHTML = "";
  }

  // Color the grid based on how full of trash it is.
  var tempReal = 0;
  if (whichTile.trashAmount !== 0){
    tempReal = 90 - 40 * (whichTile.trashAmount / trashMaximum); // Minimum gray is 30%. Maximum gray is 90%.
  } else {
    tempReal = 100;
  }
  tempReal = (255/100) * tempReal; // Convert percentage gray to RGB gray.
  whichTile.gridRepresentator.style.setProperty('background-color', ("RGB(" + tempReal + "," + tempReal + ","+ tempReal + ")"))
}

// VITAL FUNCTIONS
// Without which the game breaks down.
function gridEl_convertLocToIndex(whichRow, whichColumn) {
  // Takes the row and column index of a tile and converts it to its unique id inside the tileArray array.
  return whichRow + maxRows * whichColumn;
}

function gridEl_getNeighbours(whichTile) {
  // Takes a tile and returns all of its neighbours.
  var returnArray = []
  if (whichTile.row - 1 >= 0) {
    returnArray.push(tileArray[gridEl_convertLocToIndex(whichTile.row - 1, whichTile.column)]);
  }
  if (whichTile.row + 1 < maxRows) {
    returnArray.push(tileArray[gridEl_convertLocToIndex(whichTile.row + 1, whichTile.column)]);
  }
  if (whichTile.column - 1 >= 0) {
    returnArray.push(tileArray[gridEl_convertLocToIndex(whichTile.row, whichTile.column - 1)]);
  }
  if (whichTile.column + 1 < maxColumns) {
    returnArray.push(tileArray[gridEl_convertLocToIndex(whichTile.row, whichTile.column + 1)]);
  }
  return returnArray
}

function gridEl_getRandomNeighbour(whichTile) {
  var neighboursArray = gridEl_getNeighbours(whichTile);
  var tempIndex = Math.floor(Math.random() * neighboursArray.length);
  return neighboursArray[tempIndex]
}

function gridEl_removeTrash(whichTile, whichAmount) {
  // Removes a specified number of trash from a specified cell.
  if (whichTile.trashAmount <= 0) {
    console.log("ERR: Function tries to clear trash from empty cell at: " + whichTile);
  }
  // Remove the trash if trash exceeds removal request. Otherwise: Set trash = 0.
  if (whichTile.trashAmount > whichAmount) {
    whichTile.trashAmount = whichTile.trashAmount - whichAmount;
  } else {
    whichTile.trashAmount = 0;
  }
  // Call the user interface function that updates this cell, since its trash amount was changed.
  gridEl_updateTrash(whichTile);
}

function gridEl_getDistance(whichCellA, whichCellB){
  // Takes two cells are returns their distance.
  var tilesRowDistance = Math.abs(whichCellA.row - whichCellB.row);
  tilesRowDistance = tilesRowDistance.toFixed(2);
  var tilesColumnDistance = Math.abs(whichCellA.column - whichCellB.column);
  tilesColumnDistance = tilesColumnDistance.toFixed(2);
  // Calculates a factor based on above distance.
  distanceFactor = Math.sqrt(Math.pow(tilesRowDistance, trashDistributionPower) + Math.pow(tilesColumnDistance, trashDistributionPower));
  return distanceFactor
}

// GAMEPLAY
// Sets up the game using the objects and functions defined above.

// GAMEPLAY: GET A GRID.
// Create a grid.
for (var indexColumns = 0; indexColumns < maxColumns; indexColumns++) {
  for (var indexRows = 0; indexRows < maxRows; indexRows++) {
    var locX = startDrawX + 50 * indexColumns // Sets new tile's X location.
    var locY = startDrawY + 50 * indexRows // Sets new tile's Y location.
    tileArray.push(new InGameTile(indexRows, indexColumns));
    tileArray[gridEl_convertLocToIndex(indexRows, indexColumns)].index = gridEl_convertLocToIndex(indexRows, indexColumns);
  }
}
// Null variables.
locX = 0
locY = 0
// End.

// Random distribution,
var tempReal = 0;
var startingCell = tileArray[gridEl_convertLocToIndex(startingRow, startingColumn)];
for (var indexTile = 0; indexTile < tileArray.length; indexTile++) {
    // Find highest distance.
    if (gridEl_getDistance(startingCell, tileArray[indexTile]) > tempReal) {
      tempReal = gridEl_getDistance(startingCell, tileArray[indexTile]);
      console.log(tempReal);
    }
}

console.log(tempReal);

for (var indexTile = 0; indexTile < tileArray.length; indexTile++) {
    // Allocate trash.
    tileArray[indexTile].trashAmount = 1000;
    console.log(gridEl_getDistance(startingCell, tileArray[indexTile]) / tempReal);
    tileArray[indexTile].trashAmount = trashMinimum + (trashMaximum - trashMinimum - trashVariance) * (gridEl_getDistance(startingCell, tileArray[indexTile]) / tempReal) + Math.random() * trashVariance;
    gridEl_updateTrash(tileArray[indexTile]);
  }

// GAMEPLAY: CLEAR N CELLS.
// Clear starting cell plus 3 neighbours of starting cell.
var tempIndex = gridEl_convertLocToIndex(startingRow, startingColumn);
while (startingClearCells !== 0) {
  // Clears the current cell than picks the current cell's neighbour. May need to reiterate when it finds an already cleared cell.
  if (tileArray[tempIndex].trashAmount !== 0) {
  gridEl_removeTrash(tileArray[tempIndex], tileArray[tempIndex].trashAmount);
  startingClearCells = startingClearCells - 1;
    }
  // Picks a random nearby neighbour to clear.
  var neighbour = gridEl_getRandomNeighbour(tileArray[tempIndex]);
  // If the random nieghbour is already empty: Try picking again.
  while (neighbour.trashAmount === 0) {
      var neighbour = gridEl_getRandomNeighbour(tileArray[tempIndex]);
  }
  // Call next clear.
  tempIndex = neighbour.index;
}
