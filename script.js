
console.log("Script works!")
const header = document.querySelector(".display-templates");
const startScreen = document.getElementById("start-screen-template");
const content = startScreen.content;
// header.appendChild(content);

const main = document.querySelector(".display-templates");
const gameHTML = document.getElementById("game-screen-template");
const gameScreenContent = gameHTML.content;
main.appendChild(gameScreenContent);