const fullDeck = [
    // Черви (Hearts)
    { image: 'admin/images/cards/6hearts.png', value: 6 },
    { image: 'admin/images/cards/7hearts.png', value: 7 },
    { image: 'admin/images/cards/8hearts.png', value: 8 },
    { image: 'admin/images/cards/9hearts.png', value: 9 },
    { image: 'admin/images/cards/10hearts.png', value: 10 },
    { image: 'admin/images/cards/10Jhearts.png', value: 10 },
    { image: 'admin/images/cards/10Qhearts.png', value: 10 },
    { image: 'admin/images/cards/10Khearts.png', value: 10 },
    { image: 'admin/images/cards/10Ahearts.png', value: 11, isAce: true },

    // Пики (Spades)
    { image: 'admin/images/cards/6spades.png', value: 6 },
    { image: 'admin/images/cards/7spades.png', value: 7 },
    { image: 'admin/images/cards/8spades.png', value: 8 },
    { image: 'admin/images/cards/9spades.png', value: 9 },
    { image: 'admin/images/cards/10spades.png', value: 10 },
    { image: 'admin/images/cards/10Jspades.png', value: 10 },
    { image: 'admin/images/cards/10Qspades.png', value: 10 },
    { image: 'admin/images/cards/10Kspades.png', value: 10 },
    { image: 'admin/images/cards/10Aspades.png', value: 11, isAce: true },

    // Бубны (Diamonds)
    { image: 'admin/images/cards/6diamonds.png', value: 6 },
    { image: 'admin/images/cards/7diamonds.png', value: 7 },
    { image: 'admin/images/cards/8diamonds.png', value: 8 },
    { image: 'admin/images/cards/9diamonds.png', value: 9 },
    { image: 'admin/images/cards/10diamonds.png', value: 10 },
    { image: 'admin/images/cards/10Jdiamonds.png', value: 10 },
    { image: 'admin/images/cards/10Qdiamonds.png', value: 10 },
    { image: 'admin/images/cards/10Kdiamonds.png', value: 10 },
    { image: 'admin/images/cards/10Adiamonds.png', value: 11, isAce: true },

    // Трефы (Clubs)
    { image: 'admin/images/cards/6clubs.png', value: 6 },
    { image: 'admin/images/cards/7clubs.png', value: 7 },
    { image: 'admin/images/cards/8clubs.png', value: 8 },
    { image: 'admin/images/cards/9clubs.png', value: 9 },
    { image: 'admin/images/cards/10clubs.png', value: 10 },
    { image: 'admin/images/cards/10Jclubs.png', value: 10 },
    { image: 'admin/images/cards/10Qclubs.png', value: 10 },
    { image: 'admin/images/cards/10Kclubs.png', value: 10 },
    { image: 'admin/images/cards/10Aclubs.png', value: 11, isAce: true }
];

// Игровые переменные
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let playerTurn = true;
let currentDeck = [];
let playerCards = [];
let dealerCards = [];
let initialDealComplete = false;

let playerMoney = 100;
let stake = 0;

// DOM элементы
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const submitBtn = document.getElementById('submitBtn');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const messageEl = document.getElementById('message');
const playerMoneyEl = document.getElementById('player-money');
const stakeInput = document.getElementById('StakeInput');

// ============ Инициализация игры ============
function initGame() {
    playerScore = 0;
    dealerScore = 0;
    gameOver = false;
    playerTurn = true;
    playerCards = [];
    dealerCards = [];
    initialDealComplete = false;

    playerCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    playerScoreEl.textContent = '0';
    dealerScoreEl.textContent = '?';
    messageEl.textContent = 'Make Bet to start ';
    playerMoneyEl.textContent = playerMoney;

    hitBtn.disabled = false;
    standBtn.disabled = false;

    currentDeck = shuffleDeck([...fullDeck]);

    // Раздача начальных карт
    dealCard('player');
    dealCard('dealer', true);
    dealCard('player');
    dealCard('dealer');
}

