'use strict';

const header = document.querySelector('header');
const main = document.querySelector('main');
const modal = document.querySelector('.modal');
const modalScore = document.querySelector('.modal-score');
const gameContainer = document.getElementById('game');
const btnStart = document.querySelector('.btn__start');
const difficultyMenu = document.querySelector('.difficulty');
const btnEasy = document.querySelector('.difficulty__easy');
const btnNorm = document.querySelector('.difficulty__norm');
const btnHard = document.querySelector('.difficulty__hard');
const h1 = document.querySelector('h1');
const headerMsg = document.querySelector('header p');
const game = document.querySelector('#game');
const modalBTN = document.querySelector('.modal button');
const best = {
  easy: localStorage.getItem('memoryMatchGameBestEasy'),
  norm: localStorage.getItem('memoryMatchGameBestNorm'),
  hard: localStorage.getItem('memoryMatchGameBestHard'),
  getBest() {
    this.easy = localStorage.getItem('memoryMatchGameBestEasy');
    this.norm = localStorage.getItem('memoryMatchGameBestNorm');
    this.hard = localStorage.getItem('memoryMatchGameBestHard');
  },
};

let matches = 0;
let score = 0;
let checking = false;
let gameDeck = [];
let scoreboard, card1, card2, cardBack1, cardBack2, difficulty, tempDeck;

const BANDPICS = [
  'cardpic01',
  'cardpic02',
  'cardpic03',
  'cardpic04',
  'cardpic05',
  'cardpic06',
  'cardpic07',
  'cardpic08',
  'cardpic09',
  'cardpic10',
  'cardpic11',
  'cardpic12',
  'cardpic13',
  'cardpic14',
  'cardpic15',
  'cardpic16',
  'cardpic17',
  'cardpic18',
  'cardpic19',
  'cardpic20',
  'cardpic21',
  'cardpic22',
  'cardpic23',
  'cardpic24',
  'cardpic25',
  'cardpic26',
  'cardpic27',
  'cardpic28',
  'cardpic29',
  'cardpic30',
  'cardpic31',
  'cardpic32',
  'cardpic33',
  'cardpic34',
  'cardpic35',
  'cardpic36',
  'cardpic37',
  'cardpic38',
];

btnStart.addEventListener('click', showDifficultyMenu);
difficultyMenu.addEventListener('click', startGameHandler.bind(this));
gameContainer.addEventListener('click', handleCardClick);
modalBTN.addEventListener('click', resetGame);

function showDifficultyMenu() {
  headerMsg.textContent = 'Select a difficulty!';
  btnStart.classList.add('hidden');
  difficultyMenu.classList.remove('hidden');
}

// Function to select difficulty, start game
function startGameHandler(e) {
  e.preventDefault();

  if (!e.target.classList.contains('btn__difficulty')) return;
  difficulty = e.target.dataset.difficulty;

  setDifficulty(difficulty);
  createDeck(difficulty);
  createGameBoard(gameDeck);
  revealGameBoard();
}

// Function to hide start menu and show the game
function revealGameBoard() {
  header.classList.add('playing');
  setTimeout(function () {
    main.classList.remove('hidden');
    header.classList.add('hidden');
    setTimeout(function () {
      main.classList.remove('fadedOut');
    }, 100);
  }, 800);
}

function setDifficulty(dif) {
  gameContainer.classList.remove('easy', 'norm', 'hard');
  gameContainer.classList.add(dif);
}

// helper function to shuffle an array
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

function createDeck(dif) {
  let shuffledCards = shuffle(BANDPICS);
  let numCards;

  if (dif === 'easy') numCards = 5;
  if (dif === 'norm') numCards = 10;
  if (dif === 'hard') numCards = 20;

  tempDeck = shuffledCards.slice(-numCards);
  gameDeck = [...tempDeck, ...tempDeck];
  shuffle(gameDeck);
}

// this function loops over the array of band pics
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createGameBoard(cardsArr) {
  for (let card of cardsArr) {
    // create a new card
    const cardDiv = document.createElement('div');
    const cardInner = document.createElement('div');
    const cardFront = document.createElement('div');
    const cardBack = document.createElement('div');

    cardDiv.classList.add('card');
    cardInner.classList.add('card-inner');
    cardFront.classList.add('card-side', 'card-side__front');
    cardBack.classList.add('card-side', 'card-side__back');
    cardBack.style.backgroundImage = `url('img/${card}.jpg')`;

    cardDiv.append(cardInner);
    cardInner.append(cardFront);
    cardInner.append(cardBack);

    // append the div to the element with an id of game
    gameContainer.append(cardDiv);
  }

  addScoreboardToGame();
}

function addScoreboardToGame() {
  const scoreDiv = document.createElement('div');
  scoreDiv.classList.add('score');
  const scoreP = document.createElement('p');
  displayScore(scoreP);
  scoreDiv.append(scoreP);
  gameContainer.append(scoreDiv);
}

// TODO: Implement this function!
function handleCardClick(e) {
  e.preventDefault();
  const target = e.target.parentElement.parentElement;

  if (!target.classList.contains('card')) return;

  scoreboard = document.querySelector('.score p');

  // Make sure "checking" is false, and disable clicking a flipped card.
  if (checking) return;
  if (target === card1 || target === card2) return;
  if (target.classList.contains('matched')) return;

  checking = true;
  setCardValues(e);

  // do not continue unless card1 and card2 have values
  if (!card2) return (checking = false);

  checkForCardMatch();
  displayScore(scoreboard);
  checkForWin();
}

function setCardValues(e) {
  if (!card1 || !card2) {
    card2 = card1 ? card1 : null;
    card1 = e.target.parentElement.parentElement;
    cardBack2 = cardBack1 ? cardBack1 : null;
    cardBack1 = e.target.parentElement.lastChild;
    card1.classList.add('flip');
  }
}

function checkForCardMatch() {
  if (cardBack1.style.backgroundImage === cardBack2.style.backgroundImage) {
    matches++;
    card1.classList.add('matched');
    card2.classList.add('matched');
    card1 = card2 = null;
    checking = false;
  } else {
    // iterate score and reset selected cards
    score++;
    setTimeout(function () {
      card1.classList.remove('flip');
      card2.classList.remove('flip');
      card1 = card2 = null;
      checking = false;
    }, 1000);
  }
}

function checkForWin() {
  if (matches === gameDeck.length / 2) {
    storeHiScore();
    displayScore(modalScore);
    setTimeout(function () {
      scoreboard.innerHTML = '';
      modal.classList.remove('hidden');
    }, 100);
  }
}

function resetGame() {
  score = 0;
  matches = 0;
  game.innerHTML = '';
  gameDeck = [];
  headerMsg.textContent = 'An Alter Bridge Memory Game';
  modal.classList.add('hidden');
  main.classList.add('hidden', 'fadedOut');
  header.classList.remove('hidden', 'playing');
  btnStart.classList.remove('hidden');
  difficultyMenu.classList.add('hidden');
}

function storeHiScore() {
  if (!best[difficulty] || best[difficulty] > score) {
    localStorage.setItem(
      `memoryMatchGameBest${difficulty[0].toUpperCase() + difficulty.slice(1)}`,
      score
    );
  }
}

function displayScore(el) {
  best.getBest();
  el.innerHTML = best[difficulty]
    ? `Score: ${score} <br> Best: ${best[difficulty]}`
    : `Score: ${score}`;
}
