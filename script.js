let rowCount
let colCount
let cellWidth
let cellHeight
let isStarted = false
let indexes = []
let mineIndexes = []
let mineCount
let cellType = ""
let level = "easy"
let time = 0
let gameTimer
let isQuestionModalClicked = false
let isLanguageTR = false

const mainDiv = document.getElementById("mainDiv")
const mineCountSpan = document.getElementById("mineCountSpan")
const levelSelect = document.getElementById("levels")
const timerSpan = document.getElementById("timerSpan")
timerSpan.textContent = time
const qMark = document.getElementById("qMark")
const questionModal = document.getElementById("questionModal")
const closeModal = document.getElementById("closeModal")
const language = document.getElementById("language")
const h3 = document.getElementById("h3")
const pModalTR = document.getElementById("pModalTR")
const pModalEN = document.getElementById("pModalEN")
pModalTR.style.display = "none"
pModalEN.style.display = "block"
const gameModal = document.getElementById("gameModal")
const gameWinModal = document.getElementById("gameWinModal")
const gameLoseModal = document.getElementById("gameLoseModal")
const closeGameModal = document.getElementById("closeGameModal")
const gameModalTime = document.getElementById("gameModalTime")
const gameLoseModalHeader = document.getElementById("gameLoseModalHeader")
const gameWinModalHeader = document.getElementById("gameWinModalHeader")
const startBtn = document.getElementById("startDiv")
const restartBtn = document.getElementById("restartBtn")

qMark.addEventListener("click", () => {
    toggleModal();
});

closeGameModal.addEventListener("click", () => {
    gameModal.style.display = "none"
})

closeModal.addEventListener("click", () => {
    toggleModal();
});

function toggleModal() {
    isQuestionModalClicked = !isQuestionModalClicked;
    questionModal.style.display = isQuestionModalClicked ? "block" : "none";
}

restartBtn.addEventListener("click", () => {
    resetGame()
})

function resetGame() {
    clearInterval(gameTimer);
    time = 0;
    timerSpan.textContent = "0";
    mineCount = 0;
    mineCountSpan.textContent = mineCount;
    isStarted = false;
    gameModal.style.display = "none"
    clearBoard();
    prepareForNewGame();
    console.log("prepare fonk. bitti")
    startBtnClicked = true
    if (startBtnClicked) {
        demoImg.remove()
        mainDiv.style.width = "auto"
        time = 0

        const cells = document.querySelectorAll(".cell")
        cells.forEach((cell, index) => {
            cell.style.width = cellWidth
            cell.style.height = cellHeight

            cell.addEventListener("click", () => {

                const i = Math.floor(index / colCount)
                const j = index % colCount

                if (!isStarted) {
                    cellType = "empty"
                    cell.setAttribute("data-cell-type", cellType)
                    cell.classList.add("emptyCell")

                    let firstClickedIndex = [i, j]

                    getMines(firstClickedIndex)
                    putMines()
                    getMineCounts()
                    gameTimer = setInterval(Time, 1000)
                    isStarted = true
                    cell.innerHTML = ""
                }
                else {
                    if (!cell.classList.contains("mineCell")) {
                        const cellMineCount = parseInt(cell.getAttribute("data-mine-count"));
                        if (cell.classList.contains("numCell") && cell.textContent === "") {
                            cell.textContent = cellMineCount.toString();
                        }
                        const celldataType = cell.getAttribute("data-cell-type")

                        if (celldataType === "empty") {
                            cell.classList.add("emptyCell")
                        }

                        if (celldataType === "empty") {
                            cellType = "empty"
                            cell.setAttribute("data-cell-type", cellType)
                            cell.classList.add("emptyCell")
                            cell.innerHTML = ""
                        }

                        if ((cellMineCount > 0)) {
                            cellType = "num"
                            cell.setAttribute("data-cell-type", cellType)
                            cell.innerHTML = cellMineCount;
                            cell.classList.add("numCell")
                        }

                        if (celldataType === "mine") {
                            cell.classList.add("mineCell")
                            cell.innerHTML = ""
                            cellType = "mine"
                            cell.setAttribute("data-cell-type", cellType)
                            gameModal.style.display = "block"
                            gameLoseModal.style.display = "flex"
                            showAllMines(cells)
                            clearInterval(gameTimer)
                        }
                    }
                }
            })

            cell.addEventListener("contextmenu", (event) => {

                if (isStarted) {
                    const cellMineCount = parseInt(cell.getAttribute("data-mine-count"));
                    const celldataType = cell.getAttribute("data-cell-type")
                    event.preventDefault();

                    if (!cell.classList.contains("mineCell")) {

                        if (!(cell.classList.contains("numCell") && celldataType === "num") &&
                            !(cell.classList.contains("emptyCell") && celldataType === "empty")) {
                            cell.classList.add("mineCell")
                            cell.innerHTML = ""
                            mineCount -= 1;
                            mineCountSpan.textContent = mineCount;
                        }
                    }
                    else {

                        if (cellMineCount > 0) {
                            cellType = "num"
                        }

                        else if (celldataType === "mine" && cell.classList.contains("mineCell")) {
                            cellType = "mine"
                        }

                        else if (cellMineCount === 0 && celldataType === "mine") {
                            cellType = "empty"
                        }

                        else if (cellMineCount === 0 && celldataType === "empty") {
                            cellType = "empty"
                        }
                        cell.classList.remove("mineCell")
                        cell.setAttribute("data-cell-type", cellType)
                        mineCount += 1
                        mineCountSpan.textContent = mineCount
                    }
                }
            });
        });

    } else {
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            cell.classList.remove("cell")
            cell.remove()
        });
        colCount = 0
        rowCount = 0
        mineCount = 0
        mineIndexes.length = 0
        mainDiv.style.gridTemplateColumns = `none`;
        mainDiv.style.gridTemplateRows = `none`;
        mainDiv.appendChild(demoImg)
        demoImg.src = "./assets/demo.png"
        mineCountSpan.textContent = "0"
        clearInterval(gameTimer)
        timerSpan.textContent = "0"
        levelSelect.value = "easy"
        isStarted = false
        gameModal.style.display = "none"
        mainDiv.style.width = "440px"
    }
    startBtnClicked = !startBtnClicked
    startImg.src = startBtnClicked ? "./assets/start.svg" : "./assets/close.svg"

    // İhtiyaca göre diğer sıfırlama işlemleri ekleyebilirsiniz
}

