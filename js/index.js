// if local storage is not empty - resume the game
function resumeGame() {

    // resume the time
    let time = localStorage.getItem('Time');
    document.getElementById('time').textContent = time;

    let parts = time.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    timer = (minutes * 60 + seconds);

    // resume the moves
    count = localStorage.getItem('Moves');
    document.getElementById("moves-count").textContent = count;

    // resume the position of elements
    let posElementMap = new Map(JSON.parse(localStorage.getItem('Position')));

    for (let [keyOfMap, valueOfMap] of posElementMap) {
        if (valueOfMap == "row-cell-0") {
            document.getElementById(keyOfMap).style.backgroundColor = "rgba(0, 0, 0, 0.11)";
            elemPosition = valueOfMap;
            document.getElementById(keyOfMap).innerHTML = `<div class="row-cell" id=${valueOfMap} onclick="swapValues(this.id)"></div>`;
        } else {
            document.getElementById(keyOfMap).innerHTML = `<div class="row-cell" id=${valueOfMap} onclick="swapValues(this.id)">${numberID.get(valueOfMap)}</div>`;
        }
    }
    positionMap = new Map(JSON.parse(JSON.stringify(Array.from(posElementMap))));

}


// ask user if he wants to resume the game
if (!(localStorage.length === 0)) {
    document.getElementById("game-wrapper-class").style.display = "none";

    document.getElementById("continueGame").innerHTML = `<div id="optionBox">Do you wish to Continue?</br><button class = "button" id="startNewGame">Start New Game</button><button class = "button" id="resumeGame">Resume Game</button></div>`;

    document.getElementById("startNewGame").style.cssText = `  
    padding: 10px;
    background-color: #e5f6ee;
    border-radius: 10px;
    margin: 0px 16px;
    cursor: pointer;
    font-weight: 600;
    `;


    document.getElementById("resumeGame").style.cssText = `  
    padding: 10px;
    border-radius: 10px;
    margin: 0px 16px;
    cursor: pointer;
    font-weight: 600;
    background-color: honeydew;
    `;

    document.getElementById("optionBox").style.cssText = `  
    width: 56vw;
    height: 16vh;
    margin: 116px auto;
    background-color: rgb(180 144 212 / 59%);
    border-radius: 10px;
    font-size: 20px;
    color: #222224;
    font-weight: 600;
    text-align: center;
    padding: 40px 30px;
    line-height: 3;
    `;


    //   Start game EventListner
    document.getElementById("startNewGame").addEventListener('mouseover', function () {
        document.getElementById("startNewGame").style.backgroundColor = "rgb(142 50 212 / 59%)";
        document.getElementById("startNewGame").style.color = "white";

    });

    document.getElementById("startNewGame").addEventListener('mouseout', function () {
        document.getElementById("startNewGame").style.backgroundColor = "#e5f6ee";
        document.getElementById("startNewGame").style.color = "black";
    });

    document.getElementById("startNewGame").addEventListener('click', function () {
        document.getElementById("continueGame").style.display = 'none';
        document.getElementById("game-wrapper-class").style.display = 'block';
        localStorage.clear();
    });


    //  Resume game Eventlistner
    document.getElementById("resumeGame").addEventListener('mouseover', function () {
        document.getElementById("resumeGame").style.backgroundColor = "rgb(142 50 212 / 59%)";
        document.getElementById("resumeGame").style.color = "white";

    });

    document.getElementById("resumeGame").addEventListener('mouseout', function () {
        document.getElementById("resumeGame").style.backgroundColor = "#e5f6ee";
        document.getElementById("resumeGame").style.color = "black";
    });

    document.getElementById("resumeGame").addEventListener('click', function () {
        document.getElementById("continueGame").style.display = 'none';
        document.getElementById("game-wrapper-class").style.display = 'block';
        resumeGame();
    });
}



