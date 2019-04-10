// SLOT INTERFACE
class SlottedInterface{
  constructor (htmlObject, headerText, locX, locY) {
    this.htmlObject = htmlObject; // The corresponding table.
    this.maxSlots = 5; // Maximum number of slots.
    this.locX = locX; // X position of the entire interface.
    this.locY = locY; // Y position of the entire interface.
    this.slotArray = this.createSlots(); // The slots belonging to this SlottedInterface.
    this.header = this.createHeader(headerText); // The header of this slotted interface.
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
        tempSlotArray.push(new RollSlot(this.htmlObject, tempSlotLocX, tempSlotLocY));
      }
      if (this.htmlObject === document.getElementById("htmlHandInterface")) {
        tempSlotArray.push(new HandSlot(this.htmlObject, tempSlotLocX, tempSlotLocY));
      }

    }
    return tempSlotArray;
  }

  createHeader(headerText) {
    var tempElement = document.createElement("h2");
    this.htmlObject.appendChild(tempElement);
    tempElement.textContent = headerText;
    tempElement.align = "center"
    return tempElement;
  }
}

class RollInterface extends SlottedInterface {
  constructor(htmlObject, header, locX, locY){
      super(htmlObject, header, locX, locY);
      this.rollButton = this.createRollButton();
      // The chances of rolling a given rarity:
      this.rollChanceRare = 30; // %
      this.rollChanceEpic = 15; // %
      this.rollChanceLgnd = 2.5; //%
      this.rollChanceCmmn = 100 - (this.rollChanceEpic + this.rollChanceRare + this.rollChanceLgnd); //%
      // The cost of rolling:
      this.totalRollCost = 80;
      this.addedRollCostConstant = 20;
      this.addedRollCostConstantGrowth = 5;
      this.currentRollCost = this.totalRollCost;
      this.rollCostDecay = 5; // The rate at which your roll cost decreases per second.
      this.numFrames = 5; // Frames per second of roll button.
      // Misc
      this.rollDelay = 2000; // The number of milliseconds after a roll where the player can't reroll again.
      this.rollIsDisabled = false;
      this.rollTimer;
      this.roll();
  }

  createRollButton() {
    var tempButton = document.createElement("BUTTON");
    tempButton.textContent = "Roll (0CM)";
    this.header.appendChild(tempButton);
    tempButton.addEventListener("click", this.reroll.bind(this));
    return tempButton;
  }

  disableRollButton() {
    this.rollButton.disabled = true;
  }

  enableRollButton() {
    this.rollButton.disabled = false;
  }

  getNewRollCost() {
    var tempReal = 0;
    tempReal = this.totalRollCost + this.addedRollCostConstant;
    this.addedRollCostConstant = this.addedRollCostConstant + this.addedRollCostConstantGrowth;
    return tempReal;
  }

  getRandomBuildingByRarity(whichRarity) {
    var rarityArray = this.getRarityArray(whichRarity);
    var tempInteger = this.getRandomInteger(0, rarityArray.length);
    var tempBuilding = rarityArray[tempInteger];
    return tempBuilding;
  }

  getRandomInteger(minValue, maxValue) {
    var tempInteger = minValue + Math.floor((maxValue - minValue) * Math.random());
    return tempInteger;
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
    return wantThisArray;
  }

  modifyRollButton() {
    if (this.currentRollCost > 0) {
      this.rollButton.textContent = "Reroll (" + Math.ceil(this.currentRollCost) + "CM)";
    } else {
      this.rollButton.textContent = "Reroll (Free)";
    }
    if ((this.currentRollCost > gameplayCM) || (this.rollIsDisabled === true)) {
      this.disableRollButton();
    } else {
      this.enableRollButton();
    }
  }

  nextRollDelay() {
    this.rollIsDisabled = true;
    this.modifyRollButton();
    window.setTimeout(this.nextRollDelayCallback.bind(this), this.rollDelay);
  }

  nextRollDelayCallback() {
    this.rollIsDisabled = false;
    this.rollCountdown();
  }