function clearBoard() {
    mineIndexes.length = 0;
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.classList.remove("cell", "emptyCell", "numCell", "mineCell", "wrongeCell");
        cell.innerHTML = "";
        cell.remove()
        // İhtiyaca göre diğer hücre sıfırlama işlemleri ekleyebilirsiniz
    });

    mainDiv.style.gridTemplateColumns = "none";
    mainDiv.style.gridTemplateRows = "none";
}
function prepareForNewGame() {
 
    level = levelSelect.value
    switch (level) {
        case "easy":
            colCount = 10
            rowCount = 10
            mineCount = 10
            cellWidth = "40px"
            cellHeight = "40px"
            break;
        case "middle":
            colCount = 18
            rowCount = 14
            mineCount = 40
            cellWidth = "35px"
            cellHeight = "35px"
            break;
        case "hard":
            colCount = 24
            rowCount = 20
            mineCount = 99
            cellWidth = "30px"
            cellHeight = "30px"
            break;

        default:
            colCount = 10
            rowCount = 10
            mineCount = 10
            cellWidth = "40px"
            cellHeight = "40px"
            break;
    }
    indexes = [];
    mineIndexes = [];
    isStarted = false;
    time = 0;
    mineCountSpan.textContent = "0";
    timerSpan.textContent = "0";
    startBtnClicked = true;

    mainDiv.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
    mainDiv.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
    mineCountSpan.textContent = mineCount
    getBoard()
    console.log("prepare fonk . çalıştı")
    // Ekranı temizledikten sonra gerektiğinde başka başlangıç durumu ayarlamaları yapabilirsin
}


const languageData = {
    tr: {
        buttonText: "EN",
        headerText: "Nasıl Oynanır?",
        modalDisplayTR: "block",
        modalDisplayEN: "none",
        selectOptions: "<option value='easy'>Kolay</option> <br> <option value='middle'>Orta</option> <br> <option value='hard'>Zor</option>",
        gameLoseModalHeader: "Üzgünüz kaybettiniz!!!",
        gameWinModalHeader: "Tebrikler kazandınız!!!"
    },
    en: {
        buttonText: "TR",
        headerText: "How to Play?",
        modalDisplayTR: "none",
        modalDisplayEN: "block",
        selectOptions: "<option value='easy'>Easy</option> <br> <option value='middle'>Middle</option> <br> <option value='hard'>Hard</option>",
        gameLoseModalHeader: "We're sorry, you lost!!!",
        gameWinModalHeader: "Congratulations, you won!!!"
    }
};

language.addEventListener("click", () => {
    const currentLanguage = isLanguageTR ? "en" : "tr";
    const data = languageData[currentLanguage];

    language.textContent = data.buttonText;
    h3.textContent = data.headerText;
    pModalTR.style.display = data.modalDisplayTR;
    pModalEN.style.display = data.modalDisplayEN;
    levelSelect.innerHTML = data.selectOptions
    gameLoseModalHeader.textContent = data.gameLoseModalHeader
    gameWinModalHeader.textContent = data.gameWinModalHeader

    isLanguageTR = !isLanguageTR;
});

