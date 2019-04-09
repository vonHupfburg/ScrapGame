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
      this.rollChanceRare = 30;
      this.rollChanceEpic = 15;
      this.rollChanceLgnd = 2.5;
      this.rollChanceCmmn = 100 - (this.rollChanceEpic + this.rollChanceRare + this.rollChanceLgnd); //%
      this.roll();
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
    // Reroll entire Available Buildings.
    for (var indexSlots = 0; indexSlots < this.maxSlots; indexSlots++) {
      var tempBuilding = this.getRandomBuildingByRarity(this.rollRarity());
      this.slotArray[indexSlots].takeNewContent(tempBuilding);
    }
  }

  rollRarity() {
    var tempReal = Math.random() * 100;
    if (tempReal < this.rollChanceLgnd) { // roll is within (0, 2.5)
      return "lgnd"
    } else if (tempReal >= this.rollChanceLgnd & (tempReal < (this.rollChanceLgnd + this.rollChanceEpic))) { // roll is within (2.5, 17.5)
      return "epic"
    } else if ((tempReal >= (this.rollChanceLgnd + this.rollChanceEpic)) & (tempReal < (this.rollChanceLgnd + this.rollChanceEpic + this.rollChanceRare))) { // roll is within (17.5, 47.5)
      return "rare"
    } else { // roll is within (47.5, 100)
      return "cmmn"
    }
  }

  getRandomInteger(minValue, maxValue) {
    var tempInteger = minValue + Math.floor((maxValue - minValue) * Math.random())
    return tempInteger
  }

  getRarityArray(whichRarity) {
    var wantThisArray = [];
    if (whichRarity === "cmmn") {
      wantThisArray = rarityArrayCmmn;
    } else if (whichRarity === "rare") {
      wantThisArray = rarityArrayRare;
    } else if (whichRarity === "epic") {
      wantThisArray = rarityArrayEpic;
    } else if (whichRarity === "lgnd") {
      wantThisArray = rarityArrayLgnd;
    }
    return wantThisArray
  }

  getRandomBuildingByRarity(whichRarity) {
    var rarityArray = this.getRarityArray(whichRarity);
    var tempInteger = this.getRandomInteger(0, rarityArray.length);
    var tempBuilding = rarityArray[tempInteger]
    return tempBuilding;
  }
}


class Slot {
  constructor(parentHtmlObject, index, locX, locY){
    this.index = index;
    this.locX = locX;
    this.locY = locY;
    this.parentHtmlObject = parentHtmlObject; // The table to which this slot belongs.
    this.infoBlocOject = this.createInfoBloc();
    this.htmlObject = this.createSlot(); // The slot object itself.
    this.slotContent = null;
    this.img = null; // May contain an image.
    this.reposition();
  }

  createSlot() {
    var tempSlot = document.createElement("div");
    this.parentHtmlObject.appendChild(tempSlot);
    tempSlot.className = "slot";
    tempSlot.style.left = this.locX;
    tempSlot.style.top = this.locY;
    return tempSlot;
  }

  createInfoBloc() {
    var tempParagraph = document.createElement("div");
    var tempLineBreak = document.createElement("br")
    this.parentHtmlObject.appendChild(tempParagraph);
    tempParagraph.className = "infoBlocOject"
    tempParagraph.textContent = ""
    tempParagraph.position = "absolute";
    tempParagraph.style.left = this.locX;
    tempParagraph.style.top = parseInt(this.locY, 10) + 55 + "px";
    return tempParagraph
  }

  reposition() {
    this.htmlObject.style.left = this.locX + "px";
    this.htmlObject.style.top = this.locY + "px";
  }

  takeNewContent(whichBuilding) {
    if (whichBuilding.imgLink !== "") {
      this.renderImage(whichBuilding.imgLink);
    } else {
      this.htmlObject.textContent = whichBuilding.handle
    }
    this.infoBlocOject.textContent = this.updateInfoBloc(whichBuilding.rarity, whichBuilding.costCM)
    console.log(whichBuilding.rarity);
  }

  updateInfoBloc(rarity, costCM) {
    var tempInfoBloc
    console.log(rarity);
    if (rarity === "cmmn") {
      tempInfoBloc = "Common";
    } else if (rarity === "rare") {
      tempInfoBloc = "Rare";
    } else if (rarity === "epic") {
      tempInfoBloc = "Epic";
    } else if (rarity === "lgnd") {
      tempInfoBloc = "Legendary"
    }
    tempInfoBloc = tempInfoBloc + " " + costCM + "CM";
    return tempInfoBloc
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

var rarityArrayCmmn = [];
var rarityArrayRare = [];
var rarityArrayEpic = [];
var rarityArrayLgnd = [];

class Building {
  constructor(handle, rarity, costCM, imgLink) {
    this.handle = handle;
    this.rarity = rarity;
    this.costCM = costCM;
    this.imgLink = imgLink;
    this.rarityImgLink;
    this.pushToArray();
  }

  pushToArray(){
    if (this.rarity === "cmmn"){
      rarityArrayCmmn.push(this);
    }
    if (this.rarity === "rare"){
      rarityArrayRare.push(this);
    }
    if (this.rarity === "epic"){
      rarityArrayEpic.push(this);
    }
    if (this.rarity === "lgnd"){ //legendary
      rarityArrayLgnd.push(this);
    }
  }
}

// COMMON BUILDINGS :
// Gathrers:
new Building("ora_gat", "cmmn", 100, "");
new Building("red_gat", "cmmn", 100, "");
new Building("blu_gat", "rare", 200, "");
new Building("gre_gat", "rare", 140, "");
new Building("pur_gat", "rare", 200, "");
// Houses:
new Building("ora_hou", "cmmn", 100, "");
new Building("red_hou", "epic", 300, "");
new Building("blu_hou", "rare", 200, "");
new Building("gre_hou", "cmmn",  70, "");
new Building("pur_hou", "lgnd", 500, "");
// Labs:
new Building("ora_lab", "cmmn", 150, "");
new Building("red_lab", "rare", 300, "");
new Building("blu_lab", "lgnd", 600, "");
new Building("gre_lab", "epic", 210, "");
new Building("pur_lab", "cmmn", 150, "");
// Powerplant:
new Building("ora_pow", "cmmn", 125, "");
new Building("red_pow", "rare", 250, "");
new Building("blu_pow", "epic", 375, "");
new Building("gre_pow", "lgnd", 350, "");
new Building("pur_pow", "rare", 250, "");
// Bar:
new Building("ora_bar", "cmmn", 150, "");
new Building("red_bar", "lgnd", 600, "");
new Building("blu_bar", "cmmn", 150, "");
new Building("gre_bar", "rare", 210, "");
new Building("pur_bar", "epic", 450, "");

console.log(rarityArrayCmmn);
console.log(rarityArrayRare);
console.log(rarityArrayEpic);
console.log(rarityArrayLgnd);

// ROLL FUNCTIONALITY
var rollInterface = new RollInterface(document.getElementById("htmlRollInterface"), "Available Buildings", 50, 100);
var handInterface = new SlottedInterface(document.getElementById("htmlHandInterface"), "Placeable Buildings", 530, 100);
var gameplayCM = 10000;
var gameplayCMhtmlObject = document.getElementById("tempInterface");


function changeCM(whichAmount) {
  gameplayCM = gameplayCM + whichAmount;
  gameplayCMhtmlObject.textContent = "CM is " + gameplayCM + ".";
}

// =======================
//          MISC
// =======================
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