// change color of cell
let cellElem = document.getElementsByClassName("row-cell");
for (let i = 0; i < cellElem.length; i++) {
    cellElem[i].style.backgroundColor = "rgba(0, 0, 0, 0.11)";
}

document.getElementById("play").innerHTML = "PLAY";
document.getElementById("play").style.cssText = `  
      display: block;
      font-size: 70px;
      color: white;
      text-align: center;
      line-height: 322px;
      cursor: pointer;
    `;

document.getElementById("start").addEventListener("click", playGame);
document.getElementById("pause").addEventListener("click", pauseGame);



// Calculate Time taken by user
let gameTime = null;
var timer = 0;
let minutes, seconds;

function startTimer(duration, display) {

    gameTime = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;
        window.localStorage.setItem('Time', (display.textContent));

        if (++timer < 0) {
            timer = duration;
        }
    }, 1000);
}

function playGame() {
    let cellElem = document.getElementsByClassName("row-cell");
    for (let i = 0; i < cellElem.length; i++) {
        cellElem[i].style.backgroundColor = "rgba(255, 255, 165, 1)";
    }

    document.getElementById("row-cell-0").style.backgroundColor = "rgba(0, 0, 0, 0.11)";
    document.getElementById("play").style.cssText = `  
      display: none;
    `;
    let timeElement = document.querySelector('#time');
    let startGame = document.getElementById("start");
    let stopGame = document.getElementById("pause");
    startGame.style.display = "none";
    stopGame.style.display = "block";
    startTimer(timer, timeElement);
};

// pause the time 
function pauseGame() {
    document.getElementById("play").innerHTML = "PAUSED";
    document.getElementById("play").style.cssText = `  
      display: block;
      font-size: 70px;
      color: white;
      text-align: center;
      line-height: 322px;
      cursor: pointer;
    `;
    let startGame = document.getElementById("start");
    let stopGame = document.getElementById("pause");
    startGame.style.display = "block";
    stopGame.style.display = "none";
    clearInterval(gameTime);
}


// swap the values
var count = 0;
// let count = 0;

function swapValues(clickedID) {
    let elem1 = document.getElementById(elemPosition);
    let elem2 = document.getElementById(clickedID);

    let rowPosition = document.getElementById(elemPosition).parentNode.getAttribute('pos');
    if (validPosition(elem1, rowPosition, elem2.parentNode.id)) {
        swapElements(elem1, elem2);
        if (checkIfAnswerMatched()) {
            console.log("won!!");
            userWin();
        } else {
            document.getElementById("moves-count").textContent = ++count;
            window.localStorage.setItem('Moves', (document.getElementById("moves-count").textContent));
        }
    }
}


// to store position of every element
let positionMap = new Map();

function swapElements(obj1, obj2) {
    var temp = document.createElement("div");
    obj1.parentNode.insertBefore(temp, obj1);

    // move obj1 to right before obj2
    obj2.parentNode.insertBefore(obj1, obj2);

    // move obj2 to right before where obj1 used to be
    temp.parentNode.insertBefore(obj2, temp);

    // remove temporary marker node
    temp.parentNode.removeChild(temp);

    // adding obj1 in map
    let key = obj1.parentNode.id;
    let value = obj1.id;
    positionMap.set(key, value);


    // adding obj2 in map
    let key1 = obj2.parentNode.id;
    let value1 = obj2.id;
    positionMap.set(key1, value1);

    window.localStorage.setItem('Position', JSON.stringify([...positionMap]));

    let one = document.getElementById("row-cell-0");
    one.style.backgroundColor = "rgba(0, 0, 0, 0.11)";
    let cellElem = document.getElementsByClassName("pos-row-cell");
    for (let i = 0; i < cellElem.length; i++) {
        cellElem[i].style.backgroundColor = "rgba(0, 0, 0, 0.11)";
    }
    // console.log([...positionMap.entries()]);
}

