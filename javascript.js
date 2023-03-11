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

let primaryColor, secondaryColor, backgroundColor;
gridWidth=grid.offsetWidth;
gridArray=[];
function createGrid(gridElementsPerDimension)
{
    let gridElements=[];
    for(let i=1;i<=gridElementsPerDimension;i++)
    {
        let gridRow=[];
        let gridRowElement=document.createElement("div");
        for(let j=1;j<=gridElementsPerDimension;j++){
            let gridElement=document.createElement("div");
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
    function random(x, y){return Math.floor(Math.random()*(y-x+1))+x;}
    function paintTile(tile, currentColor)
    {
        if(rainbowModeSwitch)color=`rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
        else if(eraserToggle)color=backgroundColor;
        else if(currentColor=="primary")color=primaryColor;
        else color=secondaryColor;
        tile.style.backgroundColor=color;
    }
    gridArray.forEach(row=>row.forEach(element=>
        element.addEventListener("mouseover", (event)=>{
            if(event.buttons==1) paintTile(event.target, event.ctrlKey ? "secondary" : "primary")})));
    gridArray.forEach(row=>row.forEach(element=>
        element.addEventListener("click", (event)=>{
            if(event.buttons==1) paintTile(event.target, event.ctrlKey ? "secondary" : "primary")})));
        //sends event only if click is pressed, sends secondary if ctrl key is pressed, otherwise primary
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

function changeBackgroundColor(color)
{
    let oldColor=backgroundColor;
    backgroundColor=color;
    for(let row of gridArray)
    {
        for(let element of row)
        {
            let tileBackground=element.style.backgroundColor; //get the current background color of the tile
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