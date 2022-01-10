const gameContainer = document.getElementById("game");
const h1 = document.querySelector('h1');
const game = document.querySelector('#game')
let scoreboard;
let matches = 0;
let card1;
let card2;
let score = 0;
let checking = false;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }

  // add scoreboard
  const scoreDiv = document.createElement('div')
  scoreDiv.classList.add('score')
  scoreDiv.innerHTML = `Score: ${score}   <br> Best: ${localStorage.memoryMatchGameBestScore}`
  gameContainer.append(scoreDiv)
}


// TODO: Implement this function!
function handleCardClick(e) {
  scoreboard = document.querySelector('.score')

  if(checking){return};
  if(e.target === card1 || e.target === card2){return};
  if(e.target.classList.contains('matched')){return};
  checking = true;
  
  if(!card1 || !card2){
    card2 = card1 ? card1 : null;
    card1 = e.target;
    card1.style.backgroundColor = card1.classList.value;  
  }
  
  if(!card2){return checking = false}
  
  if(card1.classList.value === card2.classList.value){
    matches++;
    card1.classList.add('matched')
    card2.classList.add('matched')
    card1 = card2 = null; 
    checking = false;
    
  } else {
    score++;
    setTimeout(function() {
      card1.style.backgroundColor = '';
      card2.style.backgroundColor = '';
      card1 = card2 = null; 
      checking = false;
    },1000)
  }
  displayScore();

  

  if(matches === COLORS.length/2){
    h1.textContent = 'YOU WIN!'
    storeHiScore();
    const newGameBtn = document.createElement('button')
    newGameBtn.textContent = 'Play Again?'
    newGameBtn.addEventListener('click', function(e){
      e.preventDefault();
      resetGame();
    })
    scoreboard.append(newGameBtn)
  }

}

function resetGame(){
  score = 0;
  matches = 0;
  h1.textContent = 'Memory Game!'
  game.innerHTML = ''
  createDivsForColors(shuffledColors);
  // document.querySelector('button').remove()
}

function storeHiScore(){
  if(!localStorage.memoryMatchGameBestScore || localStorage.memoryMatchGameBestScore > score){
    localStorage.setItem('memoryMatchGameBestScore', score)
  } 
}

function displayScore(){
  scoreboard.innerHTML = `Score: ${score}   <br> Best: ${localStorage.memoryMatchGameBestScore}`
}


// when the DOM loads
createDivsForColors(shuffledColors);
