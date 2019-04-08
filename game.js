class RollInterface{
  constructor () {
    this.htmlObject = document.getElementById("htmlRollInterface");
    this.slotDistance = 30; // Distance between slots on the user interface.
    this.slotWidth = 50; // The width of the slots on the user interface.
    this.maxSlots = 5; // Maximum number of slots.
    this.locX = 50; // X position of the entire interface.
    this.locY = 100; // Y position of the entire interface.
    this.height = 145; // Height of the entire interface.
    this.width = (this.slotDistance + ((this.slotDistance + this.slotWidth) * this.maxSlots)); // Width of the entire interface.
    this.slotArray = this.createSlots();
    this.reposition();
    this.createHeader();
  }

  reposition() {
    console.log(this.htmlObject)
    this.htmlObject.style.left = this.locX + "px";
    this.htmlObject.style.top = this.locY + "px";
    this.htmlObject.style.width = this.width + "px";
    this.htmlObject.style.height = this.height + "px";
  }

  createSlot(whichSlot) {
    var tempSlot = document.createElement("div");
    this.htmlObject.appendChild(tempSlot);
    tempSlot.className = "rollSlot";
    tempSlot.style.left = (this.slotDistance + ((this.slotDistance + this.slotWidth) * whichSlot)) + "px";
    console.log(this.slotDistance + (this.slotDistance + this.slotWidth * whichSlot) + "px");
    tempSlot.style.top = "65px"
    return tempSlot;
  }

  createSlots() {
    var tempSlotArray = []
    for (var indexSlots = 0; indexSlots < this.maxSlots; indexSlots++) {
      tempSlotArray[indexSlots] = this.createSlot(indexSlots);
    }
    return tempSlotArray;
  }

  createHeader() {
    var tempElement = document.createElement("h2");
    this.htmlObject.appendChild(tempElement);
    tempElement.textContent = "Available Buildings"
    tempElement.align = "center"
  }
}

var rollInterface = new RollInterface();

// MISC
var htmlGrid = document.getElementById("htmlGrid");
console.log(document.getElementsByTagName("h1"));
document.getElementsByTagName("h1")[0].textContent = "Roll Functionality"

// Create pseudoGrid.
for (var indexRows = 0; indexRows < 10; indexRows++) {
  for (var indexColumns = 0; indexColumns < 10; indexColumns++) {
    var gridElement = document.createElement("div");
    gridElement.className = "tile";
    htmlGrid.appendChild(gridElement);
    gridElement.style.top = (400 + 50 * indexRows) + "px" ;
    gridElement.style.left = (150 + 50 * indexColumns) + "px";
  }
}
