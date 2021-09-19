/*
PLAYERS MODULE:
module that binds the names players typed in with their marks when the play button is clicked
*/
const PlayersModule = (() => {
    // initialize an object to return
    const players = {
        "PlayerX": "",
        "PlayerO": "",
        "ActivePlayer": "x",
    }

    // cache DOM
    const playerXInput = document.querySelector(".start-screen__input--X");
    const playerOInput = document.querySelector(".start-screen__input--O");
    const playButton = document.querySelector(".start-screen__btn");
    const playerName = document.querySelector(".game-screen__player-name");
    const playerIconContainer = document.querySelector(".game-screen__player-icon");
    const iconOTemplate = `<i class="far fa-circle game-screen__icon"></i>`;
    const iconXTemplate = `<i class="fas fa-times game-screen__icon"></i>`;

    // define methods
    const _setNameO = () => {
        players.PlayerO = playerOInput.value;
    };

    const _setNameX = () => {
        players.PlayerX = playerXInput.value;
    };

    // this will be used at the later stages
    const clearPlayerNameInput = () => {
        playerOInput.value = "";
        playerXInput.value = "";
    }

    const checkInput = () => {
        if (playerOInput.value === "" && playerXInput.value === "") {
            playerOInput.classList.add("start-screen__input--warning");
            playerXInput.classList.add("start-screen__input--warning");
            return false
        }

        else if (playerOInput.value === "" && playerXInput.value !== "") {
            playerOInput.classList.add("start-screen__input--warning");
            playerXInput.classList.remove("start-screen__input--warning");
            return false
        }
        else if (playerXInput.value === "" && playerOInput.value !== "") {
            playerXInput.classList.add("start-screen__input--warning");
            playerOInput.classList.remove("start-screen__input--warning");
            return false
        }
        return true;
    };

    const getPlayers = () => {
        // clears the previous names
        clearPlayerNames();
        // sets new names based on the value of the input fields
        _setNameX();
        _setNameO();
        // returns the object with player names
        return players;
    };

    // will be used later with the new game button
    const clearPlayerNames = () => {
        players.PlayerO = "";
        players.PlayerX = "";
    };


    const _activePlayer = () => {
        if (players.ActivePlayer === "x") {
            players.ActivePlayer = "o";
        }
        else {
            players.ActivePlayer = "x";
        }
    };

    const displayPlayer = () => {
        // change active player
        _activePlayer();
        playerName.innerHTML = "";
        if (players.ActivePlayer === "x") {
            playerName.innerHTML = players.PlayerX + "'s";
            playerIconContainer.innerHTML = iconXTemplate;
        }
        else if (players.ActivePlayer === "o") {
            playerName.innerHTML = players.PlayerO + "'s";
            playerIconContainer.innerHTML = iconOTemplate;
        }

    }

    // bind events
    playButton.addEventListener("click", getPlayers);
    // each time the boardsquare is clicked display the active player's move
    // use the clear player names with the new game button


    return {
        displayPlayer,
        getPlayers,
        clearPlayerNames,
        players,
        checkInput,
        clearPlayerNameInput
    };
})();


