let grid=document.querySelector(".grid");
let switchColors=document.querySelector(".switch-colors");
let rainbowMode=document.querySelector(".rainbow-mode");
let bucketFill=document.querySelector(".bucket-fill");
let erase=document.querySelector(".erase");
let clear=document.querySelector(".clear");
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
            gridRowElement.appendChild(gridElement);
            gridRow.push(gridElement);
        }
        grid.appendChild(gridRowElement);
        gridElements.push(gridRow);
    }
    gridArray=gridElements;
}
createGrid(100);
function defaultToColors()
{
    primaryColorElement.value="#000000";
    secondaryColorElement.value="#ffffff";
    backgroundColorElement.value="#dcdcdc";
    primaryColor="#000000";
    secondaryColor="#ffffff";
    backgroundColor="#dcdcdc";
}
window.addEventListener("load", defaultToColors);
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
            backgroundColor=color;
            break;
        default:
            throw new Error(`Odd color type: ${colorType}`);
    }
    console.log(`Changed color to: ${color}`)
}
primaryColorElement.addEventListener("change", ()=>{changeColor("primary", event.target.value);});
secondaryColorElement.addEventListener("change", ()=>{changeColor("secondary", event.target.value)});
backgroundColorElement.addEventListener("change", ()=>{changeColor("background", event.target.value)});