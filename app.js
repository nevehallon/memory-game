let shuffle = function(array) { // Shuffle function from http://stackoverflow.com/a/2450976
  let currentIndex = array.length,
    temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}
const deck = document.querySelector(".deck");
const cards = deck.querySelectorAll(".card");
const moves = document.querySelector(".moves");
const modal = document.querySelector("#myModal");
const span = document.querySelector(".close");
const scorePanel = document.querySelector(".score-panel");
const winner = document.querySelector(".winner");
const ok = document.querySelector(".ok");
const message = document.querySelector(".modal-content");
const bronze = document.querySelector(".bronze");
const silver = document.querySelector(".silver");
const gold = document.querySelector(".gold");
const seconds = document.querySelector(".seconds");
let arr = []; // Create a list that holds all of your cards
let cardClass = []; // card classNames
let cardSymbol = [];
let openCards = [];
let bingo = deck.querySelectorAll(".match");
let once = 1;
let startTime, running, time, timeTaken, t, ticker;
let restart = document.querySelector(".restart");

populateFromStorage(); //loads from local storage

function stopWatch() { // Displays time elapsed near clock icon
  timeTaken = Date.now() - startTime;
  if (timeTaken > 999999) { //time limit
    timeTaken = 999999;
  }
  t = Math.round((timeTaken + 100) / 100) / 10;
  seconds.innerText = t;
  seconds.innerText.onchange = populateStorage();
}

function medals() { //accordding to amount of moves stars are taken away
  if (moves.innerText > 24 && gold.style.display == "") {
    gold.className = "fa fa-star fa-3x gold animated bounceOut";
  }
  if (moves.innerText > 28) {
    silver.className = "fa fa-star fa-2x silver animated bounceOut";
  }
}
ok.addEventListener("click", function() { // Sets event listener for OK button
  restartGame();
});
restart.addEventListener("click", function() { // Sets event listener for restart
  restartGame();
});

for (let i = 0; i < cards.length; i++) {
  arr.push(cards[i]); // Create a list that holds all of your cards
  cards[i].addEventListener("click", function(event) { //"onclick" functions
    if (openCards.length !== 2 && bingo.length !== 16) { //prevent default on-click function after two cards have flipped or user wins
      cards[i].classList.remove("rubberBand", "animated");
      cards[i].classList.toggle("open");
      cards[i].classList.toggle("show");
      mvCounter(); //increment the move counter and display it on the page
      medals();
      symbolChecker(cards[i]); //pull the card's symbol
      openCardChecker();
      if (once == 1) {
        startStop(); // Starts timmer
        ticker = setInterval(stopWatch, 120); //clock timer start ticking
        once = 0;
      }
    }
    bingo = deck.querySelectorAll('.match');
    if (bingo.length == 16) { //checks for all matches to be made
      modal.style.display = "block"; // Displays Modal
      if (once == 0) {
        startStop(); // Stops timmer
        addHtml2(); //adds relevant content to modal window
        clearInterval(ticker); //clock timer stops ticking
        once++;
      }
    }
  });
}

function populateFromStorage() { // pulls values from local storage then updates each value
  cardClass = JSON.parse(localStorage.getItem("cardClass")) || cardClass;
  cardSymbol = JSON.parse(localStorage.getItem("cardSymbol")) || cardSymbol;
  moves.innerText = JSON.parse(localStorage.getItem("moves")) || moves.innerText;
  timeTaken = Date.now() - (JSON.parse(localStorage.getItem("seconds")) ||
    startTime);
  seconds.innerText = (Math.round((timeTaken + 100) / 100) / 10 || 0);
  if (once == 1 && localStorage.length != 0) {
    startStop(); // Starts timmer
    ticker = setInterval(stopWatch, 120); //clock timer start ticking
    once = 0;
  }
  if (localStorage.length != 0) { // checking first to see if there is anything stored in localStorage
    for (j = 0; j < 16; j++) {
      cards[j].classList = cardClass[j];
      cards[j].childNodes[1].classList = cardSymbol[j];
    }
  }
}

function populateStorage() { //saves values to localStorage
  cardClass = [];
  cardSymbol = [];
  for (j = 0; j < 16; j++) {
    cardClass.push(arr[j].className);
    cardSymbol.push(arr[j].childNodes[1].className);
  }
  localStorage.setItem("cardClass", JSON.stringify(cardClass));
  localStorage.setItem("cardSymbol", JSON.stringify(cardSymbol));
  localStorage.setItem("seconds", JSON.stringify(startTime));
  localStorage.setItem("moves", JSON.stringify(moves.innerText));
}

