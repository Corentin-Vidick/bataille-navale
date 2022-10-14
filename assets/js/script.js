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
    button.addEventListener("click", buildPhase);
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
    document.getElementById("menu").innerHTML = `<button id="boat1">Boat 1</button>
    <button id="boat2">Boat 2</button>`;
    for (let x = 50 ; x <=99 ; x++) {
        document.getElementById(x).classList.add ("fog");
    }
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

    document.getElementById("menu").innerHTML = `<h2>Place boat 1</h2><button>OK</button>`;
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
    let ok = document.getElementsByTagName("button");
    ok[0].addEventListener("click", checkPlacement);
}

function checkPlacement() {
    alert("Boat placed");
    let boatCounter = 0;
    let lastEncounter = [];
    for (let x = 0 ; x < 50 ; x ++) {
        if (document.getElementById(x).className === "cell boat") {
            lastEncounter[boatCounter] = x;
            boatCounter ++ ;
        }
    }
    if (boatCounter != 4){
        alert("Wrong length of boat! Please try again and select four cells");
        placeBoat();
    } else for (let x=0 ; x<(boatCounter-1) ; x++) {
        if ((lastEncounter[x]%10) === (lastEncounter[x+1]%10) 
            && (lastEncounter[x+1]%10) === (lastEncounter[x+2]%10)
            && (lastEncounter[x+2]%10) === (lastEncounter[x+3]%10)) {
                alert("correct boat horizontal");
        } else if ( document.getElementById(lastEncounter[x]).className === "cell boat"
                    && document.getElementById(lastEncounter[x]).className === "cell boat"
                    && document.getElementById(lastEncounter[x]).className === "cell boat") {        //check if in-line vertical
            alert("correct boat vertical"); 
        } else {
            alert("incorrect placement");
        }
    }
    
    /*if ( document.getElementById(lastEncounter-10).className === "cell boat"
                && document.getElementById(lastEncounter-20).className === "cell boat"
                && document.getElementById(lastEncounter-30).className === "cell boat") {        //check if in-line vertical
        alert("correct boat vertical");      
    } else if ( ((lastEncounter - 3) % 10) < ((lastEncounter-2) % 10)
                && ((lastEncounter- 2) % 10) < ((lastEncounter-1) % 10)
                && ((lastEncounter- 1) % 10) < (lastEncounter % 10)
                && (lastEncounter - (lastEncounter % 10)) === ((lastEncounter-1) - ((lastEncounter-1) % 10))
                && ((lastEncounter-1) - ((lastEncounter-1) % 10)) === ((lastEncounter-2) - ((lastEncounter-2) % 10))
                && ((lastEncounter-2) - ((lastEncounter-2) % 10)) === ((lastEncounter-3) - ((lastEncounter-3) % 10)) ) {
        alert("correct boat horizontal");
    } else {
        alert("Boat not in a straight line");
        placeBoat();
    }  */
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