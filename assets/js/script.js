// Wait for the DOM to finish loading before running the game
document.addEventListener("DOMContentLoaded", function() {
    runGame();
})

function runGame() {
    createMap();
    playGame();
}

function playGame() {
    let button = document.createElement("button");
    button.innerHTML = "Play";
    document.getElementById("menu").appendChild(button);
    button.addEventListener("click", buildPhase)
}

function createMap() {
    for (let x = 0 ; x < 100 ; x++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = x;
        document.getElementById("game-container").appendChild(cell);
    }
}

function buildPhase() {
    document.getElementById("menu").innerHTML = `<button id="boat1">Boat 0</button>
    <button id="boat2">Boat 1</button>`;
    let buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        button.addEventListener("click", function(){
            if (this.id === "boat1"){
                placeBoat();
            } else if (this.id === "boat2") {
                placeBoat();
            }
        })
    }
}

function placeBoat() {

    document.getElementById("menu").innerHTML = `<h2>Place boat 1</h2>`
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener("click", checkPlacement)}
}

function checkPlacement () {
    console.log("checkPlacement");
    let cell = parseInt(this.id);

//      WORK IN PROGRESS FROM HERE     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    
    if (cell === 9 || cell === 19 || cell === 29 || cell === 9 || cell === 9 || cell === 9 || cell === 9 || cell === 9 || cell === 9 || )
    let length = cell + 3;
    alert(`You clicked cell ${cell}`);
    for (let x = cell; x <= length ; x++) {
        document.getElementById(x).className = "cell boat";
    }
    let boat1 = 1;
    return boat1;
}