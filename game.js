class Tile {
  constructor(row, column, locX, locY) {
    this.row = row; // Tells you which row this tileMatrix element sits in.
    this.column = column; // Tells you which column this tileMatrix element sits in.
    this.trashAmount;
    this.locX = locX; // The x position of this tile on the page.
    this.locY = locY; // The y position of this tile on the page.
    this.tileRepresentator = this.createTileRepresentator(); // Creates a tileMatrix element for the corresponding tile.
    this.trashDisplay = this.createTrashDisplay();
    this.trashDistributionPower = 1.25; // Lower values will result in more evenly distributed trash. Higher values push trash to the edges of the map.
    this.trashMaximum = 10000; // The maximum amount of trash that can be on a tile.
    this.trashMinimum = 500; // The minimum amount of trash that can be on a tile.
    this.trashVariance = 1500; // The maximum that can be added to a tile at random for higher variance.
  }

  createTileRepresentator() {
    var tempTileRepresentator = document.createElement("DIV");
    htmlGrid.appendChild(tempTileRepresentator); // TODO: Don't use JavaScript magic to know this variable from the HTML.
    tempTileRepresentator.innerHTML = "";
    tempTileRepresentator.className = "tile"; // Formats the InGameTile object per style.css class "tile".
    tempTileRepresentator.style.left = this.locX + "px"; // Locks object at provided X.
    tempTileRepresentator.style.top = this.locY + "px"; // Locks object at provided Y.
    return tempTileRepresentator
  }

  createTrashDisplay() {
    var tempParagraph = document.createElement("p");
    this.tileRepresentator.appendChild(tempParagraph);
    return tempParagraph;
  }

  addHouse() { // TODO: Actually use an interation of this.
    if (this.row === 5) {
      if (this.column === 5) {
        var img = document.createElement("img");
        img.src = "https://i20.servimg.com/u/f20/11/29/90/94/blue_h10.jpg";
        this.tileRepresentator.appendChild(img);
      }
    }
    if (this.row === 6) {
      if (this.column === 2) {
        var img = document.createElement("img");
        img.src = "https://i20.servimg.com/u/f20/11/29/90/94/blue_h11.jpg";
        this.tileRepresentator.appendChild(img);
      }
    }
    if (this.row === 2) {
      if (this.column === 3) {
        var img = document.createElement("img");
        img.src = "https://i20.servimg.com/u/f20/11/29/90/94/blue_h11.jpg";
        this.tileRepresentator.appendChild(img);
      }
    }
  }

  updateTrash() {
    if (this.trashAmount !== 0) {
      this.trashDisplay.innerHTML = Math.floor(this.trashAmount);
    } else {
      // Should later call the clear function.
      this.trashDisplay.innerHTML = "";
    }
    this.updateTileColor();
  }

  updateTileColor() {
    // Color the tileMatrix based on how full of trash it is.
    var tempReal = 0;
    if (this.trashAmount !== 0){
      tempReal = 90 - 40 * (this.trashAmount / this.trashMaximum); // Minimum gray is 50%. Maximum gray is 90%.
    } else {
      tempReal = 100;
    }
    tempReal = (255/100) * tempReal; // Convert percentage gray to RGB gray.
    this.tileRepresentator.style.setProperty('background-color', ("RGB(" + tempReal + "," + tempReal + ","+ tempReal + ")"))
  }

  removeTrash(whichAmount) {
    // Remove the trash if trash exceeds removal request. Otherwise: Set trash = 0.
    if (this.trashAmount > whichAmount) {
      this.trashAmount = this.trashAmount - whichAmount;
    } else {
      this.trashAmount = 0;
    }
    // Call the user interface function that updates this cell, since its trash amount was changed.
    this.updateTrash();
  }

  removeAllTrash() {
  // Removes all the trash from a cell.
    this.removeTrash(this.trashAmount)
  }

  getDistance(whichTile){ //TODO: See if this can be a method of grid --OR-- see if randomTrashOnGrid can be a method of tile. These two should be in the same class.
    // Takes two cells and returns their distance.
    var tilesRowDistance = Math.abs(this.row - whichTile.row);
    tilesRowDistance = tilesRowDistance.toFixed(2);
    var tilesColumnDistance = Math.abs(this.column - whichTile.column);
    tilesColumnDistance = tilesColumnDistance.toFixed(2);
    // Calculates a factor based on above distance.
    var distanceFactor = Math.sqrt(Math.pow(tilesRowDistance, this.trashDistributionPower) + Math.pow(tilesColumnDistance, this.trashDistributionPower));
    return distanceFactor
  }

  createInitialTrash(startingTile, maxRows, maxColumns, tileMatrix) { //TODO: See if this can be a method of grid --OR-- see if randomTrashOnGrid can be a method of tile. These two should be in the same class.
    // A random amount between 0 and trashVariance is added at random.
    // The remaining trash (trashMaximum - trashMinimum - trashVariance) is added based on the distance of starting cell and the cell of current iteration.
    var tempReal = 0;
    for (var indexTileRows = 0; indexTileRows < maxRows; indexTileRows++) {
        for (var indexTileColumns = 0; indexTileColumns < maxColumns; indexTileColumns++) {
          // Find highest distance.
          if (this.getDistance(startingTile) > tempReal) {
            tempReal = tileMatrix[indexTileRows][indexTileColumns].getDistance(startingTile);
          }
        }
    }

    for (var indexTileRows = 0; indexTileRows < maxRows; indexTileRows++) {
        for (var indexTileColumns = 0; indexTileColumns < maxRows; indexTileColumns++) {
          // Allocate trash.
          this.trashAmount = this.trashMinimum + (this.trashMaximum - this.trashMinimum - this.trashVariance) * (this.getDistance(startingTile) / tempReal) + Math.random() * this.trashVariance;
          this.updateTrash();
        }
    }
  }
}

