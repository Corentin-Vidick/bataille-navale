/* jshint esversion: 11 */ //starts EVERY javascript file for checker

let player1Ready = false;
let player2Ready = false;
let boatLength = 2;
let player1Life = boatLength * 2;
let player2Life = boatLength * 2;


// Wait for the DOM to finish loading before running the game
document.addEventListener("DOMContentLoaded", function () {
    playGame();
})

/**
 * Creates contents of game-area
 */
function createMap() {
    document.getElementById("game-container").innerHTML = "";
    for (let x = 0; x < 100; x++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.id = x;
        document.getElementById("game-container").appendChild(cell);
    }
}

/**
 * Add fog to map
 * player = 1 => fog bottom half
 * player = 2 => fog top half
 * player = 0 => fog all
 */
function fogMap(player) {
    if (player === 1) {
        for (let x = 50; x <= 99; x++) {
            document.getElementById(x).classList.add("fog"); // fogs player 2's half of map
        }
        for (let x = 0; x <= 49; x++) {
            document.getElementById(x).classList.remove("fog"); // remove fog player 1's half of map
        }
    } else if (player === 2) {
        for (let x = 0; x <= 49; x++) {
            document.getElementById(x).classList.add("fog"); // fogs player 1's half of map
        }
        for (let x = 50; x <= 99; x++) {
            document.getElementById(x).classList.remove("fog"); // remove fog player 2's half of map
        }
    } else if (player === 0) {
        let cells = document.querySelectorAll(".cell"); //Tim's code - use of =>
        cells.forEach(cell => { //Tim's code - use of =>
            cell.classList.add("fog");
        });
    }
}

/**
 * Menu page
 */
function playGame() {
    player1Ready = false;
    player2Ready = false;
    player1Life = boatLength * 2;
    player2Life = boatLength * 2;
    document.getElementById("menu").innerHTML =`<button id="play">Play</button>`;
    document.getElementById("game-container").innerHTML = `
        <h2>Rules:</h2>
        <ul>   
            <li>Each player plces two boats</li>
            <li>Each boat is ${boatLength} tiles</li>
        </ul>`
    document.getElementById("play").addEventListener("click", function () {
        createMap();
        fogMap(0);
        buildPhase();
    });
}

function buildPhaseEventListener() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener("mouseover", highlightPlacement);
        cell.addEventListener("mouseout", normal);
        cell.addEventListener("click", clickPlaceBoat);
    }
}

function removeBuildPhaseEventListener() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.removeEventListener("mouseover", highlightPlacement);
        cell.removeEventListener("mouseout", normal);
        cell.removeEventListener("click", clickPlaceBoat);
    }
}

function clickPlaceBoat() {
    if (this.className === "cell boat") {
        this.classList.remove("boat");
    } else if (this.className === "cell highlight-cell") {
        this.classList.add("boat");
    }
}


/**
 * Select player to place boats or ready to go to next phase
 */
function buildPhase() {
    fogMap(0);
    document.getElementById("menu").innerHTML =
        `<button id="player1">Player 1</button>
        <button id="player2">Player 2</button>
        <button id="ready">Ready</button>`;
    let buttons = document.getElementsByTagName("button");
    for (let button of buttons) {
        button.addEventListener("click", function () {
            if (this.id === "player1") {
                if (!player1Ready) {
                    fogMap(1);
                    buildPhaseEventListener();
                    placeBoat(1, 1);
                }
            } else if (this.id === "player2") {
                if (!player2Ready) {
                    fogMap(2);
                    buildPhaseEventListener();
                    placeBoat(2, 1);
                }
            } else if (this.id === "ready") {
                removeBuildPhaseEventListener();
                fogMap(0);
                battlePhase(1);
            }
        })
    }
    if (player1Ready === true) {
        document.getElementById("player1").classList.add("player-ready");
    }
    if (player2Ready === true) {
        document.getElementById("player2").classList.add("player-ready");
    }
}

function placeBoat(player, boat) {
    if (boat === 3) {
        if (player === 1) {
            player1Ready = true;
        } else if (player === 2) {
            player2Ready = true;
        }
        buildPhase();
    } else {
        //create contents of page    
        document.getElementById("menu").innerHTML = `<h2>Player ${player}, place boat ${boat}</h2><button id="ok">OK</button>`;
        //boat placement
        //    buildPhaseEventListener();
        let correct = 0;
        document.getElementById("ok").addEventListener("click", function () {
            document.getElementById("ok").removeEventListener("click", function () {
                correct = parseInt(checkPlacement(player));
                if (correct === 1) {
                    boat++;
                    confirmBoat(player, boat);
                }
            });
            correct = parseInt(checkPlacement(player));
            if (correct === 1) {
                boat++;
                confirmBoat(player, boat);
            }
        });
    }
}

