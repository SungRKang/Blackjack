var dealerSum = 0;
var yourSum =0;

var dealerAceCount=0;
var yourAceCount =0;

var yourCash = 500;

var hidden;
var deck;
var theBet = 0;
var currentBet = 0;

var cardCount1 = 0;

var canHit = false; //allows the player to draw while yourSum <= 21
var canStay = false;
var canAdd = true;
var canRemove = false;
var canPlay = false;

window.onload = function() {
  buildDeck();
  buildDeck();
  buildDeck();
  buildDeck();
  shuffleDeck();
  startGame();
}

function buildDeck() {
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let types = ["C", "D", "H", "S"];
  deck=[];

  for (let i =0; i< types.length; i++) {
    for (let j=0; j< values.length; j++){
      deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
    }
  }
}

function shuffleDeck() {
  for (let i =0; i< deck.length; i++) {
    let j=Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  console.log(deck);
}

function startGame() {
  //document.getElementById("your-cash").innerText = "$" + yourCash;
  /* console.log(hidden);
  console.log(dealerSum); */
  //deal cards to dealer

  //console.log(dealerSum);
  
  document.getElementById("player-total").innerText = "In Hand: $" + yourCash;
  var slider = document.getElementById("myRange");
  var output = document.getElementById("betting-amount");
  
  output.innerHTML =  "$" + slider.value; // Display the default slider value
  theBet = parseInt(slider.value);

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = "$" + slider.value;
    theBet = parseInt(slider.value);
  }
  console.log(dealerSum);
  document.getElementById("add").addEventListener("click", add);
  document.getElementById("remove").addEventListener("click", remove);
  document.getElementById("play").addEventListener("click", play);
  //console.log(yourSum);
  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
  if(!canHit) {
    return;
  }
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./resources/cards/" + card + ".png";
  cardImg.classList.add('cards');
  cardCount1 += 1;
  cardImg.id = "card" + cardCount1;
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  yourSum = reduceAce(yourSum, yourAceCount);

  document.getElementById("your-cards").append(cardImg);

  if (yourSum > 21) {
    canHit = false;
    calculate();
  }
  
}

function stay() {
  if (!canStay) {
    return;
  }
  canHit = false;
  calculate();
}

function calculate() {
  document.getElementById("hidden").src = "./resources/cards/" + hidden + ".png";
  dealerTurn();
  
  let message = "";
  if (yourSum > 21) {
    message = "You lose!";
  }
  else if (dealerSum > 21) {
    yourCash += theBet*2;
  }
  //both you and dealer <= 21
  else if( yourSum == dealerSum) {
    yourCash += theBet;
  }
  else if (yourSum > dealerSum) {
    yourCash += theBet*2;
  }
  else if (yourSum == 21) {
    yourCash += (3/2)*theBet + theBet;
  }
  else if (yourSum < dealerSum) {
    message = "You lose!";
  }

  reset();
}



function getValue(card) {
  let data = card.split("-"); // Split the values into [value, suit]
  let value = data[0];

  if (isNaN(value)) { //If face card. 
    if (value == "A") {
      return 11;
    }
    return 10;
  }

  return parseInt (value);

}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
}

function reduceAce(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

function dealerTurn() {
  console.log(dealerSum);
  while (dealerSum < 17) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./resources/cards/" + card + ".png";
    cardImg.classList.add('cards');
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    document.getElementById("dealer-cards").append(cardImg);
    
  }
}

function reset() {
  yourSum=0;
  yourAceCount=0;
  dealerSum=0;
  dealerAceCount=0;

  theBet = 0;
  currentBet = 0;

  cardCount1 = 0;

  canHit = false; //allows the player to draw while yourSum <= 21
  canStay = false;
  canAdd = true;
  canRemove = false;
  canPlay = false;

  document.getElementById("player-total").innerText = "In Hand: $" + yourCash;
  document.getElementById("current-bet").innerHTML = "Bet: $" + currentBet;

  setTimeout(function() {
    while (document.getElementById("dealer-cards").firstElementChild) {
      document.getElementById("dealer-cards").removeChild(document.getElementById("dealer-cards").firstElementChild);
    }
    while (document.getElementById("your-cards").firstElementChild) {
      document.getElementById("your-cards").removeChild(document.getElementById("your-cards").firstElementChild);
    }
  }, 5000);
  

}


function dealYou() {
  for(let i=0; i<2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./resources/cards/" + card + ".png";
    cardImg.classList.add('cards');
    cardCount1 += 1;
    cardImg.id = "card" + cardCount1;
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }
  
}


function dealDealer() {
  console.log(dealerSum);
  let cardImg = document.createElement("img");
  cardImg.src = "./resources/cards/BACK.png";
  cardImg.classList.add('cards');
  cardImg.id = "hidden";
  document.getElementById("dealer-cards").appendChild(cardImg);

  hidden = deck.pop();
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden); 

  let card = deck.pop();
  let cardImg2 = document.createElement("img");
  cardImg2.src = "./resources/cards/" + card + ".png";
  cardImg2.classList.add('cards');
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").appendChild(cardImg2);
  console.log(dealerSum);
}

function add() {
  if (yourCash - theBet < 0) {
    return;
  }
  currentBet += theBet;
  yourCash -= theBet;
  document.getElementById("current-bet").innerHTML = "Bet: $" + currentBet;
  document.getElementById("player-total").innerHTML = "In Hand: $" + yourCash;
}

function remove() {
  if (currentBet - theBet < 0) {
    return;
  }
  currentBet -= theBet;
  yourCash += theBet;
  document.getElementById("current-bet").innerHTML = "Bet: $" + currentBet;
  document.getElementById("player-total").innerHTML = "In Hand: $" + yourCash;
}

function play() {
  if (currentBet <= 0) {
    return;
  }

  dealDealer();
  
  dealYou();
  canHit = true;
  canStay = true;
}
