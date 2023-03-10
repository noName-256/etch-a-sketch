let grid=document.querySelector(".grid");
let switchColors=document.querySelector(".switch-colors");
let rainbowMode=document.querySelector(".rainbow-mode");
let bucketFill=document.querySelector(".bucket-fill");
let erase=document.querySelector(".erase");
let clear=document.querySelector(".clear");

gridWidth=grid.offsetWidth;
console.log(gridWidth);
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