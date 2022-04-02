/////// global variables
let gameRunning = false;

/////// localStorage
const local = {
    get history() {
        return JSON.parse(localStorage.getItem("history")) || []
    },
    set history(val) {
        localStorage.setItem("history", JSON.stringify(val))
    },
    addGame: function (game) {
        const temp = JSON.parse(localStorage.getItem("history")) || []
        temp.push(game)
        localStorage.setItem("history", JSON.stringify(temp))
    },
    get ids() {
        return JSON.parse(localStorage.getItem("ids")) || 0
    },
    set ids(val) {
        localStorage.setItem("ids", JSON.stringify(val))
    },
    updateIds: function () {
        localStorage.setItem("ids", (JSON.parse(localStorage.getItem("ids")) || 0) + 1)
    }
}

/////// start menu
const startMenuContainer = document.getElementsByClassName("start-menu")[0]
const gameContainer = document.getElementsByClassName("game")[0]
const historyConatainer = document.getElementsByClassName("history")[0]
const gameOverContainer = document.getElementsByClassName("game-over")[0]
console.log(gameOverContainer);
const menuForm = document.forms.menu
const forCloneTd = document.getElementsByClassName("for-clone")[0]
menuForm.addEventListener("click", function (event) {
    if (event.target.name === "newGame") {
        gameContainer.classList.remove("hide")
        startMenuContainer.classList.add("hide")
        startGame()
    } else if (event.target.name === "history") {
        historyConatainer.classList.remove("hide")
        startMenuContainer.classList.add("hide")
        local.history.forEach((item, index) => {
            const newRow = forCloneTd.cloneNode(true)
            newRow.classList.remove("hide")
            newRow.classList.remove("for-clone")
            const d = new Date(item.gameTime)
            const mins = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
            const secs = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()
            newRow.children[0].textContent = item.gameID
            newRow.children[1].textContent = mins + ":" + secs;
            historyConatainer.children[0].children[1].append(newRow)
        })
    }
})

////// game
let gameState = []
const gameCells = Array.from(document.querySelectorAll(".game td"))
let boxOpened = false;
let previousOpened = 0;
let couplesFound = 0;
let numbersShown = false;
let startEpoch = Date.now()
const currentGame = {
    gameID: 0,
    gameTime: 0
}
// debugger;
console.log(gameCells[0]);

function startGame() {
    currentGame.gameID = local.ids

    for (let i = 0; i < 16; i++) {
        let num = Math.round(Math.random() * 0.7 * 10 + 1)
        while (howManyHas(gameState, num) > 1) {
            num = Math.round(Math.random() * 0.7 * 10 + 1)
        }
        gameState.push(num)
        // gameCells[i].textContent = num
    }
    console.log(gameState);
    if (!numbersShown) {
        gameCells.forEach((elem, index) => {
            elem.textContent = gameState[index]
        });
        setTimeout(() => {
            gameCells.forEach((elem) => {
                elem.classList.add("rotate180")
                elem.textContent = ""
            });
            gameRunning = true;
            numbersShown = true;
        }, 5000);
    }
}

gameContainer.addEventListener("click", boxClickHandler);


function boxClickHandler(event) {
    let x = 0;
    let y = 0;
    let n = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gameCells[i * 4 + j] === event.target) {
                x = i;
                y = j;
                n = i * 4 + j;
            }
        }
    }
    if (gameRunning && numbersShown && event.target.tagName === "TD") {
        if (!boxOpened) {
            setTimeout(() => {
                event.target.textContent = gameState[n]
            }, 200);
            event.target.classList.remove("rotate180")
            previousOpened = n
            boxOpened = true;
        } else if (event.target !== gameCells[previousOpened]) {
            setTimeout(() => {
                event.target.textContent = gameState[n]
            }, 200);
            event.target.classList.remove("rotate180")
            if (gameState[n] !== gameState[previousOpened]) {
                gameRunning = false;
                setTimeout(() => {
                    gameCells[previousOpened].classList.add("rotate180")
                    gameCells[n].classList.add("rotate180")
                    gameCells[previousOpened].textContent = ""
                    gameCells[n].textContent = ""
                }, 1000);
                setTimeout(() => {
                    gameRunning = true;
                }, 1500);
            } else {
                couplesFound++;
                setTimeout(() => {
                    gameCells[previousOpened].classList.add("rotate90")
                    gameCells[n].classList.add("rotate90")
                }, 450);
                setTimeout(() => {
                    gameCells[previousOpened].textContent = ""
                    gameCells[n].textContent = ""
                }, 950);
                console.log(couplesFound);
            }
            boxOpened = false
        }
    }
    if (couplesFound === 8) {
        setTimeout(() => {
            currentGame.gameTime = Date.now() - startEpoch;
            local.updateIds()
            local.addGame(currentGame)
            gameRunning = false;
            gameOverContainer.classList.remove("hide")
            gameContainer.classList.add("hide")
            const newRow = forCloneTd.cloneNode(true)
            newRow.classList.remove("hide")
            newRow.classList.remove("for-clone")
            const d = new Date(currentGame.gameTime)
            const mins = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
            const secs = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()
            newRow.children[0].textContent = currentGame.gameID
            newRow.children[1].textContent = mins + ":" + secs;
            gameOverContainer.children[1].children[1].append(newRow)
            gameOverContainer.addEventListener("click", function (event) {
                gameOverContainer.classList.add("hide")
                startMenuContainer.classList.remove("hide")
                gameCells.forEach((elem) => {
                    elem.classList.remove("rotate90")
                })
            });
            resetGame()
        }, 500);
    }
}


////// other
function howManyHas(arr, val) {
    let n = 0;
    for (let i = 0; i < arr.length; i++) {
        if (val === arr[i]) {
            n++;
        }
    }
    return n;
}

function resetGame() {
    gameState = []
    boxOpened = false;
    previousOpened = 0;
    couplesFound = 0;
    numbersShown = false;
    startEpoch = Date.now()
    currentGame.gameID = 0;
    currentGame.gameTime = 0;
}