// check if user wins
let answerMap = new Map([
    ["pos-1-1", "row-cell-1"],
    ["pos-1-2", "row-cell-2"],
    ["pos-1-3", "row-cell-3"],
    ["pos-1-4", "row-cell-4"],
    ["pos-2-1", "row-cell-5"],
    ["pos-2-2", "row-cell-6"],
    ["pos-2-3", "row-cell-7"],
    ["pos-2-4", "row-cell-8"],
    ["pos-3-1", "row-cell-9"],
    ["pos-3-2", "row-cell-10"],
    ["pos-3-3", "row-cell-11"],
    ["pos-3-4", "row-cell-12"],
    ["pos-4-1", "row-cell-13"],
    ["pos-4-2", "row-cell-14"],
    ["pos-4-3", "row-cell-15"],
    ["pos-4-4", "row-cell-0"]
]);

function compareMaps(answerMap, positionMap) {
    let valueOfpositionMap;
    if (answerMap.size !== positionMap.size) {
        return false;
    }
    for (let [keyOfAnswerMap, valueOfAnswerMap] of answerMap) {
        valueOfpositionMap = positionMap.get(keyOfAnswerMap);
        if (valueOfpositionMap !== valueOfAnswerMap || (valueOfpositionMap === undefined && !positionMap.has(keyOfAnswerMap))) {
            return false;
        }
    }
    return true;
}

function checkIfAnswerMatched() {
    return compareMaps(answerMap, positionMap);
}

function userWin() {
    localStorage.clear();
    document.body.innerHTML = `<div id="winBox"><p id = "win">Congratulations!!</p>You won the Game</br><button id="button">Click to Continue</button></div>`;
    document.getElementById("win").style.cssText = `  
      font-size: 30px;
      color: darkgreen;
      line-height: 3;
      `;

    document.getElementById("button").style.cssText = `  
    padding: 10px;
    background-color: honeydew;
    border-radius: 10px;
    margin: 24px auto;
    cursor: pointer;
    font-weight: 600;
    `;

    document.getElementById("winBox").style.cssText = `  
    width: 76vw;
    height: 224px;
    margin: 116px auto;
    background-color: rgba(165, 205, 101, 0.59);
    border-radius: 10px;
    font-size: 20px;
    color: darkgreen;
    font-weight: 600;
    text-align: center;
      `;

    document.getElementById("button").addEventListener('click', function () {
        document.getElementById("button").style.backgroundColor = "red";
        document.getElementById("button").style.color = "white";
        window.location.reload();
    });
}



// reset the Game on reset button

function resetGame() {
    count = 0;
    document.getElementById("moves-count").textContent = count;
    document.getElementById('time').textContent = `00:00`;
    document.getElementById("play").innerHTML = "PLAY";
    document.getElementById("play").style.cssText = `  
    display: block;
    font-size: 70px;
    color: white;
    text-align: center;
    line-height: 322px;
    cursor: pointer;
    `;
    let startGame = document.getElementById("start");
    let stopGame = document.getElementById("pause");
    startGame.style.display = "block";
    stopGame.style.display = "none";
    timer = 0;
    clearInterval(gameTime);
    arrangeNumbersRandomly();
}


// Assign numbers randomly

let numberID = new Map([
    ["row-cell-0", 0],
    ["row-cell-1", 1],
    ["row-cell-2", 2],
    ["row-cell-3", 3],
    ["row-cell-4", 4],
    ["row-cell-5", 5],
    ["row-cell-6", 6],
    ["row-cell-7", 7],
    ["row-cell-8", 8],
    ["row-cell-9", 9],
    ["row-cell-10", 10],
    ["row-cell-11", 11],
    ["row-cell-12", 12],
    ["row-cell-13", 13],
    ["row-cell-14", 14],
    ["row-cell-15", 15]
]);


let elementArray = [];
let elemPosition;

