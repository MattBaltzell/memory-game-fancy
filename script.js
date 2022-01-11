const gameContainer = document.getElementById("game");
const h1 = document.querySelector('h1');
const game = document.querySelector('#game')
let scoreboard;
let matches = 0;
let card1;
let card2;
let difficulty;
let score = 0;
const best = localStorage.memoryMatchGameBestScore;
let checking = false;

const BANDPICS = [
  "ab-myles1",
  "ab-myles2",
  "ab-myles3",
  "ab-mark1",
  "ab-mark2",
  "ab-mark3",
  "ab-brian1",
  "ab-brian2",
  "ab-brian3",
  "ab-flip1",
  "ab-flip2",
  "ab-flip3",
  "ab-album1",
  "ab-album2",
  "ab-album3",
  "ab-album4",
  "ab-album5",
  "ab-album6",
  "ab-band1",
  "ab-band2",
  "ab-band3",
  "ab-band4",
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

let shuffledCards = shuffle(BANDPICS);

let tempDeck;
let gameDeck;
difficulty = 'hard';
setDeckSize(difficulty)

function setDeckSize(dif){
if (dif === 'easy'){
  tempDeck = shuffledCards.slice(-5)
}
if (dif === 'norm'){
  tempDeck = shuffledCards.slice(-10)
}
if (dif === 'hard'){
  tempDeck = shuffledCards.slice(-20)
}
gameDeck = [...tempDeck,...tempDeck]
shuffle(gameDeck);
}



// this function loops over the array of band pics
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createCards(cardsArr) {
  for (let card of cardsArr) {
    // create a new card
    const newDiv = document.createElement("div");
    const newInner = document.createElement("div");
    const newFront = document.createElement("div");
    const newBack = document.createElement("div");
    
    newDiv.classList.add('card');
    newInner.classList.add('card-inner')
    newFront.classList.add('card-side', 'card-side__front')
    newBack.classList.add('card-side', 'card-side__back')

    newDiv.append(newInner)
    newInner.append(newFront)
    newInner.append(newBack)
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }

  // add scoreboard div to game board
  const scoreDiv = document.createElement('div')
  scoreDiv.classList.add('score')
  displayScore(scoreDiv)
  gameContainer.append(scoreDiv)
}


// TODO: Implement this function!
function handleCardClick(e) {

  scoreboard = document.querySelector('.score')
  
  // Make sure "checking" is false, and disable clicking a flipped card.
  if(checking){return};
  if(e.target === card1 || e.target === card2){return};
  if(e.target.classList.contains('matched')){return};

  checking = true;
  
  // set card1 and card2 values
  if(!card1 || !card2){
    card2 = card1 ? card1 : null;
    card1 = e.target;
    card1.style.backgroundColor = card1.classList.value;  
  }
  // do not continue unless card1 and card2 have values
  if(!card2){return checking = false}
  
  // check if cards match
  if(card1.classList.value === card2.classList.value){
    matches++;
    card1.classList.add('matched')
    card2.classList.add('matched')
    card1 = card2 = null; 
    checking = false;
  } else {
    // iterate score and reset selected cards
    score++;
    setTimeout(function() {
      card1.style.backgroundColor = '';
      card2.style.backgroundColor = '';
      card1 = card2 = null; 
      checking = false;
    },1000)
  }

  displayScore(scoreboard);

  // win logic
  if(matches === BANDPICS.length/2){
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
  createCards(gameDeck);
  displayScore(scoreboard)
}

function storeHiScore(){
  if(!best || best > score){ localStorage.setItem('memoryMatchGameBestScore', score) } 
}

function displayScore(div){ div.innerHTML = best ? `Score: ${score} <br> Best: ${best}` : `Score: ${score}` }

// when the DOM loads
createCards(gameDeck);
