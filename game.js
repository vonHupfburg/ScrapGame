// SLOT INTERFACE
class SlottedInterface{
  constructor (htmlObject, header, locX, locY) {
    this.htmlObject = htmlObject; // The corresponding table.
    this.maxSlots = 5; // Maximum number of slots.
    this.locX = locX; // X position of the entire interface.
    this.locY = locY; // Y position of the entire interface.
    this.slotArray = this.createSlots(); // The slots belonging to this SlottedInterface.
    this.header = header; // The header of this slotted interface.
    this.createHeader();
    this.reposition();
  }

  reposition() {
    this.htmlObject.style.left = this.locX + "px";
    this.htmlObject.style.top = this.locY + "px";
  }

  createSlots() {
    var tempSlotArray = []
    for (var indexSlots = 0; indexSlots < this.maxSlots; indexSlots++) {
      // Calc positions.
      var tempSlotLocX = (30 + ((80) * indexSlots)) + "px"
      var tempSlotLocY = "65px"
      // Call new slots.
      if (this.htmlObject === document.getElementById("htmlRollInterface")) {
        tempSlotArray.push(new RollSlot(this.htmlObject, indexSlots, tempSlotLocX, tempSlotLocY));
      }
      if (this.htmlObject === document.getElementById("htmlHandInterface")) {
        tempSlotArray.push(new HandSlot(this.htmlObject, indexSlots, tempSlotLocX, tempSlotLocY));
      }

    }
    return tempSlotArray;
  }

  createHeader() {
    var tempElement = document.createElement("h2");
    this.htmlObject.appendChild(tempElement);
    tempElement.textContent = this.header;
    tempElement.align = "center"
  }
}

class RollInterface extends SlottedInterface {
  constructor(htmlObject, header, locX, locY){
      super(htmlObject, header, locX, locY);
      this.rollButton = this.createRollButton();
  }

  createRollButton() {

  }

  modifyRollButton() {

  }

  checkRollButton() {

  }

  enableRollButton() {

  }

  disableRollButton() {

  }

  roll() {

  }
}


class Slot {
  constructor(parentHtmlObject, index, locX, locY){
    this.index = index;
    this.locX = locX;
    this.locY = locY;
    this.parentHtmlObject = parentHtmlObject; // The table to which this slot belongs.
    this.htmlObject = this.createSlot(); // The slot object itself.
    this.slotContent = null;
    this.img = null; // May contain an image.
    this.reposition();
  }

  createSlot(whichSlot) {
    var tempSlot = document.createElement("div");
    this.parentHtmlObject.appendChild(tempSlot);
    tempSlot.className = "slot";
    tempSlot.style.left = this.locX;
    tempSlot.style.top = this.locY;
    return tempSlot;
  }

  reposition() {
    this.htmlObject.style.left = this.locX + "px";
    this.htmlObject.style.top = this.locY + "px";
  }

  renderImage(whichImage) {

  }

  removeImage() {

  }
}

class RollSlot extends Slot {
  // These slots are situtated in Available Buildings and their content can be bought.
  constructor(parentHtmlObject, index, locX, locY){
    super(parentHtmlObject, index, locX, locY);
  }

  buyThisBuilding() { // TODO: This is a planned feature of RollSlot.
  }
}

class HandSlot extends Slot {
  // These slots were already purchased and their content can sold or
  constructor(parentHtmlObject, index, locX, locY){
    super(parentHtmlObject, index, locX, locY);
  }

  sellThisBuilding() { // TODO: This is a planned feature of HandSlot.
    // Sells a building and returns some CM.
  }

  placeThisBuilding() { // TODO: This is a planned feature of HandSlot.
    // Placeholder function. TODO: Add this.
  }
}

// ROLL FUNCTIONALITY
var rollInterface = new RollInterface(document.getElementById("htmlRollInterface"), "Available Buildings", 50, 100);
var handInterface = new SlottedInterface(document.getElementById("htmlHandInterface"), "Placeable Buildings", 530, 100);

// CM display
var gameplayCM = 10000;
var gameplayCMhtmlObject = document.getElementById("tempInterface");
var commonArray = [];
var rareArray = [];
var epicArray = [];
var legendaryArray = [];

function changeCM(whichAmount) {
  gameplayCM = gameplayCM + whichAmount;
  gameplayCMhtmlObject.textContent = "CM is " + gameplayCM + ".";
}

class Building {
  constructor(handle, rarity, costCM, imgLink) {
    this.handle = handle;
    this.rarity = rarity;
    this.costCM = costCM;
    this.imgLink = imgLink;
    this.pushToArray();
  }

  pushToArray(){
    if (this.rarity === "common"){
      commonArray.push(this);
    }
    if (this.rarity === "rare"){
      rareArray.push(this);
    }
    if (this.rarity === "epic"){
      epicArray.push(this);
    }
    if (this.rarity === "legendary"){
      legendaryArray.push(this);
    }
  }
}

// COMMON BUILDINGS :
new Building("red_gatherer_1", "common", 100, "");
new Building("blue_gatherer_1", "common", 100, "");
console.log(commonArray);


// MISC: Creates a phantom grid. This will later be the actual grid when grid is merged with roll.
var htmlGrid = document.getElementById("htmlGrid");
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
