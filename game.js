var htmlGrid = document.getElementById("htmlGrid");

// Create pseudoGrid.
for (var indexRows = 0; indexRows < 10; indexRows++) {
  for (var indexColumns = 0; indexColumns < 10; indexColumns++) {
    var gridElement = document.createElement("div");
    gridElement.className = "tile";
    htmlGrid.appendChild(gridElement);
    gridElement.style.top = (450 + 50 * indexRows) + "px" ;
    gridElement.style.left = (150 + 50 * indexColumns) + "px";
  }
}