  reduceRollCost() {
    // TempRollCostDecay calculates the player's actual roll cost decay based on their gameplayRollDecayIncrease.
    // Example. the player has 25 gameplayRollDecayIncrease from 25 lv1 Labs.
    // (100 + gameplayRollDecayIncrease) divided by 100 gives a multiplier: eg. 1.25.
    // Actual roll decay becomes 1.25 * 5 = 6.25.
    var tempRollCostDecay = ((100 + gameplayRollDecayIncrease)/100) * this.rollCostDecay;
    if ((this.currentRollCost - (tempRollCostDecay/this.numFrames)) > 0) {
      this.currentRollCost = this.currentRollCost - (tempRollCostDecay/this.numFrames);
    } else {
      this.currentRollCost = 0;
    }
  }

  reroll() {
    //This function is the callback of eventListener "click" added to rollButton.
    changeCM(-this.currentRollCost);
    clearTimeout(this.rollTimer);
    this.roll();
  }

  rollCountdown() {
    this.reduceRollCost();
    this.modifyRollButton();
    if (this.currentRollCost > 0) {
      this.rollTimer = window.setTimeout(this.rollCountdown.bind(this) , 1000/this.numFrames);
    }
  }

  roll() {
    for (var indexSlots = 0; indexSlots < this.maxSlots; indexSlots++) {
      var tempBuilding = this.getRandomBuildingByRarity(this.rollRarity());
      this.slotArray[indexSlots].takeNewContent(tempBuilding);
    }
    this.totalRollCost = this.getNewRollCost();
    this.currentRollCost = this.totalRollCost;
    this.nextRollDelay();
    //this.modifyRollButton();
  }

  rollRarity() {
    var tempReal = Math.random() * 100;
    if (tempReal < this.rollChanceLgnd) { // roll is within (0, 2.5)
      return "lgnd"
    } else if (tempReal >= this.rollChanceLgnd & (tempReal < (this.rollChanceLgnd + this.rollChanceEpic))) { // roll is within (2.5, 17.5)
      return "epic";
    } else if ((tempReal >= (this.rollChanceLgnd + this.rollChanceEpic)) & (tempReal < (this.rollChanceLgnd + this.rollChanceEpic + this.rollChanceRare))) { // roll is within (17.5, 47.5)
      return "rare";
    } else { // roll is within (47.5, 100)
      return "cmmn";
    }
  }
}

class HandInterface extends SlottedInterface {
  constructor(htmlObject, header, locX, locY){
      super(htmlObject, header, locX, locY);
      this.availableSlots = this.maxSlots;
  }

  takeNewContent(whichBuilding){
    var tempSlot = this.getEmptySlot();
    tempSlot.takeNewContent(whichBuilding);
    this.availableSlots = this.availableSlots - 1;
  }

  getEmptySlot(){
    for (var indexSlots = 0; indexSlots < this.slotArray.length; indexSlots++){
      if (this.slotArray[indexSlots].contentObject === null){
        return this.slotArray[indexSlots];
      }
    }
  }
}

class Slot {
  constructor(parentHtmlObject, locX, locY){
    console.log(locX);
    console.log(locY);
    this.locX = locX;
    this.locY = locY;
    this.parentHtmlObject = parentHtmlObject; // The table to which this slot belongs.
    this.htmlObject = this.createSlot(); // The slot object itself.
    this.infoBlocOject = this.createInfoBloc();
    this.contentObject = null; // May contain a building but does not by default.
    this.imgObject = null; // May contain an image, but does not by default.
    this.isActive = false; // Contains a rollable element.
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
    tempParagraph.textContent = "";
    tempParagraph.position = "absolute";
    tempParagraph.style.left = this.locX;
    tempParagraph.style.top = parseInt(this.locY, 10) + 55 + "px";
    return tempParagraph;
  }

  reposition() {
    this.htmlObject.style.left = this.locX + "px";
    this.htmlObject.style.top = this.locY + "px";
  }

  takeNewContent(whichBuilding) {
    this.contentObject = whichBuilding;
    if (whichBuilding.imgLink !== "") {
      this.htmlObject.textContent = "";
      this.renderImage(whichBuilding.imgLink);
    } else {
      this.htmlObject.textContent = whichBuilding.handle;
    }
    this.infoBlocOject.textContent = this.updateInfoBloc(whichBuilding.rarity, whichBuilding.costCM);
    this.isActive = true;
  }

  updateInfoBloc(rarity, costCM) {
    var tempInfoBloc
    if (rarity === "cmmn") {
      tempInfoBloc = "Common";
    } else if (rarity === "rare") {
      tempInfoBloc = "Rare";
    } else if (rarity === "epic") {
      tempInfoBloc = "Epic";
    } else if (rarity === "lgnd") {
      tempInfoBloc = "Legendary";
    }
    tempInfoBloc = tempInfoBloc + " " + costCM + "CM";
    return tempInfoBloc;
  }