let startBtnClicked = true
const startImg = document.getElementById("startImg")
const demoImg = document.getElementById("demoImg")
startBtn.addEventListener("click", () => {
    if (startBtnClicked) {
        demoImg.remove()
        mainDiv.style.width = "auto"
        time = 0

        level = levelSelect.value
        switch (level) {
            case "easy":
                colCount = 10
                rowCount = 10
                mineCount = 10
                cellWidth = "40px"
                cellHeight = "40px"
                break;
            case "middle":
                colCount = 18
                rowCount = 14
                mineCount = 40
                cellWidth = "35px"
                cellHeight = "35px"
                break;
            case "hard":
                colCount = 24
                rowCount = 20
                mineCount = 99
                cellWidth = "30px"
                cellHeight = "30px"
                break;

            default:
                colCount = 10
                rowCount = 10
                mineCount = 10
                cellWidth = "40px"
                cellHeight = "40px"
                break;
        }

        mainDiv.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
        mainDiv.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
        mineCountSpan.textContent = mineCount
        getBoard()
        const cells = document.querySelectorAll(".cell")
        cells.forEach((cell, index) => {
            cell.style.width = cellWidth
            cell.style.height = cellHeight

            cell.addEventListener("click", () => {

                const i = Math.floor(index / colCount)
                const j = index % colCount

                if (!isStarted) {
                    cellType = "empty"
                    cell.setAttribute("data-cell-type", cellType)
                    cell.classList.add("emptyCell")

                    let firstClickedIndex = [i, j]

                    getMines(firstClickedIndex)
                    putMines()
                    getMineCounts()
                    gameTimer = setInterval(Time, 1000)
                    isStarted = true
                    cell.innerHTML = ""
                }
                else {
                    if (!cell.classList.contains("mineCell")) {
                        const cellMineCount = parseInt(cell.getAttribute("data-mine-count"));
                        if (cell.classList.contains("numCell") && cell.textContent === "") {
                            cell.textContent = cellMineCount.toString();
                        }
                        const celldataType = cell.getAttribute("data-cell-type")

                        if (celldataType === "empty") {
                            cell.classList.add("emptyCell")
                        }

                        if (celldataType === "empty") {
                            cellType = "empty"
                            cell.setAttribute("data-cell-type", cellType)
                            cell.classList.add("emptyCell")
                            cell.innerHTML = ""
                        }

                        if ((cellMineCount > 0)) {
                            cellType = "num"
                            cell.setAttribute("data-cell-type", cellType)
                            cell.innerHTML = cellMineCount;
                            cell.classList.add("numCell")
                        }

                        if (celldataType === "mine") {
                            cell.classList.add("mineCell")
                            cell.innerHTML = ""
                            cellType = "mine"
                            cell.setAttribute("data-cell-type", cellType)
                            gameModal.style.display = "block"
                            gameLoseModal.style.display = "flex"
                            gameWinModal.style.display="none"
                            showAllMines(cells)
                            clearInterval(gameTimer)
                        }
                    }
                }
            })

            cell.addEventListener("contextmenu", (event) => {

                if (isStarted) {
                    const cellMineCount = parseInt(cell.getAttribute("data-mine-count"));
                    const celldataType = cell.getAttribute("data-cell-type")
                    event.preventDefault();

                    if (!cell.classList.contains("mineCell")) {

                        if (!(cell.classList.contains("numCell") && celldataType === "num") &&
                            !(cell.classList.contains("emptyCell") && celldataType === "empty")) {
                            cell.classList.add("mineCell")
                            cell.innerHTML = ""
                            mineCount -= 1;
                            mineCountSpan.textContent = mineCount;
                        }
                    }
                    else {

                        if (cellMineCount > 0) {
                            cellType = "num"
                        }

                        else if (celldataType === "mine" && cell.classList.contains("mineCell")) {
                            cellType = "mine"
                        }

                        else if (cellMineCount === 0 && celldataType === "mine") {
                            cellType = "empty"
                        }

                        else if (cellMineCount === 0 && celldataType === "empty") {
                            cellType = "empty"
                        }
                        cell.classList.remove("mineCell")
                        cell.setAttribute("data-cell-type", cellType)
                        mineCount += 1
                        mineCountSpan.textContent = mineCount
                    }
                }
            });
        });

    } else {
        const cells = document.querySelectorAll(".cell")
        cells.forEach(cell => {
            cell.classList.remove("cell")
            cell.remove()
        });
        colCount = 0
        rowCount = 0
        mineCount = 0
        mineIndexes.length = 0
        mainDiv.style.gridTemplateColumns = `none`;
        mainDiv.style.gridTemplateRows = `none`;
        mainDiv.appendChild(demoImg)
        demoImg.src = "./assets/demo.png"
        mineCountSpan.textContent = "0"
        clearInterval(gameTimer)
        timerSpan.textContent = "0"
        levelSelect.value = "easy"
        isStarted = false
        gameModal.style.display = "none"
        mainDiv.style.width = "440px"
    }
    startBtnClicked = !startBtnClicked
    startImg.src = startBtnClicked ? "./assets/start.svg" : "./assets/close.svg"
})