/*
GAMEBOARD MODULE:
DONE! - renderBoard()
renders the board based on the state of the board array / object - public method that will use the update board
runs each time player makes a move

DONE! updateBoard() - will need an active player function
adds marks to the board array / object - needs the information on which mark is the active player
runs each time player makes a move

DONE! checkMove()
check if the move is legal - private method that the update board array will use
runs each time the player clicks on the board

- endGame()
check if the game has ended - private method: will be used by check result
will run after every move and return true or false

- gameResult()
check game result: public method: will be used to display the result

- clearboard()
- clear the board array - public method: for sure the game module will need it

- displayResult()
display the final message with the player's name - public method
*/
const GameBoardModule = (() => {
    // cache DOM
    const gameBoardSquares = document.querySelectorAll(".game-screen__board-square");
    const iconOTemplate = `<i class="far fa-circle game-screen__icon"></i>`;
    const iconXTemplate = `<i class="fas fa-times game-screen__icon"></i>`;

    // define the board object
    gameBoard = {
        0: "", 1: "", 2: "",
        3: "", 4: "", 5: "",
        6: "", 7: "", 8: "",
    }

    // define methods
    const _updateBoard = (event) => {
        // based on an active player when the user clicks on the square
        // change the state of the board object accordingly

        // get an active's player mark
        let activePlayerMark = PlayersModule.players.ActivePlayer
        // figure out which square was clicked
        let clickedSquareNum = event.target.id;
        // get the square id and store it
        // update the gameBoard.id with correct mark
        if (gameBoard[clickedSquareNum] === "") {
            gameBoard[clickedSquareNum] = activePlayerMark;
            PlayersModule.displayPlayer();
            // should be called somehow in the render method but only if the move is legal

        }
    };

    const renderBoard = () => {

        for (i = 0; i <= 8; i++) {
            let boardSquareDiv = document.querySelector(`.game-screen__board-square--${i}`);
            let boardObjectRepresentation = gameBoard[i];
            if (boardObjectRepresentation === "") {
                boardSquareDiv.innerHTML = "";
            }
            else if (boardObjectRepresentation === "x") {
                boardSquareDiv.innerHTML = iconXTemplate;
            }
            else if (boardObjectRepresentation === "o") {
                boardSquareDiv.innerHTML = iconOTemplate;
            }
        }

    }

    // returns the number of marks present on the board
    const _numOfMarksOnBoard = () => {
        let moveNum = 0;
        const boardSquares = Object.values(gameBoard);
        boardSquares.forEach((square) => {
            if (square !== "") {
                moveNum++;
            }
        });
        return moveNum;
    }

    const endGame = (event) => {
        // identify the possible combos winning the game
        const winnerCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        // get the number of marks that are present on the board after the move is made
        let moveNum = _numOfMarksOnBoard();
        // get an active's player mark
        let activePlayerMark = PlayersModule.players.ActivePlayer;
        // if active player is x this means that o last moved and vice versa
        // figure out who moved last
        let lastMoved = null;
        if (activePlayerMark === "x") {
            lastMoved = "o";
        }
        else if (activePlayerMark === "o") {
            lastMoved = "x";
        }
        // figure out which square was the last move
        let clickedSquareNum = Number(event.target.id);
        // if there are four marks on the board (two of each player's, winning becomes possible)
        // start checking conditions
        if (moveNum > 4) {
            // create an array of possible win combos based on the last move
            let possibleCombos = winnerCombos.filter(comboArray => comboArray.includes(clickedSquareNum));
            // check each of the possible combos
            for (let comboArray of possibleCombos) {
                // check if the player who just moved has his mark on every position from the given combo
                let marksInCombo = 0;
                // for every board square of the combo check if it has last moving player's mark
                for (let squareNum of comboArray) {

                    // if any of the combo squares does not contain the given mark move to the next combo
                    if (gameBoard[squareNum] !== lastMoved) {
                        break;
                    }
                    // if the square contains the mark then increment marksInCombo 
                    else {
                        marksInCombo++;
                    }
                    // if the combo has 3 marks then last moving player has won
                    if (marksInCombo === 3) {
                        result = {
                            winner: lastMoved,
                            draw: false,
                        }
                        console.log(result);
                        return result;
                    }

                };
            };
            // if we went through all the combos and there is no winner
            // return draw false if there are still free spaces on the board
            if (moveNum !== 9) {
                result = {
                    winner: false,
                    draw: false,
                }
                console.log(result);
                return result;
            }
            // return draw if there are no free spaces on the board
            else {
                result = {
                    winner: false,
                    draw: true,
                }
                console.log(result);
                return result;
            }
        }
    };




    // bind events
    // updates the board and changes the active player
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", _updateBoard));

    // HERE CHECK IF THE GAME HAS ENDED
    // checks if the previous player's move was the winning one or the last one
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", endGame));

    // renders the new board
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", renderBoard));



    // return public methods
    return {
        renderBoard,
    }
})();





/*
SHOW PAGES MODULE:
a module with methods for adding and removing the classes responsible for the visibility of the screens
*/

const ShowPagesModule = (() => {
    // cache DOM
    const startPage = document.querySelector(".start-screen");
    const gamePage = document.querySelector(".game-screen");
    const resultPage = document.querySelector(".result-screen");
    const playButton = document.querySelector(".start-screen__btn");
    const newGameButton = document.querySelector(".result-screen__btn--new-game");
    const retryButton = document.querySelector(".result-screen__btn--retry");
    const playerName = document.querySelector(".game-screen__player-name");
    const playerIconContainer = document.querySelector(".game-screen__player-icon");
    const iconOTemplate = `<i class="far fa-circle game-screen__icon"></i>`;
    const iconXTemplate = `<i class="fas fa-times game-screen__icon"></i>`;

    // define methods
    const showStartPage = () => {
        // only the start page is visible
        PlayersModule.clearPlayerNameInput();
        PlayersModule.clearPlayerNames();
        startPage.classList.remove("start-screen__hidden");
        gamePage.classList.add("game-screen__hidden");
        resultPage.classList.add("result-screen__hidden");
    };

    const showGamePage = () => {
        // only show the game screen when both of the players typed in their names
        if (PlayersModule.checkInput()) {
            startPage.classList.add("start-screen__hidden");
            gamePage.classList.remove("game-screen__hidden");
            resultPage.classList.add("result-screen__hidden");

            // player x always go first so this is the initial value
            playerName.innerHTML = PlayersModule.players.PlayerX + "'s";
            playerIconContainer.innerHTML = iconXTemplate;
        }

    };

    const showResultPage = () => {
        startPage.classList.add("start-screen__hidden");
        gamePage.classList.add("game-screen__hidden");
        resultPage.classList.remove("result-screen__hidden");
    };


    // bind events
    playButton.addEventListener("click", showGamePage);
    // this button also needs to clear the board object
    retryButton.addEventListener("click", showGamePage);
    // this button also needs to clear the board object
    newGameButton.addEventListener("click", showStartPage);

    return {
        showStartPage,
        showGamePage,
        showResultPage,
    }
})();