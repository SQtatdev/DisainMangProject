const fullDeck = [
    // Черви (Hearts)
    { image: 'images/cards/6hearts.png', value: 6 },
    { image: 'images/cards/7hearts.png', value: 7 },
    { image: 'images/cards/8hearts.png', value: 8 },
    { image: 'images/cards/9hearts.png', value: 9 },
    { image: 'images/cards/10hearts.png', value: 10 },
    { image: 'images/cards/10Jhearts.png', value: 10 },
    { image: 'images/cards/10Qhearts.png', value: 10 },
    { image: 'images/cards/10Khearts.png', value: 10 },
    { image: 'images/cards/10Ahearts.png', value: 11, isAce: true },
    
    // Пики (Spades)
    { image: 'images/cards/6spades.png', value: 6 },
    { image: 'images/cards/7spades.png', value: 7 },
    { image: 'images/cards/8spades.png', value: 8 },
    { image: 'images/cards/9spades.png', value: 9 },
    { image: 'images/cards/10spades.png', value: 10 },
    { image: 'images/cards/10Jspades.png', value: 10 },
    { image: 'images/cards/10Qspades.png', value: 10 },
    { image: 'images/cards/10Kspades.png', value: 10 },
    { image: 'images/cards/10Aspades.png', value: 11, isAce: true },
    
    // Бубны (Diamonds)
    { image: 'images/cards/6diamonds.png', value: 6 },
    { image: 'images/cards/7diamonds.png', value: 7 },
    { image: 'images/cards/8diamonds.png', value: 8 },
    { image: 'images/cards/9diamonds.png', value: 9 },
    { image: 'images/cards/10diamonds.png', value: 10 },
    { image: 'images/cards/10Jdiamonds.png', value: 10 },
    { image: 'images/cards/10Qdiamonds.png', value: 10 },
    { image: 'images/cards/10Kdiamonds.png', value: 10 },
    { image: 'images/cards/10Adiamonds.png', value: 11, isAce: true },
    
    // Трефы (Clubs)
    { image: 'images/cards/6clubs.png', value: 6 },
    { image: 'images/cards/7clubs.png', value: 7 },
    { image: 'images/cards/8clubs.png', value: 8 },
    { image: 'images/cards/9clubs.png', value: 9 },
    { image: 'images/cards/10clubs.png', value: 10 },
    { image: 'images/cards/10Jclubs.png', value: 10 },
    { image: 'images/cards/10Qclubs.png', value: 10 },
    { image: 'images/cards/10Kclubs.png', value: 10 },
    { image: 'images/cards/10Aclubs.png', value: 11, isAce: true }
];

// Игровые переменные
let playerScore = 0;
let dealerScore = 0;
let gameOver = false;
let playerTurn = true;
let currentDeck = [];
let cardsDealt = 0;
let initialDealComplete = false;
let StartMoney = 100;
let Stake = 0 

// DOM элементы
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const restartBtn = document.getElementById('restart-btn');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');

// ============ Инициализация ============
function initGame() {
    playerScore = 0;
    dealerScore = 0;
    PlayerMoney = StartMoney
    Stake = 0;
    gameOver = false;
    playerTurn = true;
    playerCards = [];
    dealerCards = [];
    initialDealComplete = false;

    document.getElementById('player-money').textContent = PlayerMoney;

    playerCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    playerScoreEl.textContent = '0';
    dealerScoreEl.textContent = '?';
    messageEl.textContent = 'Нажмите "Взять карту" для начала';

    currentDeck = shuffleDeck([...fullDeck]);

    hitBtn.disabled = false;
    standBtn.disabled = false;

    
    // Скрытые карты дилера
    dealCard('dealer', true);
    dealCard('dealer', true);
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
        cardEl.style.backgroundImage = `url(images/cards/dealer.png)`; // Рубашка
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
        dealerScore += card.value;
        dealerCards.push(card);
        dealerCardsEl.appendChild(cardEl);
    }
}

// ============ Проверка перебора игрока ============
function checkPlayerBust() {
    if (playerScore > 21) {
        const aces = document.querySelectorAll('#player-cards .card[data-is-ace="true"]');

        for (const ace of aces) {
            if (playerScore > 21 && ace.dataset.aceValue !== '1') {
                playerScore -= 10;
                playerScoreEl.textContent = playerScore;
                ace.dataset.aceValue = '1';
            }
        }

        if (playerScore > 21) {
            endGame('Перебор! Вы проиграли.');
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

    // AI дилера
    const play = () => {
        if (dealerScore < 17 || (dealerScore === 17 && dealerCards.some(c => c.isAce))) {
            setTimeout(() => {
                dealCard('dealer');
                revealDealerCards(); // обновим счёт
                play();
            }, 1000);
        } else {
            checkWinner();
        }
    };

    setTimeout(play, 1000);
}

// ============ Выбор победителя ============
function checkWinner() {
    let message = '';

    if (dealerScore > 21) {
        message = 'Дилер перебрал! Вы выиграли!';
        playerMoney = playerMoneyNew * 2
    } else if (playerScore > 21) {
        message = 'Вы перебрали! Дилер выиграл!';
        playerMoney = playerMoneyNew
    } else if (playerScore > dealerScore) {
        message = 'Вы выиграли!';
        playerMoney = playerMoneyNew * 2
    } else if (playerScore < dealerScore) {
        message = 'Дилер выиграл!';
        playerMoney = playerMoneyNew
    } else if (playerScore === dealerScore) {
        message = 'ничья';
        playerMoney = playerMoneyNew + Stake
    }

    endGame(message);
}

// ============ Завершение ============
function endGame(message) {
    gameOver = true;
    messageEl.textContent = message;
    hitBtn.disabled = true;
    standBtn.disabled = true;
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

restartBtn.addEventListener('click', initGame);

submitBtn.addEventListener('click', () => {
    const Stake = StakeInput.value.trim();

    PlayerMoney = PlayerMoney - Stake;
    document.getElementById('player-money').textContent = PlayerMoney;

})

// Старт
document.addEventListener('DOMContentLoaded', initGame);