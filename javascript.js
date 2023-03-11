let grid=document.querySelector(".grid");
let switchColors=document.querySelector(".switch-colors");
let rainbowMode=document.querySelector(".rainbow-mode");
let bucketFill=document.querySelector(".bucket-fill");
let erase=document.querySelector(".erase");
let clear=document.querySelector(".clear");
let gridLinesSwitch=document.querySelector(".grid-lines");
let rangeSlider=document.querySelector(".slider");
let rangeDisplay=document.querySelector(".range-value-display");
let primaryColorElement=document.querySelector(".color-1 input");
let secondaryColorElement=document.querySelector(".color-2 input");
let backgroundColorElement=document.querySelector(".background-color input");

let primaryColor, secondaryColor, backgroundColor, dimensionSize, bucketFillSwitch=false;
gridWidth=grid.offsetWidth;
gridArray=[];
function random(x, y){return Math.floor(Math.random()*(y-x+1))+x;}
function randomColor(){return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;}
function createGrid(gridElementsPerDimension)
{
    dimensionSize=gridElementsPerDimension;
    let gridElements=[];
    for(let i=0;i<gridElementsPerDimension;i++)
    {
        let gridRow=[];
        let gridRowElement=document.createElement("div");
        for(let j=0;j<gridElementsPerDimension;j++){
            let gridElement=document.createElement("div");
            gridElement.id=`${i}-${j}`;//set id to row and column, used to get the position of an element during event
            gridElement.style.backgroundColor=backgroundColor;
            gridRowElement.appendChild(gridElement);
            gridRow.push(gridElement);
        }
        grid.appendChild(gridRowElement);
        gridElements.push(gridRow);
    }
    gridArray=gridElements;
    console.log(gridArray);

    //add event listeners for each tile
    function paintTile(tile, currentColor)
    {
        console.log(`${tile.id}, ${currentColor}`);
        if(bucketFillSwitch){fillByBucket(tile, currentColor=="primary"?primaryColor:secondaryColor); toggleBucketFill(); return;}
        if(rainbowModeSwitch)color=randomColor();
        else if(eraserToggle)color=backgroundColor;
        else if(currentColor=="primary")color=primaryColor;
        else color=secondaryColor;
        tile.style.backgroundColor=color;
    }
    for(let row of gridArray)
    {
        for(let element of row)
        {
            element.addEventListener("mouseover", (event)=>{if(event.buttons==1&&!bucketFillSwitch) paintTile(event.target, event.ctrlKey ? "secondary" : "primary")});
                //sends event only if click is pressed, sends secondary if ctrl key is pressed, otherwise primary
            element.addEventListener("mouseleave", (event)=>{if(event.buttons==1&&!bucketFillSwitch)paintTile(event.target, event.ctrlKey ? "secondary" : "primary")});
                //this paints the tile where the click actually happened, if it ever leaves the tile
            element.addEventListener("click", (event)=>{paintTile(event.target, event.ctrlKey ? "secondary" : "primary")});
                //this paints the tile where the click happened if it does not move to another tile, only valid way of using bucket fill
        }
    }
}
function removeGrid()
{
    for(let row of gridArray)
    {
        for(let element of row)
            element.remove();//removing actual elements
    }
    let rowElements=document.querySelectorAll(".grid > *");
    rowElements.forEach(rowElement=>rowElement.remove());
    gridArray=[];
}
defaultToColors(); //cheap trick to make the colors default before creating the grid
createGrid(16);
function defaultToColors()
{
    primaryColorElement.value="#000000";
    secondaryColorElement.value="#ffffff";
    backgroundColorElement.value="#dcdcdc";
    primaryColor="#000000";
    secondaryColor="#ffffff";
    backgroundColor="#dcdcdc";
}
document.addEventListener("DOMContentLoaded", ()=>{defaultToColors(); defaultRangeSlider();}); //when page loads reset colors and range slider
function changeColor(colorType, color)
{
    switch(colorType)
    {
        case "primary":
            primaryColor=color;
            break;
        case "secondary":
            secondaryColor=color;
            break;
        case "background":
            changeBackgroundColor(color);
            break;
        default:
            throw new Error(`Odd color type: ${colorType}`);
    }
}
primaryColorElement.addEventListener("change", (event)=>{changeColor("primary", event.target.value);});
secondaryColorElement.addEventListener("change", (event)=>{changeColor("secondary", event.target.value)});
backgroundColorElement.addEventListener("change", (event)=>{changeColor("background", event.target.value)});