  renderImage(whichImage) {
    var tempImg = document.createElement("img");
    tempImg.src = whichImage;
    this.imgObject = tempImg;
    this.htmlObject.appendChild(tempImg);
  }

  removeImage() {
    this.htmlObject.removeChild(this.imgObject);
  }

  emptySlot() {
    this.removeImage();
    this.contentObject = null;
    this.infoBlocOject.textContent = "";
    this.isActive = false;
  }
}

class RollSlot extends Slot {
  // These slots are situtated in Available Buildings and their content can be bought.
  constructor(parentHtmlObject, locX, locY){
    super(parentHtmlObject, locX, locY);
    this.htmlObject.addEventListener("click", this.buyThisBuilding.bind(this));
  }

  buyThisBuilding() {
    if ((this.isActive === true) && (gameplayCM > this.contentObject.costCM) && (handInterface.availableSlots !== 0)){
      changeCM(-this.contentObject.costCM);
      this.isActive = false;
      handInterface.takeNewContent(this.contentObject);
      this.emptySlot();
    }
  }
}

class HandSlot extends Slot {
  // These slots were already purchased and their content can sold or
  constructor(parentHtmlObject, locX, locY){
    super(parentHtmlObject, locX, locY);
    this.htmlObject.addEventListener("click", this.sellThisBuilding.bind(this));
  }

  sellThisBuilding() {
    if (this.isActive === true){
      changeCM(0.7 * this.contentObject.costCM);
      handInterface.availableSlots = handInterface.availableSlots + 1;
      this.emptySlot();
    }
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
new Building("ora_gat", "cmmn", 100, "images/gatherer_lv1_orange.jpg");
new Building("red_gat", "cmmn", 100, "images/gatherer_lv1_red.jpg");
new Building("blu_gat", "rare", 200, "images/gatherer_lv1_blue.jpg");
new Building("gre_gat", "rare", 140, "images/gatherer_lv1_green.jpg");
new Building("pur_gat", "rare", 200, "images/gatherer_lv1_purple.jpg");
// Houses:
new Building("ora_hou", "cmmn", 100, "images/house_lv1_orange.jpg");
new Building("red_hou", "epic", 300, "images/house_lv1_red.jpg");
new Building("blu_hou", "rare", 200, "images/house_lv1_blue.jpg");
new Building("gre_hou", "cmmn",  70, "images/house_lv1_green.jpg");
new Building("pur_hou", "lgnd", 500, "images/house_lv1_purple.jpg");
// Labs:
new Building("ora_lab", "cmmn", 150, "images/lab_lv1_orange.jpg");
new Building("red_lab", "rare", 300, "images/lab_lv1_red.jpg");
new Building("blu_lab", "lgnd", 600, "images/lab_lv1_blue.jpg");
new Building("gre_lab", "epic", 210, "images/lab_lv1_green.jpg");
new Building("pur_lab", "cmmn", 150, "images/lab_lv1_purple.jpg");
// Powerplant:
new Building("ora_pow", "cmmn", 125, "images/power_lv1_orange.jpg");
new Building("red_pow", "rare", 250, "images/power_lv1_red.jpg");
new Building("blu_pow", "epic", 375, "images/power_lv1_blue.jpg");
new Building("gre_pow", "lgnd", 350, "images/power_lv1_green.jpg");
new Building("pur_pow", "rare", 250, "images/power_lv1_purple.jpg");
// Bar:
new Building("ora_bar", "cmmn", 150, "images/bar_lv1_orange.jpg");
new Building("red_bar", "lgnd", 600, "images/bar_lv1_red.jpg");
new Building("blu_bar", "cmmn", 150, "images/bar_lv1_blue.jpg");
new Building("gre_bar", "rare", 210, "images/bar_lv1_green.jpg");
new Building("pur_bar", "epic", 450, "images/bar_lv1_purple.jpg");

// ROLL FUNCTIONALITY
var gameplayRollDecayIncrease = 0;
var gameplayCM = 10000;
var rollInterface = new RollInterface(document.getElementById("htmlRollInterface"), "Available Buildings", 50, 100);
var handInterface = new HandInterface(document.getElementById("htmlHandInterface"), "Placeable Buildings", 530, 100);
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
