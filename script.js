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

// DOM элементы
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const restartBtn = document.getElementById('restart-btn');
const playerCardsEl = document.getElementById('player-cards');
const dealerCardsEl = document.getElementById('dealer-cards');
const playerScoreEl = document.getElementById('player-score');
const dealerScoreEl = document.getElementById('dealer-score');
const messageEl = document.getElementById('message');

// Инициализация новой игры
function initGame() {
    playerScore = 0;
    dealerScore = 0;
    gameOver = false;
    playerTurn = true;
    cardsDealt = 0;
    initialDealComplete = false;
    
    playerCardsEl.innerHTML = '';
    dealerCardsEl.innerHTML = '';
    playerScoreEl.textContent = '0';
    dealerScoreEl.textContent = '?';
    messageEl.textContent = 'Нажмите "Взять карту" для начала';
    
    currentDeck = shuffleDeck([...fullDeck]);
    
    hitBtn.disabled = false;
    standBtn.disabled = true;
}

// Перемешивание колоды
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Выдача карты
function dealCard(target) {
    if (gameOver || currentDeck.length === 0) return;
    
    const card = currentDeck.pop();
    const cardValue = card.value;
    
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.style.backgroundImage = `url(${card.image})`;
    if (card.isAce) cardEl.dataset.isAce = 'true';
    
    if (target === 'player') {
        playerScore += cardValue;
        playerCardsEl.appendChild(cardEl);
        playerScoreEl.textContent = playerScore;
        checkPlayerBust();
    } else {
        dealerScore += cardValue;
        dealerCardsEl.appendChild(cardEl);
        // Первая карта дилера скрыта
        if (cardsDealt >= 3) {
            dealerScoreEl.textContent = dealerScore;
        }
    }
    
    setTimeout(() => cardEl.classList.add('visible'), 50);
    
    cardsDealt++;
    
    // После 3 карт (2 игроку, 1 дилеру) активируем кнопку "Пас"
    if (cardsDealt === 3) {
        initialDealComplete = true;
        standBtn.disabled = false;
        messageEl.textContent = 'Берите карты или пасуйте';
    }
}

// Проверка перебора
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
            endGame('Перебор! Вы проиграли');
        }
    }
}

// Ход дилера
function dealerTurn() {
    playerTurn = false;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    
    // Показываем скрытую карту дилера
    dealerScoreEl.textContent = dealerScore;
    
    // ИИ дилера
    const dealerAI = () => {
        if (dealerScore < 17 || (dealerScore === 17 && hasAce(dealerCardsEl))) {
            setTimeout(() => {
                dealCard('dealer');
                dealerAI();
            }, 1000);
        } else {
            checkWinner();
        }
    };
    
    dealerAI();
}

// Проверка наличия туза
function hasAce(cardsContainer) {
    return Array.from(cardsContainer.children).some(card => card.dataset.isAce === 'true');
}

// Определение победителя
function checkWinner() {
    let message = '';
    
    if (dealerScore > 21) {
        message = 'Дилер перебрал! Вы выиграли!';
    } else if (playerScore > 21) {
        message = 'Вы перебрали! Дилер выиграл!';
    } else if (playerScore > dealerScore) {
        message = 'Поздравляем! Вы выиграли!';
    } else if (playerScore < dealerScore) {
        message = 'Дилер выиграл!';
    } else {
        message = 'Ничья!';
    }
    
    endGame(message);
}

// Завершение игры
function endGame(message) {
    gameOver = true;
    messageEl.textContent = message;
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

// Обработчики событий
hitBtn.addEventListener('click', () => {
    if (gameOver) return;
    
    if (!initialDealComplete) {
        // Начальная раздача
        if (cardsDealt < 2) {
            dealCard('player');
        } else if (cardsDealt === 2) {
            dealCard('dealer');
        }
    } else {
        // Обычный ход
        if (playerTurn) {
            dealCard('player');
        }
    }
});

standBtn.addEventListener('click', () => {
    if (playerTurn && !gameOver && initialDealComplete) {
        dealerTurn();
    }
});

restartBtn.addEventListener('click', initGame);

// Запуск игры
document.addEventListener('DOMContentLoaded', initGame);
