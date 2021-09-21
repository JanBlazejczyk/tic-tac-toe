/*
PLAYERS MODULE:
Module handling all player related stuff
- holds the players object which stores player names and an active player sign
- binds the names players typed in with their marks when the play button is clicked
- clears the player names input fields when the start screen is shown again
- clears the player names in the players object when the new game starts
- checks if the player names input fields are not empty before allowing the game board to be shown
- handles displaying an active player's name below the game board
*/
const PlayersModule = (() => {

    // define the players object
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

    // sets new names based on the value of the input fields
    const _setNameO = () => {
        players.PlayerO = playerOInput.value;
    };

    const _setNameX = () => {
        players.PlayerX = playerXInput.value;
    };

    // bind the names players typed in with their marks - used when play button is clicked
    const _getPlayers = () => {
        _clearPlayerNames();
        _setNameX();
        _setNameO();
    };

    // clear the input fields
    const clearPlayerNameInput = () => {
        playerOInput.value = "";
        playerXInput.value = "";
    }

    // reset the player names in players object
    const _clearPlayerNames = () => {
        players.PlayerO = "";
        players.PlayerX = "";
    };

    // checks if the player names input fields are not empty
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

    // toggle the active player in players object
    const _activePlayer = () => {
        if (players.ActivePlayer === "x") {
            players.ActivePlayer = "o";
        }
        else {
            players.ActivePlayer = "x";
        }
    };

    // display active player's name on the screen

    const displayPlayer = () => {
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
    // each time the play button is clicked player names are assigned in the players object
    playButton.addEventListener("click", _getPlayers);

    // return public methods and objects
    return {
        players,
        // used by GameBoardModule._updateBoard
        displayPlayer,
        // used by ShowPagesModule.showGamePage()
        checkInput,
        clearPlayerNameInput,
    };
})();


/*
GAMEBOARD MODULE:
Module handling stuff connected with the game board display and game logic
- updates the gameBoard object when the move is made
- resets the gameboard object
- displays the board on the screen
- counts the number of moves that are already made
- checks if the game is supposed to end after each move
- get's the message that is supposed to be displayed in the result screen
- displays the final message on the result screen 
*/
const GameBoardModule = (() => {

    // define the board object
    gameBoard = {
        0: "", 1: "", 2: "",
        3: "", 4: "", 5: "",
        6: "", 7: "", 8: "",
    }

    // cache DOM
    const gameBoardSquares = document.querySelectorAll(".game-screen__board-square");
    const resultMessageDiv = document.querySelector(".result-screen__result");
    const iconOTemplate = `<i class="far fa-circle game-screen__icon"></i>`;
    const iconXTemplate = `<i class="fas fa-times game-screen__icon"></i>`;
    const resultIconDiv = document.querySelector(".result-screen__icon-container");

    // update the gameboard object
    const _updateBoard = (event) => {
        // get an active's player mark
        let activePlayerMark = PlayersModule.players.ActivePlayer;
        // figure out which square was clicked
        let clickedSquareNum = event.target.id;
        // update the gameBoard object with correct mark
        // but only if the move is legal (this board square is empty)
        if (gameBoard[clickedSquareNum] === "") {
            gameBoard[clickedSquareNum] = activePlayerMark;
            PlayersModule.displayPlayer();
        }
    };

    // remove all the player marks from the gameBoard object
    const clearBoard = () => {
        for (let square in gameBoard) {
            gameBoard[square] = "";
        }
    }

    // display the board based on the current state of the gameBoard object 
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

    // return the number of marks present on the board
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

    // return the result message (who won the game or is it a draw)
    const _getResultMessage = (event) => {
        // get the result object
        let result = endGame(event);
        let resultMessage = "";
        if (result.draw !== false) {
            resultMessage = "DRAW GAME!"
        }
        else if (result.winner !== false) {
            if (result.winner === "x") {
                resultMessage = `${PlayersModule.players.PlayerX} won!`;
            }
            else if (result.winner === "o") {
                resultMessage = `${PlayersModule.players.PlayerO} won!`;
            }
        }
        return resultMessage;
    }

    // display the result message in the result screen 
    const displayResultMessage = (event) => {
        let iconOTemplate = `<i class="far fa-circle game-screen__icon"></i>`;
        let iconXTemplate = `<i class="fas fa-times game-screen__icon"></i>`;
        let winIcon = ``;
        let message = _getResultMessage(event);
        resultMessageDiv.innerHTML = message;

        let result = endGame(event);
        if (result.winner === "x") {
            winIcon = iconXTemplate;
            resultIconDiv.innerHTML = winIcon;
        }
        else if (result.winner === "o") {
            winIcon = iconOTemplate;
            resultIconDiv.innerHTML = winIcon;
        }
        else if (result.draw !== false) {
            resultIconDiv.innerHTML = `${iconXTemplate} – ${iconOTemplate}`;
        }

    }

    // check if the game has ended
    // returns an object indicating the final result - draw or the winning players mark
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
        // get the number of marks that are already present on the board after the move is made
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
        // game can't end if there are less than 5 marks on the board
        if (moveNum <= 4) {
            result = {
                draw: false,
                winner: false,
            }
            return result;
        }

        // if there are four marks on the board (two of each player's, winning becomes possible)
        // start checking conditions
        else if (moveNum > 4) {
            // create an array of possible win combos based on the last move
            let possibleCombos = winnerCombos.filter(comboArray => comboArray.includes(clickedSquareNum));
            // check each of the possible combos
            for (let comboArray of possibleCombos) {
                // for every board square of the combo check if it has last moving player's mark
                let marksInCombo = 0;
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
                        return result;
                    }

                };
            };
            // if we went through all the combos - no one has won yet
            // check for possible draw:
            // return draw false if there are still free spaces on the board
            if (moveNum !== 9) {
                result = {
                    winner: false,
                    draw: false,
                }
                return result;
            }
            // return draw true if there are no free spaces left on the board
            else {
                result = {
                    winner: false,
                    draw: true,
                }
                return result;
            }
        }
    };

    // bind events
    // each time the move is made:
    // update the board and change the active player 
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", _updateBoard));
    // check if the previous player's move was the winning one or the last one
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", endGame));
    // render the new board
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", renderBoard));

    // return public methods
    return {
        //used by ShowPagesModule.showGamePage()
        renderBoard,
        clearBoard,
        //used by ShowPagesModule.showResultPage()
        endGame,
        displayResultMessage,
    }
})();