function checkPlacement(player) {
    let x;
    let maxX;
    let correct = 0;
    let boatCounter = 0;
    let boatSolid = 0;
    if (player === 1) {
        x = 0;
        maxX = 50;
    } else if (player === 2) {
        x = 50;
        maxX = 100;
    }
    rowLoop:
        while (x < maxX) {
            let boatInRow = 0;
            let y = 0;
            while (y < 10) {
                if (document.getElementById(x + y).className === "cell boat") {
                    boatInRow++;
                    if (boatInRow > 1) {
                        if (boatSolid + 1 != (x + y)) {
                            correct = 0;
                            break rowLoop;
                        }
                    }
                    boatSolid = x + y;
                }
                y++;
            }
            if (boatInRow === boatLength) {
                correct = 1;
                break rowLoop;
            }
            x += 10;
        }
    boatCounter = 0;
    boatSolid = 0;
    let y = 0;
    columnLoop:
        while (y < 10) {
            let boatInColumn = 0;
            if (player === 1) {
                x = 0;
                maxX = 50;
            } else if (player === 2) {
                x = 50;
                maxX = 100;
            }
            while (x < maxX) {
                if (document.getElementById(x + y).className === "cell boat") {
                    boatInColumn++;
                    if (boatInColumn > 1) {
                        if (boatSolid + 10 != (x + y)) {
                            correct = 0;
                            break columnLoop;
                        }
                    }
                    boatSolid = x + y;
                }
                x += 10;
            }
            if (boatInColumn === boatLength) {
                correct = 1;
                break columnLoop;
            }
            y++;
        }
    /*
    for (let x = 0; x < 50; x++) {
        if (document.getElementById(x).className === "cell boat") {
            boatCounter++;
        }
    }
    if (boatCounter != boatLength) {
        correct = 0
    }
    */
    if (correct === 0) {
        alert("wrong placement, please try again");
    }
    return [correct];
}

function confirmBoat(player, boat) {
    for (let x = 0; x < 100; x++) {
        if (document.getElementById(x).className === "cell boat") {
            document.getElementById(x).classList.add("confirmed");
        }
    }
    alert("Boat confirmed");
    placeBoat(player, boat);
}

function battlePhaseEventListener() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.addEventListener("mouseover", highlightShot);
        cell.addEventListener("mouseout", normal);
        cell.addEventListener("click", clickPlaceShot);
    }
}

function removeBattlePhaseEventListener() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.removeEventListener("mouseover", highlightShot);
        cell.removeEventListener("mouseout", normal);
        cell.removeEventListener("click", clickPlaceShot);
    }
}

function clickPlaceShot() {
    if (this.classList.contains("target")) {
        this.classList.remove("target");
    } else if (this.classList.contains("highlight-fog")) {
        this.classList.remove("fog");
        this.classList.add("target");
    }
}

function battlePhase(player) {
    if (!player1Ready || !player2Ready) {
        alert("place boats for all players");
        buildPhase();
    } else if (player1Life === 0 || player2Life === 0) {
        gameOver();
    } else {
        fogMap(0);
        removeBattlePhaseEventListener();
        document.getElementById("menu").innerHTML = `<button id="player${player}">Player ${player} ready?</button>`;
        let buttons = document.getElementById("player" + player);
        buttons.addEventListener("click", function () {
            buttons.removeEventListener("click", function () {
                if (this.id === "player" + player) {
                    playerShoot(player)
                }
            });
            if (this.id === "player" + player) {

                playerShoot(player)
            }
        });
    }
}

/**
 * 1 -> player 1
 * 2 -> player 2
 */
function playerShoot(player) {
    document.getElementById("menu").innerHTML = `<h2>Player ${player}, ready to shoot?</h2><button id="shoot">Shoot</button>`;
    fogMap(player);
    battlePhaseEventListener();
    let hit = 0;
    document.getElementById("shoot").addEventListener("click", function () {
        hit = parseInt(checkHit());
        if (hit === 1 && player === 1) {
            player1Life--;
            confirmShot(player);
        } else if (hit === 1 && player === 2) {
            player2Life--;
            confirmShot(player);
        } else if (hit === 2) {
            alert("Too many shots fired!");
            playerShoot(player);
        } else {
        confirmShot(player);
        }
    });
}

/**
 * Returns 1 if boat hit for playerLife count
 */
function checkHit() {
    let hit = 0;
    let count = 0;
    for (let x = 0; x < 100; x++) {
        if (document.getElementById(x).classList.contains("target")){
            count++;
        }
        if (document.getElementById(x).classList.contains("target") && document.getElementById(x).classList.contains("boat")) {
            hit = 1;
        }
    }
    if (count != 1) {
        hit = 2;
    }
    return hit;
}

/**
 * Assigns correct class to cell dependent on result, switches player, goes back to battlePhase 
 */
function confirmShot(player) {
    for (let x = 0; x < 100; x++) {
        if (document.getElementById(x).classList.contains("target") && document.getElementById(x).classList.contains("boat")) {
            document.getElementById(x).className = "cell boat-hit";
            alert("boat hit");
        } else if (document.getElementById(x).classList.contains("target")) {
            document.getElementById(x).className = "cell miss";
            alert("miss");
        }
    }
    if (player === 1) {
        player = 2;
    } else {
        player = 1;
    }
    battlePhase(player);
}

function gameOver() {
    alert("Game Over");
    playGame();
}

// Effects
function highlightPlacement() {
    if (this.className === "cell") {
        this.classList.add("highlight-cell");
    }
}

function highlightShot() {
    if (this.classList.contains("fog")) {
        this.classList.remove("fog");
        this.classList.add("highlight-fog");
    }
}

function normal() {
    if (this.classList.contains("highlight-cell")) {
        this.classList.remove("highlight-cell");
    } else if (this.classList.contains("highlight-fog")) {
        this.classList.remove("highlight-fog");
        this.classList.add("fog");
    }
}