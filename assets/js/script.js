// Wait for the DOM to finish loading before running the game
document.addEventListener("DOMContentLoaded", function() {
    runGame();
})

function runGame() {
    //createMap();
    playGame();
}

/**
 * Creates contents of game-area
 */
function createMap(player) {
    document.getElementById("game-container").innerHTML = ``;
    for (let x = 0 ; x < 100 ; x++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = x;
        document.getElementById("game-container").appendChild(cell);
    }
    if (player === 1) {
        createMap();
        for (let x = 50 ; x <=99 ; x++) {
            document.getElementById(x).classList.add ("fog");   // fogs player 2's half of map
        }
    } else if (player === 2) {
        createMap();
        for (let x = 0 ; x <=49 ; x++) {
            document.getElementById(x).classList.add ("fog");   // fogs player 1's half of map
        } 
    }
}

/**
 * Menu page
 */
function playGame() {
    document.getElementById("game-container").innerHTML = 
        `<button id="play">Play</button>`;
    document.getElementById("play").addEventListener("click", buildPhase);
}

/**
 * Select player to place boats or ready to go to next phase
 */
function buildPhase() {
    let ready1 = false;
    let ready2 = false;
    document.getElementById("menu").innerHTML = 
        `<button id="ready">Ready</button>`;
    document.getElementById("game-container").innerHTML = 
        `<button id="player1">Player 1</button>
        <button id="player2">Player 2</button>`;
    let buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        button.addEventListener("click", function() {
            if (this.id === "player1") {
                createMap(1);
                placeBoat(1, 1);
            } else if (this.id === "player2") {
                createMap(1);
                placeBoat(2, 1);
                ready2 = true;
            } else if (this.id === "ready") {
                if (ready1 && ready2) {
                    battlePhase();
                } else {
                    alert("please place all boats");
                }

            }
        })
    }
}

function placeBoat(player, boat) {
    if (boat === 3) {
        buildPhase();
    } else {
//create contents of page    
    document.getElementById("menu").innerHTML = `<h2>Player ${player}, place boat ${boat}</h2><button id="ok">OK</button>`;    
//boat placement
        let cells = document.getElementsByClassName("cell");
        for (let cell of cells) {
            cell.addEventListener("mouseover", higlightPlacement);
            cell.addEventListener("mouseout", normal);
            cell.addEventListener("click", function(){
                if (this.className === "cell boat"){
                    this.classList.remove ("boat");
                } else if (this.className === "cell highlight-cell"){
                    this.classList.add ("boat");
                }
            })            
        }
        let correct = 0;
        document.getElementById("ok").addEventListener("click", function () {
                correct = parseInt(checkPlacement());

        if (correct === 1) {
            boat ++;
            confirmBoat(player,boat);
        }
    });
    }
} 

function checkPlacement() {
    alert("Boat placed");
    let correct = 0;
    let boatCounter = 0;
    let x = 0;
    rowLoop:
        while (x < 50) {
            let boatInRow = 0;
            let y = 0;
            while (y < 10){
                if (document.getElementById(x+y).className === "cell boat") {
                    boatInRow ++;
                }
                y ++;
            }
            if (boatInRow === 4) {
                correct = 1;
                break rowLoop;
            }
            x += 10;
        }
    let y = 0;
    rowColumn:
        while (y < 10) {
            let boatInColumn = 0;
            let x = 0;
            while (x < 50) {
                if (document.getElementById(x+y).className === "cell boat") {
                    boatInColumn ++;
                }
                x += 10;
            }
            if (boatInColumn === 4) {
                correct = 1;
                break rowColumn;
            }
            y ++;
        }
    for (let x = 0; x < 50 ; x++){
        if (document.getElementById(x).className === "cell boat") {
            boatCounter ++;
        }
    }
    if (boatCounter != 4) {correct = 0}
    if (correct === 1) {
        alert("Well done, moving on");
    } else {
        alert("wrong placement, please try again");
    }
    return [correct];
}

function confirmBoat(player, boat) {
    for (let x = 0; x < 50 ; x++){
        if (document.getElementById(x).className === "cell boat") {
            document.getElementById(x).classList.add("confirmed");
        }
    }
    alert("Boat confirmed");
    placeBoat(player, boat);
}

// Effects
function higlightPlacement() {
    if (this.className === "cell") {
        this.classList.add ("highlight-cell");
    } else if (this.className === "cell fog") {
        this.classList.add ("highlight-fog");
    }                
}

function normal() {
    this.classList.remove("highlight-cell");
    this.classList.remove("highlight-fog");
}