class Grid {
  constructor() {
    this.maxColumns = 10;
    this.maxRows = 10;
    this.startDrawX = 150;
    this.startDrawY = 400;
    this.htmlGrid = document.getElementById("htmlGrid");
    this.startingRow = 3 + Math.floor(Math.random()*(this.maxRows-5)); // Starting square cannot be column 0, 1, 2 or column (n-2), (n-1) and (n) where n is the number of rows in the game.
    this.startingColumn = 3 + Math.floor(Math.random()*(this.maxColumns-5)); // Starting row cannot be row 0, 1, 2 or column (n-2), (n-1) and (n) where n is the number of columns in the game.
    this.numberOfStartingCells = 4; // Clear this many cells INCLUDING the starting cell.
    this.tileMatrix = this.createTileMatrix();
    this.createInitialTrashOnGrid();
    this.clearStartingCells();
  }

  createTileMatrix() {
    // Takes from global declearation: maxRows and maxColumns.
    // Creates a maxColumns by maxRows large tileMatrix.
    var tempTileMatrix = []
    for (var indexRows = 0; indexRows < this.maxRows; indexRows++) {
    tempTileMatrix.push([]);
        for (var indexColumns = 0; indexColumns < this.maxColumns; indexColumns++) {
        var locY = this.startDrawY + 50 * indexRows; // Sets new tile's Y location.
        var locX = this.startDrawX + 50 * indexColumns; // Sets new tile's X location.
        var tempTile = new Tile(indexRows, indexColumns, locX, locY);
        tempTileMatrix[indexRows][indexColumns] = tempTile;
        // tileMatrix[gridEl_convertLocToIndex(indexRows, indexColumns)].tileIndex = gridEl_convertLocToIndex(indexRows, indexColumns);
      }
    }
  return tempTileMatrix
  }

  createInitialTrashOnGrid() { // TODO: Trash distribution relies on the entire grid to function. Make it so that each tile can create its own trash on init.
    for (var indexTileRows = 0; indexTileRows < this.maxRows; indexTileRows++) {
        for (var indexTileColumns = 0; indexTileColumns < this.maxRows; indexTileColumns++) {
          var currentTile = this.tileMatrix[indexTileRows][indexTileColumns];
          currentTile.createInitialTrash(this.tileMatrix[this.startingRow][this.startingColumn], this.maxRows, this.maxColumns, this.tileMatrix);
        }
    }
  }

  clearStartingCells() {
    var tempRow = this.startingRow;
    var tempColumn = this.startingColumn;
    this.tileMatrix[this.startingRow][this.startingColumn].removeAllTrash();
    this.numberOfStartingCells = this.numberOfStartingCells - 1;
    while (this.numberOfStartingCells !== 0) {
      // Clears the current cell than picks the current cell's neighbour. May need to reiterate when it finds an already cleared cell.
      var neighbour = this.getRandomNeighbour(tempRow, tempColumn);
      // Eligible starting cell
      while (neighbour.trashAmount === 0) {
          var neighbour = this.getRandomNeighbour(tempRow, tempColumn);
      }
      // Call next clear.
      neighbour.removeAllTrash();
      tempRow = neighbour.row;
      tempColumn = neighbour.column;
      this.numberOfStartingCells = this.numberOfStartingCells - 1;
    }
  }

  getRandomNeighbour(row, column) {
    var neighboursArray = this.getNeighbours(row, column);
    var tempIndex = Math.floor(Math.random() * neighboursArray.length);
    return neighboursArray[tempIndex]
  }

  getNeighbours(row, column) {
    // Takes a tile and returns all of its neighbours.
    var returnArray = []
    if (row - 1 >= 0) {
      returnArray.push(this.tileMatrix[row - 1][column]);
    }
    if (row + 1 < this.maxRows) {
      returnArray.push(this.tileMatrix[row + 1][column]);
    }
    if (column - 1 >= 0) {
      returnArray.push(this.tileMatrix[row][column - 1]);
    }
    if (column + 1 < this.maxColumns) {
      returnArray.push(this.tileMatrix[row][column + 1]);
    }
    return returnArray
  }
}

var grid = new Grid();