console.log("mineCount:", mineCount)
console.log("indexes diszi:", indexes)
console.log("mineindexes dizisi", mineIndexes.sort())

function getBoard() {
    for (let i = 0; i < rowCount; i++) {
        indexes[i] = [];
        for (let j = 0; j < colCount; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            mainDiv.appendChild(cell);
            indexes[i][j] = [i, j];
        }
    }
    return indexes
};

function getMines(firstClickedIndex) {
    for (let i = 0; i < mineCount; i++) {
        let isSamemineIndex;
        do {
            let randomNumberI = Math.floor(Math.random() * rowCount)
            let randomNumberJ = Math.floor(Math.random() * colCount)
            let newMineIndex = [randomNumberI, randomNumberJ]

            isSamemineIndex = mineIndexes.some(index => index[0] === newMineIndex[0] && index[1] === newMineIndex[1])
                || (newMineIndex[0] === firstClickedIndex[0] && newMineIndex[1] === firstClickedIndex[1])

            if (!isSamemineIndex) {
                mineIndexes.push(newMineIndex)
            }
        } while (isSamemineIndex)
    }
    return mineIndexes
}

function putMines() {
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            let isMine = mineIndexes.some(mineIndex => mineIndex[0] === indexes[i][j][0] && mineIndex[1] === indexes[i][j][1]);
            const cell = document.getElementById("mainDiv").children[i * colCount + j];

            if (isMine) {
                cellType = "mine"
                cell.setAttribute("data-cell-type", cellType)
            }
        }
    }
}

function getMineCounts() {
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            let cellMineCount = 0;
            const cell = document.getElementById("mainDiv").children[i * colCount + j];

            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const neighborI = i + x;
                    const neighborJ = j + y;

                    if (neighborI >= 0 && neighborI < rowCount && neighborJ >= 0 && neighborJ < colCount) {
                        const neighborCell = document.getElementById("mainDiv").children[neighborI * colCount + neighborJ];
                        const celldataType = neighborCell.getAttribute("data-cell-type")
                        if (celldataType === "mine") {
                            cellMineCount += 1;
                        }
                    }
                }
            }
            const cellDataTypeIsMine = cell.getAttribute("data-cell-type")
            if (cellMineCount === 0) {
                cellType = "empty";
                cell.setAttribute("data-cell-type", cellType);
            }
            if (cellMineCount > 0 && cellDataTypeIsMine === "mine") {
                cellMineCount = 0
            }
            cell.setAttribute("data-mine-count", cellMineCount);
        }
    }
}

function showAllMines(cells) {
    cells.forEach(cell => {
        const celldataType = cell.getAttribute("data-cell-type")
        if (cell.classList.contains("mineCell") && celldataType != "mine") {
            cell.classList.remove("mineCell")
            cell.classList.add("wrongeCell")
        }
        cell.classList.remove("mineCell")
    })
    for (let i = 0; i < rowCount; i++) {
        for (let j = 0; j < colCount; j++) {
            let isMine = mineIndexes.some(mineIndex => mineIndex[0] === indexes[i][j][0] && mineIndex[1] === indexes[i][j][1]);
            const cell = document.getElementById("mainDiv").children[i * colCount + j];

            if (isMine) {
                cell.classList.add("mineCell")
            }
        }
    }
}

function Time() {
    time += 1
    timerSpan.textContent = time

    if (areAllMinesOpened()) {
        gameModal.style.display = "block"
        gameLoseModal.style.display="none"
        gameWinModal.style.display = "flex"
        gameModalTime.textContent = timerSpan.textContent
        clearInterval(gameTimer)
    }
}

function areAllMinesOpened() {
    // Tüm indekslere sahip olan hücrelerin mineCell class'ına sahip olup olmadığını kontrol et
    const isAllMinesOpened = mineIndexes.every(([rowIndex, colIndex]) => {
        const cell = document.getElementById("mainDiv").children[rowIndex * colCount + colIndex];
        return cell.classList.contains("mineCell");
    });
    return isAllMinesOpened;
}


//kodda tekrar eden yerleri düzenle yeni fonksiyonlar yaz 
//ekran boyutuna  göre media queryler yaz
//telefon ve tabletler için sol- sağ tıklamak için tasarım ve işlemleri ekle