const placeholder = document.querySelector(".container");
const startScreenTemplate = document.querySelector("#start-screen-template").content;
const gameScreenTemplate = document.querySelector("#game-screen-template").content;
const resultScreenTemplate = document.querySelector("#result-screen-template").content;


placeholder.appendChild(startScreenTemplate);
// placeholder.appendChild(gameScreenTemplate);
// placeholder.appendChild(resultScreenTemplate);

/*
Each:
- cacheDom: catch the dom elements as variables
- bindEvents: event listeners with their functions
- render
*/

/*
PLAYER MODULE:
module that binds the names players typed in with their marks when the play button is clicked
*/
const Players = (() => {
    // initialize an object to return
    const playerNames = {
        "PlayerX": "",
        "PlayerO": "",
    }

    // cache DOM
    const playerXInput = document.querySelector(".start-screen__input--X");
    const playerOInput = document.querySelector(".start-screen__input--O");
    const playButton = document.querySelector(".start-screen__btn");

    // methods
    const _setNameO = () => {
        playerNames.PlayerO = playerOInput.value;
    };

    const _setNameX = () => {
        playerNames.PlayerX = playerXInput.value;
    };

    const _clearPlayerNameInput = () => {
        playerOInput.value = "";
        playerXInput.value = "";
    }

    const getPlayers = () => {
        console.log("Runs!");
        // clears the previous names
        clearPlayerNames();
        // sets new names based on the value of the input fields
        _setNameX();
        _setNameO();
        // clears the input fields
        _clearPlayerNameInput();
        // returns the object with player names
        return playerNames;
    };

    // will be used later with the retry button
    const clearPlayerNames = () => {
        playerNames.PlayerO = "";
        playerNames.PlayerX = "";
    };

    // bind events
    playButton.addEventListener("click", getPlayers);

    return {
        getPlayers,
        clearPlayerNames,
        playerNames,
    };

})();


/*
GAMEBOARD MODULE:
- renderBoard()
renders the board based on the state of the board array / object - public method that will use the update board
runs each time player makes a move

- activePlayer()
switch player moves (marks are different) - private method to be used by display player
will fire each time that the board get's updated

- updateBoard()
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
*/


/*
GAME MODULE:
- renderPlayer()
display which player is about to move - public method

- renderStartPage()
render the start page - public method

- renderGamePage()
render game page with an empty board - public method

- renderResultPage()
render result page - public method

- displayResult()
display the final message with the player's name - public method

GAME IFFY:
function that will handle everything
*/