function arrangeNumbersRandomly() {
    let numberArray = ["row-cell-0", "row-cell-1", "row-cell-2", "row-cell-3", "row-cell-4", "row-cell-5", "row-cell-6", "row-cell-7", "row-cell-8", "row-cell-9", "row-cell-10", "row-cell-11", "row-cell-12", "row-cell-13", "row-cell-14", "row-cell-15"];
    let positionArray = ["pos-1-1", "pos-1-2", "pos-1-3", "pos-1-4", "pos-2-1", "pos-2-2", "pos-2-3", "pos-2-4", "pos-3-1", "pos-3-2", "pos-3-3", "pos-3-4", "pos-4-1", "pos-4-2", "pos-4-3", "pos-4-4"]
    for (let pos of positionArray) {
        let randomElement = numberArray[Math.floor(Math.random() * numberArray.length)];
        elementArray.push(`${numberID.get(randomElement)}`);

        if (randomElement == "row-cell-0") {
            document.getElementById(pos).style.backgroundColor = "rgba(0, 0, 0, 0.11)";
            elemPosition = randomElement;
            document.getElementById(pos).innerHTML = `<div class="row-cell" id=${randomElement} onclick="swapValues(this.id)"></div>`;
        } else {
            document.getElementById(pos).innerHTML = `<div class="row-cell" id=${randomElement} onclick="swapValues(this.id)">${numberID.get(randomElement)}</div>`;
        }

        positionMap.set(pos, randomElement);

        const index = numberArray.indexOf(randomElement);
        if (index > -1) {
            numberArray.splice(index, 1);
        }
    }
}

arrangeNumbersRandomly();

let one = document.getElementById("row-cell-0");
one.style.backgroundColor = "rgba(0, 0, 0, 0.11)";


// creating 2D array and calling isSolvable function

let indexOfArray = 0;
let gameElementArray = [];
for (let i = 0; i < 4; i++) {
    let data = [];
    for (let j = 0; j < 4; j++) {
        data.push(elementArray[indexOfArray++]);
    }
    gameElementArray.push(data);
}
if (isSolvable(gameElementArray)) {
    console.log("is Solvable");
} else {
    console.log("Not Solvable");
    window.location.reload();
}



// check valid position for swapping

function validPosition(position1, rowPosition, position2) {
    let bottomElement, topElement;

    if (position1.parentNode.parentNode.nextElementSibling !== null) {
        bottomElement = position1.parentNode.parentNode.nextElementSibling.querySelector(`[pos='${rowPosition}']`);
    }
    if (position1.parentNode.parentNode.previousElementSibling !== null) {
        topElement = position1.parentNode.parentNode.previousElementSibling.querySelector(`[pos='${rowPosition}']`);
    }
    let leftElement = position1.parentNode.previousElementSibling;
    let rightElement = position1.parentNode.nextElementSibling;

    if (rightElement != null && position2 === rightElement.id ||
        leftElement != null && position2 === leftElement.id ||
        topElement != null && position2 === topElement.id ||
        bottomElement != null && position2 === bottomElement.id) {

        return true;
    }
}



// to check if game is solvable or not

function isSolvable(puzzle) {
    let N = puzzle.length;
    let invCount = getInvCount(puzzle);

    let pos = findXPosition(puzzle);
    if (pos && 1)
        return !(invCount && 1);
    else
        return invCount && 1;
}

function getInvCount(arr) {
    let inv_count = 0;
    let N = arr.length;
    for (let i = 0; i < N * N - 1; i++) {
        for (let j = i + 1; j < N * N; j++) {
            if (arr[j] && arr[i] && arr[i] > arr[j]) {
                inv_count++;
            }
        }
    }
    return inv_count;
}

function findXPosition(puzzle) {
    let N = puzzle.length;
    for (let i = N - 1; i >= 0; i--) {
        for (let j = N - 1; j >= 0; j--) {
            if (puzzle[i][j] == 0) {
                return N - i;
            }
        }
    }
}