//start of rgb2hex converter
var hexDigits = new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
   }
function hex(x) {
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
   }
//end of rgb2hex converter, really finicky code

function changeBackgroundColor(color)
{
    let oldColor=backgroundColor;
    backgroundColor=color;
    for(let row of gridArray)
    {
        for(let element of row)
        {
            let tileBackground=element.style.backgroundColor; //get the current background color of the tile
            if(tileBackground==oldColor||oldColor==rgb2hex(tileBackground)) //if it is equal to the old background then change it to the new one
                element.style.backgroundColor=backgroundColor;
        }
    }
}

function switchColorsFunction()
{
    [primaryColor, secondaryColor]=[secondaryColor, primaryColor];
    [primaryColorElement.value, secondaryColorElement.value]=[secondaryColorElement.value, primaryColorElement.value];
}
switchColors.addEventListener("click", switchColorsFunction);

let rainbowModeSwitch=false;
function toggleRainbowMode()
{
    if(rainbowMode.classList.contains("active-button")) //if rainbow mode is on
    {
        rainbowMode.classList.remove("active-button");
        rainbowModeSwitch=false;
    }
    else //if rainbow mode is off
    {
        rainbowMode.classList.add("active-button");
        rainbowModeSwitch=true;
        if(erase.classList.contains("active-button"))toggleEraser(); //toggle eraser to inactive
    }
}
rainbowMode.addEventListener("click", toggleRainbowMode);

let eraserToggle=false;
function toggleEraser()
{
    if(erase.classList.contains("active-button")) //if eraser is on
    {
        erase.classList.remove("active-button");
        eraserToggle=false;
    }
    else //if eraser is off
    {
        erase.classList.add("active-button");
        eraserToggle=true;
        if(rainbowMode.classList.contains("active-button"))toggleRainbowMode();
    }
}
erase.addEventListener("click", toggleEraser);

function clearGrid()
{
    for(let row of gridArray)
    {
        for(let element of row)
            element.style.backgroundColor=backgroundColor;
    }
}
clear.addEventListener("click", clearGrid);

function defaultRangeSlider(){}
function resizeGrid(newSize)
{
    removeGrid();
    rangeDisplay.textContent=`${newSize}*${newSize}`;
    createGrid(newSize);
}
rangeSlider.addEventListener("change", ()=>{resizeGrid(rangeSlider.value)});

function gridLinesToggle()
{
    gridLinesSwitch.classList.toggle("active-button");
    grid.classList.toggle("with-borders");
}
gridLinesSwitch.addEventListener("click", gridLinesToggle);

function fillByBucket(element, color)
{
    //flood fill algorithm using extra grid array
    let passedCheckGrid=[];//grid to store true or false values for each element, all false initially
    for(let i=0;i<dimensionSize;i++)
    {
        let passedCheckRow=[];
        for(let j=0;j<dimensionSize;j++)
            passedCheckRow.push(false);
        passedCheckGrid.push(passedCheckRow);
    }
    function fill(row, column)
    {
        if(row<0||column<0||row>=dimensionSize||column>=dimensionSize||passedCheckGrid[row][column]||rgb2hex(gridArray[row][column].style.backgroundColor)!=backgroundColor)return;
        //if out of bounds or checked before or filled with non background color
        passedCheckGrid[row][column]=true;//mark passed
        let currentElement=gridArray[row][column];
        if(rainbowModeSwitch)color=randomColor();//color changes to random if rainbow mode
        currentElement.style.backgroundColor=color;
        fill(row-1, column);
        fill(+row+1, column);
        fill(row, column-1);
        fill(row, +column+1);
    }
    let rowColumn=element.id.split("-");
    let currentRow=rowColumn[0], currentColumn=rowColumn[1];
    fill(currentRow, currentColumn);
}
function toggleBucketFill()
{
    if(erase.classList.contains("active-button"))toggleEraser();
    bucketFill.classList.toggle("active-button");
    bucketFillSwitch=!bucketFillSwitch;
}
bucketFill.addEventListener("click", toggleBucketFill);