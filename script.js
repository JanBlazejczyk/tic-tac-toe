/*
PLAYERS MODULE:
module that binds the names players typed in with their marks when the play button is clicked

- activePlayer()
switch player moves (marks are different) - public method to be used by Players.displayPlayer and GameBoard.updateBoard()
will fire each time that the board get's updated

- displayPlayer()
display which player is about to move - public method
add a name in the bottom caption and corresponding icon below
*/
const PlayersModule = (() => {
    // initialize an object to return
    const playerNames = {
        "PlayerX": "",
        "PlayerO": "",
        "ActivePlayer": "x",
    }

    // cache DOM
    const playerXInput = document.querySelector(".start-screen__input--X");
    const playerOInput = document.querySelector(".start-screen__input--O");
    const playButton = document.querySelector(".start-screen__btn");

    // define methods
    const _setNameO = () => {
        playerNames.PlayerO = playerOInput.value;
    };

    const _setNameX = () => {
        playerNames.PlayerX = playerXInput.value;
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
        console.log("Runs!");
        // clears the previous names
        clearPlayerNames();
        // sets new names based on the value of the input fields
        _setNameX();
        _setNameO();
        // clears the input fields
        // _clearPlayerNameInput();
        // returns the object with player names
        return playerNames;
    };

    // will be used later with the new game button
    const clearPlayerNames = () => {
        playerNames.PlayerO = "";
        playerNames.PlayerX = "";
    };

    // bind events
    playButton.addEventListener("click", getPlayers);
    // use the clear player names with the new game button


    return {
        getPlayers,
        clearPlayerNames,
        playerNames,
        checkInput,
        clearPlayerNameInput
    };
})();


/*
GAMEBOARD MODULE:
- renderBoard()
renders the board based on the state of the board array / object - public method that will use the update board
runs each time player makes a move

- updateBoard() - will need an active player function
adds marks to the board array / object - needs the information on which mark is the active player
runs each time player makes a move

- hoverIcons()
public method that will listen to mouseenter events to give icons hoover class and mouse leave to remove it

- checkMove()
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


/*
SHOW PAGES MODULE:
a module with methods for adding and removing the classes responsible for the visibility of the screens
*/

const showPagesModule = (() => {
    // cache DOM
    const startPage = document.querySelector(".start-screen");
    const gamePage = document.querySelector(".game-screen");
    const resultPage = document.querySelector(".result-screen");
    const playButton = document.querySelector(".start-screen__btn");
    const newGameButton = document.querySelector(".result-screen__btn--new-game");
    const retryButton = document.querySelector(".result-screen__btn--retry");

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