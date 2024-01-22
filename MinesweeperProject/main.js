const grid = document.querySelector(".grid");
let scoreCounter = document.querySelector("#scorePoints");
let playAgainButton = document.querySelector("#playAgainButton");
let restartButton = document.querySelector("#restartBtn");
let flagCounter = document.querySelector("#flagCounter");
let endGameScreen = document.querySelector("#endGameDiv");
let endGameText = document.querySelector("#endGameText");
let bombCount = document.querySelector("#bombCount");


 let audioPlayer = document.querySelector("#audioPlayer");
let muteButton = document.querySelector("#muteButton"); 



let width = 10;
let squares = [];

let bombAmount = 20;
let flags = 0;
let maxFlags = bombAmount;

let score = 0;
let maxScore = (width * width) - bombAmount;

let isGameOver = false;




//create the Board:
function createBoard() {
  //create bombs:
  const bombArray = Array(bombAmount).fill("bomb");
  const emptyArray = Array(width * width - bombAmount).fill("safeSquare");

  const gameArray = emptyArray.concat(bombArray);

  const shuffledArray = gameArray.sort(() => Math.random() - 0.5);
  console.log(shuffledArray);
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    square.setAttribute("id", i);
    square.classList.add(shuffledArray[i]); //classList property: represents the class attribute of an element, providing methods to add, remove, and toggle CSS classes. Its an interface to manipulate the classes of an HTML element. Here, shuffledArray is assumed to be a string representing a CSS class name. The classList.add() method is used to add the specified class to the square element. If the class is already present, it won't be added again. In the context of creating a grid of squares, it's common to use CSS classes to style different types of squares differently. For example, you might have classes like "bomb" for squares that represent bombs, "empty" for empty squares, or "number" for squares with a number indicating the number of neighboring bombs.
    grid.appendChild(square);
    squares.push(square);

    //Click Events:
    square.addEventListener("click", function (e) {
      click(square);
    });

    square.oncontextmenu = function(e) {
        e.preventDefault();
        if(flags !== maxFlags){

          addFlag(square);
          

        }
    }
  }
  


  //add numbers:
  for (let i = 0; i < squares.length; i++) {
    let total = 0;
    const isLeftEdge = i % width === 0;
    const isRightEdge = (i % width) === width -1;

    if (squares[i].classList.contains("safeSquare")) {
      if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) {
        total++;
      }
      if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) {
        total++;
      }
      if (i > 10 && squares[i - width].classList.contains("bomb")) {
        total++;
      }
      if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) {
        total++;
      }
      if (i < 98 && !isRightEdge && squares[i + 1].classList.contains("bomb")) {
        total++;
      }
      if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) {
        total++;
      }
      if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) {
        total++;
      }
      if (i < 89 && squares[i + width].classList.contains("bomb")) {
        total++;
      }
      squares[i].setAttribute("data", total);
      console.log(squares[i]);
    }
  }
}



createBoard();
bombCounter();
audioControls();



//click on square functions:
function click(square) {
  let squareId = square.id;
  if (isGameOver) {
    return;
  }
  if (square.classList.contains("checked") || square.classList.contains("isolated") || square.classList.contains("flag")) {
    return;
  }
  if (square.classList.contains("bomb")) {

    GameOver(square);

  } else {
    let adjacentBombs = square.getAttribute("data");
    if (adjacentBombs != 0) {
      square.classList.add("checked");
      square.innerHTML = adjacentBombs;
      incrementScore();
      return;
    }
    checkSquare(square, squareId);
    incrementScore();
  }
  if(!square.classList.contains("bomb")){
    square.classList.add("isolated");
    square.innerHTML = "🌼";
  }
}



//check neighboring square once a square is clicked:
function checkSquare(square, squareId) {
  const isLeftEdge = squareId % width === 0;
  const isRightEdge = squareId % width === width - 1;

  setTimeout(() => {
    if (squareId > 0 && !isLeftEdge) {
      const newId = squares[parseInt(squareId) - 1].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }
    if(squareId > 9 && !isRightEdge) {
        const newId = squares[parseInt(squareId) +1 -width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
    if(squareId > 10) {
        const newId = squares[parseInt(squareId) -width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
    if(squareId > 11 && !isLeftEdge){
        const newId = squares[parseInt(squareId) -1 -width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
    if(squareId < 98 && !isRightEdge){
        const newId = squares[parseInt(squareId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
    if(squareId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(squareId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
    if(squareId < 88 && !isRightEdge) {
        const newId = squares[parseInt(squareId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
    if(squareId < 89) {
        const newId = squares[parseInt(squareId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
    }
  }, 30)
}


//Increment Score:
function incrementScore(){
  score++;
  scoreCounter.innerText = score.toString().padStart(5, "0");
  
  checkVictory();
}


//Increment Flag count:
function incrementFlagCount(){
  flags++;
  flagCounter.innerText = flags.toString().padStart(2, "0");
}

//Decrement Flag count:
function decrementFlagCount(){
  flags--;
  flagCounter.innerText = flags.toString().padStart(2, "0");
}

function bombCounter(){
  bombCount.innerText = `${bombAmount}`;
}



//Game Over:
function GameOver(square){
    console.log("BOOM! You Hit a Bomb. Game Over!");
    isGameOver = true;
    setTimeout(() => {endGameScreen.classList.remove("hidden")}, 1000);
    
    //show all bomb locations:
    squares.forEach(square => {
        if(square.classList.contains("bomb")) {
            square.innerHTML = "🔥";
        }
    })
}



//Check For Victory State:
function checkFlagVictory() {
    let matches = 0;
    for(let i = 0; i < squares.length; i++){
        if(squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
            matches++;
        }
        if(matches === bombAmount) {
            console.log("All Bombs Found. You Win!");
            isGameOver = true;
            endGameText.innerHTML = "All Bombs Found.<br>You Win!";
            endGameScreen.classList.add("flagWin");
            setTimeout(() => {endGameScreen.classList.remove("hidden")}, 1000);
            playAgainButton.classList.add("flagWin");
            return;
        }
    }
}

function checkTileVictory() {
  if(score === maxScore){
    console.log("All Safe Tiles Found. You Win!");
    isGameOver = true;
    endGameScreen.classList.add("tileWin");
    playAgainButton.classList.add("tileWin");
    endGameText.innerHTML = "All Safe Tiles Found.<br>You Win!";
    setTimeout(() => {endGameScreen.classList.remove("hidden")}, 1000);
  } 
}

function checkVictory() {
  checkTileVictory();
  checkFlagVictory();
}



//Add Flag:
function addFlag(square) {
    if(isGameOver || square.classList.contains("checked")|| square.classList.contains("isolated")){
        return;
    }
    if(!square.classList.contains("checked")|| !square.classList.contains("isolated") && (flags < bombAmount)) {
        if(!square.classList.contains("flag")) {
            square.classList.add("flag");
            square.innerHTML = "🌱";
            incrementFlagCount();
            checkVictory();
        } else if (square.classList.contains("flag")) {
            square.classList.remove("flag");
            square.innerHTML = "";
            decrementFlagCount();
        }
    }
}



//Play Again and Restart Buttons:
function restartGame(){
playAgainButton.addEventListener("click", function() {
  window.location.reload();
});
restartButton.addEventListener("click", function() {
  window.location.reload();
})};

restartGame();


//Audio Controls
function audioControls(){
muteButton.addEventListener("click", () => {
  audio.muted = !audio.muted;
  if(audio.muted === true){
    muteButton.innerText ="🔊";
  }
  if(!audio.muted === true){
    muteButton.innerText ="🔈";
  }
})
};

