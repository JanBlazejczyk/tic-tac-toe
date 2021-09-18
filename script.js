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
        console.log(activePlayerMark);
        // figure out which square was clicked
        let clickedSquareNum = event.target.id;
        // get the square id and store it
        // update the gameBoard.id with correct mark
        if (gameBoard[clickedSquareNum] === "") {
            gameBoard[clickedSquareNum] = activePlayerMark;
            // only change the displayed player when the move is legal
            PlayersModule.displayPlayer();
        }

    };


    const renderBoard = (event) => {
        // update the board before rendering
        _updateBoard(event);
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

    // bind events
    // this needs to be one of the divs not the whole board!
    gameBoardSquares.forEach((boardSquare) => boardSquare.addEventListener("click", renderBoard))

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
    retryButton.addEventListener("click", showGamePage);
    newGameButton.addEventListener("click", showStartPage);

    return {
        showStartPage,
        showGamePage,
        showResultPage,
    }
})();