// ============ Перемешивание ============
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// ============ Выдача карты ============
function dealCard(target, hidden = false) {
    if (gameOver || currentDeck.length === 0) return;

    const card = currentDeck.pop();
    const cardEl = document.createElement('div');
    cardEl.className = 'card';

    if (hidden) {
        cardEl.style.backgroundImage = `url(admin/images/cards/dealer.png)`;
        cardEl.dataset.hidden = 'true';
    } else {
        cardEl.style.backgroundImage = `url(${card.image})`;
        cardEl.dataset.hidden = 'false';
    }

    if (card.isAce) cardEl.dataset.isAce = 'true';

    setTimeout(() => cardEl.classList.add('visible'), 50);

    if (target === 'player') {
        playerScore += card.value;
        playerCards.push(card);
        playerCardsEl.appendChild(cardEl);
        playerScoreEl.textContent = playerScore;
        checkPlayerBust();
    } else if (target === 'dealer') {
        dealerCards.push(card);
        dealerCardsEl.appendChild(cardEl);
        if (!hidden) {
            dealerScore += card.value;
        }
    }
}

// ============ Проверка перебора ============
function checkPlayerBust() {
    if (playerScore > 21) {
        const aces = document.querySelectorAll('#player-cards .card[data-is-ace="true"]');
        for (const ace of aces) {
            if (playerScore > 21 && ace.dataset.aceValue !== '1') {
                playerScore -= 10;
                ace.dataset.aceValue = '1';
                playerScoreEl.textContent = playerScore;
            }
        }
        if (playerScore > 21) {
            endGame('Dealer Win');
        }
    }
}

// ============ Вскрытие карт дилера ============
function revealDealerCards() {
    const dealerCardElements = dealerCardsEl.children;
    dealerScore = 0;

    for (let i = 0; i < dealerCardElements.length; i++) {
        const cardEl = dealerCardElements[i];
        const card = dealerCards[i];

        cardEl.style.backgroundImage = `url(${card.image})`;
        cardEl.dataset.hidden = 'false';
        dealerScore += card.value;
    }

    dealerScoreEl.textContent = dealerScore;
}

// ============ Ход дилера ============
function dealerTurn() {
    playerTurn = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;

    revealDealerCards();

    const play = () => {
        if (dealerScore < 17 || (dealerScore === 17 && dealerCards.some(c => c.isAce))) {
            setTimeout(() => {
                dealCard('dealer');
                revealDealerCards();
                play();
            }, 1000);
        } else {
            checkWinner();
        }
    };

    setTimeout(play, 1000);
}

// ============ Определение победителя ============
function checkWinner() {
    let message = '';
    submitBtn.disabled = false;

    if (dealerScore > 21) {
        message = 'Wiin!';
        playerMoney += stake * 2;
    } else if (playerScore > dealerScore) {
        message = 'Win!';
        playerMoney += stake * 2;
    } else if (playerScore < dealerScore) {
        message = 'Dealer Wiin!';

    } else {
        message = 'Tie!';
        playerMoney += stake;
    }

    endGame(message);
}

// ============ Завершение игры ============
function endGame(message) {
    gameOver = true;
    messageEl.textContent = message;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    playerMoneyEl.textContent = playerMoney;
}

// ============ События ============
hitBtn.addEventListener('click', () => {
    if (!gameOver && playerTurn) {
        dealCard('player');
    }
});

standBtn.addEventListener('click', () => {
    if (!gameOver && playerTurn) {
        dealerTurn();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    playerMoneyEl.textContent = playerMoney;

    submitBtn.addEventListener('click', () => {
        const enteredStake = parseFloat(stakeInput.value.trim());

        if (enteredStake > 0 && enteredStake <= playerMoney) {
            stake = enteredStake;
            playerMoney -= stake;
            playerMoneyEl.textContent = playerMoney;
            submitBtn.disabled = true;
            initGame();
        } else {
            messageEl.textContent = "Undefined Bet";
            hitBtn.disabled = true;
            standBtn.disabled = true;
        }
    });
});