function restartGame() { //sets everything back to initial state and shuffles card order
  localStorage.clear();
  bronze.classList = "fa fa-star fa-lg bronze hide";
  silver.classList = "fa fa-star fa-2x silver hide";
  gold.classList = "fa fa-star fa-3x gold hide";
  running = false;
  once = 1;
  clearInterval(ticker); //clock timer stops ticking
  seconds.innerText = 0;
  modal.style.display = "none";
  moves.innerText = 0;
  for (let i = 0; i < cards.length; i++) {
    cards[i].className = "card animated rollOut"
  }
  setTimeout(function() {
    shuff();
  }, 1000);
}

function addHtml2() { //adds relevant content to modal window
  let tempP = document.createElement("p");
  tempP.className = "timer";
  let pContent = document.createTextNode(time);
  tempP.appendChild(pContent);
  winner.insertAdjacentElement("afterend", tempP);
  let clone = scorePanel.cloneNode(true); //copies content from scorePanel
  span.insertAdjacentElement("afterend", clone); //pastes content from scorePanel
  for (k = 0; k < 2; k++) { // makes sure both "RESTART"s respond to click events
    let restart = document.querySelectorAll(".restart");
    restart[k].addEventListener("click", function() {
      restartGame();
    });
  }
}

function startStop() { // starts or stops counting
  if (running) {
    timeTaken = Date.now() - startTime;
    running = false;
    if (timeTaken > 999999) { // time limit
      timeTaken = 999999;
    }
    time = "Time: " + Math.round(timeTaken / 100) / 10 + " Seconds!!";
  } else {
    running = true;
    startTime = JSON.parse(localStorage.getItem("seconds")) || Date.now();
  }
}

span.addEventListener("click", function() { // When the user clicks on <span> (x), close the modal
  modal.style.display = "none";
});

window.addEventListener("click", function(event) { // When the user clicks anywhere outside of the modal, close it
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

function mvCounter() { //increment the move counter and display it on the page
  moves.innerText++;
}

function symbolChecker(elm) { //add the card to a *list* of "open" cards and asigns symbol
  let symbols = ["diamond", "paper", "anchor", "bolt", "cube", "leaf",
    "bicycle", "bomb"
  ];
  for (j = 0; j < symbols.length; j++) {
    if (elm.children[0].className.includes(symbols[j])) {
      openCards.push(symbols[j]);
    }
  }
}

function openCardChecker() { //check to see if the two cards match
  if (openCards.length == 2 && openCards[0] === openCards[1]) {
    matched();
  } else if (openCards.length == 2 && openCards[0] !== openCards[1]) {
    setTimeout(function() {
      noMatch();
    }, 2000);
  }
}

function matched() { //lock matched cards in the open position
  let shown = document.querySelectorAll('.open');
  for (var i = 0; i < shown.length; i++) {
    shown[i].className = "card animated tada match";
  }
  openCards = []; // resets list
}

function noMatch() { // if cards don't match
  let shown = document.querySelectorAll('.open');
  for (var i = 0; i < shown.length; i++) {
    shown[i].className = "card animated rubberBand";
    setTimeout(function() {
      clearToCard();
    }, 1000);
  }
  openCards = []; // resets list
}

function clearToCard() { // flips cards over to original state
  let shown = document.querySelectorAll('.rubberBand');
  for (var i = 0; i < shown.length; i++) {
    shown[i].className = "card";
  }
}

function shuff() { //shuffle the list of cards using the "shuffle" method
  bronze.classList = "fa fa-star fa-lg bronze animated bounceIn";
  silver.classList = "fa fa-star fa-2x silver animated bounceIn";
  gold.classList = "fa fa-star fa-3x gold animated bounceIn"
  shuffle(arr);
  arr = shuffle(arr);
  removeHtml();
  addHtml();
  let timer = document.querySelector(".timer");
  message.removeChild(timer); //clears space for new modal content
  message.removeChild(message.children[1]); //clears space for new modal content
}

function removeHtml() { //loop through each card and REMOVE each card's HTML from the page
  for (j = 0; j < 16; j++) {
    deck.removeChild(arr[j]);
  }
}

function addHtml() { //loop through each card and ADD each card's HTML to the page
  for (j = 0; j < 16; j++) {
    cards[j].className = "card animated rollIn"
    deck.appendChild(arr[j]);
  }
  setTimeout(function() { // flips all cards over to original state
    for (j = 0; j < 16; j++) {
      cards[j].className = "card"
    }
  }, 1000);
}