/*
SHOW PAGES MODULE:
Module handeling the display of the screens: start screen, game screen and result screen
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
    const iconXTemplate = `<i class="fas fa-times game-screen__icon"></i>`;
    const gameBoardSquares = document.querySelectorAll(".game-screen__board-square");

    // show start page
    const showStartPage = () => {
        // each time the page is showed, clear the input fields
        PlayersModule.clearPlayerNameInput();
        // only the start page is visible
        startPage.classList.remove("start-screen__hidden");
        gamePage.classList.add("game-screen__hidden");
        resultPage.classList.add("result-screen__hidden");
    };

    // show start page
    const showGamePage = () => {
        // only show the game screen when both of the players typed in their names
        if (PlayersModule.checkInput()) {
            startPage.classList.add("start-screen__hidden");
            gamePage.classList.remove("game-screen__hidden");
            resultPage.classList.add("result-screen__hidden");

            // player x always go first so this is the initial value
            playerName.innerHTML = PlayersModule.players.PlayerX + "'s";
            playerIconContainer.innerHTML = iconXTemplate;
            PlayersModule.players.ActivePlayer = "x";

            // board needs to be cleared
            GameBoardModule.clearBoard();
            GameBoardModule.renderBoard();
        }
    };

    // show result page
    const showResultPage = (event) => {
        // display the message based on the result of the game
        let result = GameBoardModule.endGame(event);
        GameBoardModule.displayResultMessage(event);
        // only show the screen if the game has ended
        if (result.winner !== false || result.draw !== false) {
            startPage.classList.add("start-screen__hidden");
            gamePage.classList.add("game-screen__hidden");
            resultPage.classList.remove("result-screen__hidden");
        }
    };

    // bind events
    // play and retry buttons both show the game screen
    playButton.addEventListener("click", showGamePage);
    retryButton.addEventListener("click", showGamePage);

    // new game button shows the start screen
    newGameButton.addEventListener("click", showStartPage);

    // show result page when the game ends
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", showResultPage));
})();