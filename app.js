// Game State Management
class GameState {
    constructor() {
        this.balance = 10000;
        this.stats = {
            totalGames: 0,
            totalWon: 0,
            totalLost: 0,
            blackjack: { played: 0, won: 0, lost: 0 },
            poker: { played: 0, won: 0, lost: 0 },
            slots: { played: 0, won: 0, lost: 0 },
            roulette: { played: 0, won: 0, lost: 0 },
            baccarat: { played: 0, won: 0, lost: 0 },
            craps: { played: 0, won: 0, lost: 0 },
            wheel: { played: 0, won: 0, lost: 0 },
            dice: { played: 0, won: 0, lost: 0 }
        };
        this.loadFromStorage();
    }

    saveToStorage() {
        localStorage.setItem('casinoGameState', JSON.stringify({
            balance: this.balance,
            stats: this.stats
        }));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('casinoGameState');
        if (saved) {
            const data = JSON.parse(saved);
            this.balance = data.balance || 10000;
            this.stats = { ...this.stats, ...data.stats };
        }
    }

    updateBalance(amount) {
        this.balance += amount;
        this.saveToStorage();
        this.updateUI();
    }

    addGameStat(game, won = false) {
        this.stats[game].played++;
        this.stats.totalGames++;
        if (won) {
            this.stats[game].won++;
        } else {
            this.stats[game].lost++;
        }
        this.saveToStorage();
        this.updateUI();
    }

    addWinLoss(amount) {
        if (amount > 0) {
            this.stats.totalWon += amount;
        } else {
            this.stats.totalLost += Math.abs(amount);
        }
        this.saveToStorage();
    }

    updateUI() {
        document.getElementById('balanceDisplay').textContent = `$${this.balance.toLocaleString()}`;
        document.getElementById('blackjackPlayed').textContent = this.stats.blackjack.played;
        document.getElementById('pokerPlayed').textContent = this.stats.poker.played;
        document.getElementById('slotsPlayed').textContent = this.stats.slots.played;
        document.getElementById('roulettePlayed').textContent = this.stats.roulette.played;
        document.getElementById('baccaratPlayed').textContent = this.stats.baccarat.played;
        document.getElementById('crapsPlayed').textContent = this.stats.craps.played;
        document.getElementById('wheelPlayed').textContent = this.stats.wheel.played;
        document.getElementById('dicePlayed').textContent = this.stats.dice.played;
    }

    reset() {
        this.balance = 10000;
        this.stats = {
            totalGames: 0,
            totalWon: 0,
            totalLost: 0,
            blackjack: { played: 0, won: 0, lost: 0 },
            poker: { played: 0, won: 0, lost: 0 },
            slots: { played: 0, won: 0, lost: 0 },
            roulette: { played: 0, won: 0, lost: 0 },
            baccarat: { played: 0, won: 0, lost: 0 },
            craps: { played: 0, won: 0, lost: 0 },
            wheel: { played: 0, won: 0, lost: 0 },
            dice: { played: 0, won: 0, lost: 0 }
        };
        localStorage.removeItem('casinoGameState');
        this.updateUI();
        this.updateStatsView();
    }

    updateStatsView() {
        document.getElementById('statBalance').textContent = `$${this.balance.toLocaleString()}`;
        document.getElementById('statTotalGames').textContent = this.stats.totalGames;
        document.getElementById('statTotalWon').textContent = `$${this.stats.totalWon.toLocaleString()}`;
        document.getElementById('statTotalLost').textContent = `$${this.stats.totalLost.toLocaleString()}`;
        document.getElementById('statBlackjackWins').textContent = this.stats.blackjack.won;
        document.getElementById('statPokerWins').textContent = this.stats.poker.won;
        document.getElementById('statSlotsWins').textContent = this.stats.slots.won;
        document.getElementById('statRouletteWins').textContent = this.stats.roulette.won;
        document.getElementById('statBaccaratWins').textContent = this.stats.baccarat.won;
        document.getElementById('statCrapsWins').textContent = this.stats.craps.won;
        document.getElementById('statWheelWins').textContent = this.stats.wheel.won;
        document.getElementById('statDiceWins').textContent = this.stats.dice.won;
    }
}

// View Navigation
class ViewManager {
    constructor() {
        this.currentView = 'lobbyView';
        this.init();
    }

    init() {
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const game = e.currentTarget.dataset.game;
                this.showView(`${game}View`);
            });
        });

        // Back buttons
        document.getElementById('blackjackBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('pokerBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('slotsBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('rouletteBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('baccaratBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('crapsBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('wheelBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        document.getElementById('diceBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        
        // Stats button
        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showView('statsView');
            gameState.updateStatsView();
        });
        
        document.getElementById('statsBackBtn').addEventListener('click', () => this.showView('lobbyView'));
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all progress?')) {
                gameState.reset();
                this.showView('lobbyView');
            }
        });
    }

    showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');
        this.currentView = viewId;
    }
}

// Blackjack Game
class BlackjackGame {
    constructor() {
        this.deck = [];
        this.dealerHand = [];
        this.playerHand = [];
        this.betAmount = 0;
        this.gameActive = false;
        this.init();
    }

    init() {
        document.getElementById('placeBetBtn').addEventListener('click', () => this.startGame());
        document.getElementById('hitBtn').addEventListener('click', () => this.hit());
        document.getElementById('standBtn').addEventListener('click', () => this.stand());
        document.getElementById('doubleBtn').addEventListener('click', () => this.doubleDown());
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value, isRed: suit === '♥' || suit === '♦' });
            }
        }
        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    getCardValue(card) {
        if (card.value === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        return parseInt(card.value);
    }

    getHandValue(hand) {
        let value = 0;
        let aces = 0;
        for (let card of hand) {
            if (card.value === 'A') {
                aces++;
                value += 11;
            } else {
                value += this.getCardValue(card);
            }
        }
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    displayCard(card, element, hidden = false) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card' + (card.isRed ? ' red' : '');
        if (hidden) {
            cardDiv.className += ' hidden';
            cardDiv.textContent = '🂠';
        } else {
            cardDiv.textContent = card.suit + ' ' + card.value;
        }
        element.appendChild(cardDiv);
    }

    displayHand(hand, element, hideLast = false) {
        element.innerHTML = '';
        hand.forEach((card, index) => {
            this.displayCard(card, element, hideLast && index === hand.length - 1);
        });
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('blackjackMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    startGame() {
        const betInput = parseInt(document.getElementById('blackjackBet').value);
        if (betInput < 10 || betInput > 1000) {
            this.showMessage('Bet must be between $10 and $1000', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.betAmount = betInput;
        this.gameActive = true;
        this.deck = this.createDeck();
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        this.playerHand = [this.deck.pop(), this.deck.pop()];

        this.displayHand(this.dealerHand, document.getElementById('dealerHand'), true);
        this.displayHand(this.playerHand, document.getElementById('playerHand'));
        
        document.getElementById('dealerValue').textContent = 'Value: ?';
        document.getElementById('playerValue').textContent = `Value: ${this.getHandValue(this.playerHand)}`;
        
        document.getElementById('placeBetBtn').style.display = 'none';
        document.getElementById('blackjackControls').style.display = 'flex';

        if (this.getHandValue(this.playerHand) === 21) {
            this.stand();
        }
    }

    hit() {
        if (!this.gameActive) return;
        
        this.playerHand.push(this.deck.pop());
        this.displayHand(this.playerHand, document.getElementById('playerHand'));
        const playerValue = this.getHandValue(this.playerHand);
        document.getElementById('playerValue').textContent = `Value: ${playerValue}`;

        if (playerValue > 21) {
            this.endGame(false);
        }
    }

    stand() {
        if (!this.gameActive) return;
        
        // Reveal dealer card
        this.displayHand(this.dealerHand, document.getElementById('dealerHand'));
        let dealerValue = this.getHandValue(this.dealerHand);
        document.getElementById('dealerValue').textContent = `Value: ${dealerValue}`;

        // Dealer draws until 17+
        while (dealerValue < 17) {
            this.dealerHand.push(this.deck.pop());
            this.displayHand(this.dealerHand, document.getElementById('dealerHand'));
            dealerValue = this.getHandValue(this.dealerHand);
            document.getElementById('dealerValue').textContent = `Value: ${dealerValue}`;
        }

        const playerValue = this.getHandValue(this.playerHand);
        
        if (dealerValue > 21) {
            this.endGame(true);
        } else if (playerValue > dealerValue) {
            this.endGame(true);
        } else if (playerValue < dealerValue) {
            this.endGame(false);
        } else {
            this.endGame(null); // Push
        }
    }

    doubleDown() {
        if (!this.gameActive || this.playerHand.length !== 2) return;
        if (this.betAmount * 2 > gameState.balance) {
            this.showMessage('Insufficient balance to double down', 'error');
            return;
        }
        
        this.betAmount *= 2;
        this.hit();
        if (this.gameActive) {
            this.stand();
        }
    }

    endGame(playerWon) {
        this.gameActive = false;
        const playerValue = this.getHandValue(this.playerHand);
        const dealerValue = this.getHandValue(this.dealerHand);

        if (playerWon === null) {
            this.showMessage('Push! Your bet is returned.', 'info');
            gameState.addGameStat('blackjack', false);
        } else if (playerWon) {
            const winnings = this.betAmount * (playerValue === 21 && this.playerHand.length === 2 ? 2.5 : 2);
            gameState.updateBalance(winnings);
            gameState.addGameStat('blackjack', true);
            gameState.addWinLoss(winnings);
            this.showMessage(`You win! +$${winnings.toLocaleString()}`, 'success');
        } else {
            gameState.updateBalance(-this.betAmount);
            gameState.addGameStat('blackjack', false);
            gameState.addWinLoss(-this.betAmount);
            this.showMessage(`Dealer wins! -$${this.betAmount.toLocaleString()}`, 'error');
        }

        document.getElementById('placeBetBtn').style.display = 'block';
        document.getElementById('blackjackControls').style.display = 'none';
    }
}

// Poker Game
class PokerGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.communityCards = [];
        this.betAmount = 0;
        this.pot = 0;
        this.gameActive = false;
        this.init();
    }

    init() {
        document.getElementById('startPokerBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pokerCallBtn').addEventListener('click', () => this.call());
        document.getElementById('pokerRaiseBtn').addEventListener('click', () => this.raise());
        document.getElementById('pokerFoldBtn').addEventListener('click', () => this.fold());
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value, isRed: suit === '♥' || suit === '♦' });
            }
        }
        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    displayCard(card, element) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card' + (card.isRed ? ' red' : '');
        cardDiv.textContent = card.suit + ' ' + card.value;
        element.appendChild(cardDiv);
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('pokerMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    evaluateHand(hand) {
        // Simplified hand evaluation - returns rank (higher is better)
        const values = hand.map(c => {
            if (c.value === 'A') return 14;
            if (c.value === 'K') return 13;
            if (c.value === 'Q') return 12;
            if (c.value === 'J') return 11;
            return parseInt(c.value);
        }).sort((a, b) => b - a);

        const suits = hand.map(c => c.suit);
        const isFlush = suits.every(s => s === suits[0]);
        const isStraight = this.isStraight(values);

        // Check for pairs, three of a kind, etc.
        const valueCounts = {};
        values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
        const counts = Object.values(valueCounts).sort((a, b) => b - a);

        if (isFlush && isStraight && values[0] === 14) return { rank: 10, name: 'Royal Flush' };
        if (isFlush && isStraight) return { rank: 9, name: 'Straight Flush' };
        if (counts[0] === 4) return { rank: 8, name: 'Four of a Kind' };
        if (counts[0] === 3 && counts[1] === 2) return { rank: 7, name: 'Full House' };
        if (isFlush) return { rank: 6, name: 'Flush' };
        if (isStraight) return { rank: 5, name: 'Straight' };
        if (counts[0] === 3) return { rank: 4, name: 'Three of a Kind' };
        if (counts[0] === 2 && counts[1] === 2) return { rank: 3, name: 'Two Pair' };
        if (counts[0] === 2) return { rank: 2, name: 'Pair' };
        return { rank: 1, name: 'High Card' };
    }

    isStraight(values) {
        for (let i = 0; i < values.length - 1; i++) {
            if (values[i] - values[i + 1] !== 1) {
                // Check for A-2-3-4-5 straight
                if (i === 0 && values[0] === 14 && values[1] === 5) continue;
                return false;
            }
        }
        return true;
    }

    startGame() {
        const betInput = parseInt(document.getElementById('pokerBet').value);
        if (betInput < 50 || betInput > 2000) {
            this.showMessage('Bet must be between $50 and $2000', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.betAmount = betInput;
        this.pot = betInput * 3; // Player + 2 opponents
        gameState.updateBalance(-this.betAmount);
        
        this.deck = this.createDeck();
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.communityCards = [this.deck.pop(), this.deck.pop(), this.deck.pop()];

        // Display cards
        document.getElementById('playerPokerHand').innerHTML = '';
        this.playerHand.forEach(card => this.displayCard(card, document.getElementById('playerPokerHand')));
        
        document.getElementById('communityCards').innerHTML = '';
        this.communityCards.forEach(card => this.displayCard(card, document.getElementById('communityCards')));
        
        document.getElementById('potAmount').textContent = this.pot.toLocaleString();
        
        this.gameActive = true;
        document.getElementById('startPokerBtn').style.display = 'none';
        document.getElementById('pokerControls').style.display = 'flex';

        this.showMessage('Make your decision!', 'info');
    }

    call() {
        if (!this.gameActive) return;
        this.resolveGame(1);
    }

    raise() {
        if (!this.gameActive) return;
        if (this.betAmount * 2 > gameState.balance) {
            this.showMessage('Insufficient balance to raise', 'error');
            return;
        }
        const additionalBet = this.betAmount;
        this.pot += additionalBet * 3;
        gameState.updateBalance(-additionalBet);
        document.getElementById('potAmount').textContent = this.pot.toLocaleString();
        this.resolveGame(1.2);
    }

    fold() {
        if (!this.gameActive) return;
        this.gameActive = false;
        this.showMessage('You folded. You lose your bet.', 'error');
        gameState.addGameStat('poker', false);
        document.getElementById('startPokerBtn').style.display = 'block';
        document.getElementById('pokerControls').style.display = 'none';
    }

    resolveGame(winMultiplier) {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        
        // Add remaining community cards
        while (this.communityCards.length < 5) {
            this.communityCards.push(this.deck.pop());
        }
        
        document.getElementById('communityCards').innerHTML = '';
        this.communityCards.forEach(card => this.displayCard(card, document.getElementById('communityCards')));

        // Evaluate hands
        const allCards = [...this.playerHand, ...this.communityCards];
        const playerHandEval = this.evaluateHand(allCards);
        
        // Simulate opponents (simplified - just random comparison)
        const opponentWinChance = Math.random();
        const winThreshold = 0.4 * winMultiplier;
        
        if (opponentWinChance < winThreshold) {
            gameState.updateBalance(this.pot);
            gameState.addGameStat('poker', true);
            gameState.addWinLoss(this.pot);
            this.showMessage(`You win with ${playerHandEval.name}! +$${this.pot.toLocaleString()}`, 'success');
        } else {
            gameState.addGameStat('poker', false);
            gameState.addWinLoss(-this.betAmount);
            this.showMessage(`Opponents win. You had ${playerHandEval.name}.`, 'error');
        }

        document.getElementById('startPokerBtn').style.display = 'block';
        document.getElementById('pokerControls').style.display = 'none';
        this.pot = 0;
        document.getElementById('potAmount').textContent = '0';
    }
}

// Slots Game
class SlotsGame {
    constructor() {
        this.symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '🎰'];
        this.isSpinning = false;
        this.init();
    }

    init() {
        document.getElementById('spinBtn').addEventListener('click', () => this.spin());
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('slotsMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }

    countMatches(reels) {
        const counts = {};
        reels.forEach(symbol => {
            counts[symbol] = (counts[symbol] || 0) + 1;
        });
        return counts;
    }

    calculateWin(bet, reels) {
        const counts = this.countMatches(reels);
        const maxCount = Math.max(...Object.values(counts));
        
        if (maxCount === 5) return bet * 100;
        if (maxCount === 4) return bet * 20;
        if (maxCount === 3) return bet * 5;
        if (maxCount === 2) return bet * 2;
        return 0;
    }

    async spin() {
        if (this.isSpinning) return;
        
        const betInput = parseInt(document.getElementById('slotsBet').value);
        if (betInput < 5 || betInput > 500) {
            this.showMessage('Bet must be between $5 and $500', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.isSpinning = true;
        gameState.updateBalance(-betInput);
        
        const reels = document.querySelectorAll('.reel');
        reels.forEach(reel => reel.classList.add('spinning'));

        // Spin animation
        await new Promise(resolve => setTimeout(resolve, 2000));

        const results = [];
        reels.forEach((reel, index) => {
            reel.classList.remove('spinning');
            // Force animation to stop
            const symbolElement = reel.querySelector('.reel-symbol');
            symbolElement.style.animation = 'none';
            // Reflow to restart animation state
            void symbolElement.offsetWidth;
            symbolElement.style.animation = '';
            
            const symbol = this.getRandomSymbol();
            results.push(symbol);
            symbolElement.textContent = symbol;
        });

        const win = this.calculateWin(betInput, results);
        
        if (win > 0) {
            gameState.updateBalance(win);
            gameState.addGameStat('slots', true);
            gameState.addWinLoss(win);
            this.showMessage(`🎉 You won $${win.toLocaleString()}! 🎉`, 'success');
        } else {
            gameState.addGameStat('slots', false);
            gameState.addWinLoss(-betInput);
            this.showMessage('Try again!', 'info');
        }

        this.isSpinning = false;
    }
}

// Roulette Game
class RouletteGame {
    constructor() {
        this.currentBets = [];
        this.numbers = [];
        this.isSpinning = false;
        this.init();
    }

    init() {
        this.createWheelNumbers();
        this.createNumberGrid();
        document.getElementById('spinRouletteBtn').addEventListener('click', () => this.spin());
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.placeBet(e.currentTarget));
        });
    }

    createWheelNumbers() {
        const wheelContainer = document.getElementById('wheelNumbers');
        const rouletteNumbers = [
            0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
            24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
        ];
        const colors = [
            'green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
            'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
            'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
            'black', 'red', 'black', 'red', 'black', 'red', 'black'
        ];
        
        wheelContainer.innerHTML = '';
        rouletteNumbers.forEach((num, index) => {
            const numDiv = document.createElement('div');
            numDiv.className = `wheel-number ${colors[index]}`;
            numDiv.textContent = num;
            wheelContainer.appendChild(numDiv);
        });
    }

    createNumberGrid() {
        const grid = document.getElementById('numberGrid');
        const colors = ['green', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red',
                       'black', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'red',
                       'black', 'red', 'black', 'red', 'black', 'red', 'black', 'red', 'black', 'black',
                       'red', 'black', 'red', 'black', 'red', 'black', 'red'];
        
        for (let i = 1; i <= 36; i++) {
            const btn = document.createElement('button');
            btn.className = `bet-btn wheel-number ${colors[i - 1]}`;
            btn.textContent = i;
            btn.dataset.bet = 'number';
            btn.dataset.value = i;
            btn.addEventListener('click', (e) => this.placeBet(e.currentTarget));
            grid.appendChild(btn);
        }
    }

    placeBet(btn) {
        if (this.isSpinning) return;
        
        const betType = btn.dataset.bet;
        const betValue = btn.dataset.value;
        const betAmount = parseInt(document.getElementById('rouletteBet').value);
        
        if (betAmount < 10 || betAmount > 1000) {
            this.showMessage('Bet must be between $10 and $1000', 'error');
            return;
        }
        if (betAmount > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.currentBets.push({ type: betType, value: betValue, amount: betAmount });
        btn.classList.add('active');
        gameState.updateBalance(-betAmount);
        
        this.updateBetsDisplay();
        this.showMessage(`Bet placed: ${betType} ${betValue} - $${betAmount}`, 'info');
    }

    updateBetsDisplay() {
        const container = document.getElementById('currentBets');
        container.innerHTML = '<h4>Current Bets:</h4>';
        this.currentBets.forEach((bet, index) => {
            const div = document.createElement('div');
            div.className = 'bet-item';
            div.innerHTML = `<span>${bet.type} ${bet.value}</span><span>$${bet.amount}</span>`;
            container.appendChild(div);
        });
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('rouletteMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    checkBet(winningNumber, bet) {
        const num = parseInt(winningNumber);
        
        if (bet.type === 'number') {
            return parseInt(bet.value) === num;
        }
        
        if (bet.type === 'color') {
            if (num === 0) return bet.value === 'green';
            const redNums = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            if (bet.value === 'red') return redNums.includes(num);
            if (bet.value === 'black') return !redNums.includes(num);
            return false;
        }
        
        if (bet.type === 'range') {
            if (num === 0) return false;
            if (bet.value === '1-18') return num >= 1 && num <= 18;
            if (bet.value === '19-36') return num >= 19 && num <= 36;
            if (bet.value === 'even') return num % 2 === 0;
            if (bet.value === 'odd') return num % 2 === 1;
        }
        
        return false;
    }

    calculatePayout(bet, winningNumber) {
        if (bet.type === 'number') {
            return bet.amount * 36;
        }
        if (bet.type === 'color') {
            return bet.amount * 2;
        }
        if (bet.type === 'range') {
            return bet.amount * 2;
        }
        return 0;
    }

    async spin() {
        if (this.isSpinning || this.currentBets.length === 0) {
            this.showMessage('Place bets before spinning!', 'error');
            return;
        }
        
        this.isSpinning = true;
        document.getElementById('spinRouletteBtn').disabled = true;
        
        // Spin wheel animation
        const wheelElement = document.querySelector('.roulette-wheel');
        const ballElement = document.getElementById('ball');
        wheelElement.classList.add('spinning');
        
        // Animate ball moving around the wheel
        const spinDuration = 3000;
        const startTime = Date.now();
        const ballRadius = 185; // Distance from center
        const centerX = 200;
        const centerY = 200;
        
        const animateBall = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / spinDuration, 1);
            
            // Ball moves in a circle, slowing down
            const angle = progress * 30 * Math.PI; // Multiple rotations
            const x = centerX + Math.cos(angle) * ballRadius;
            const y = centerY + Math.sin(angle) * ballRadius;
            
            ballElement.style.left = `${x - 10}px`;
            ballElement.style.top = `${y - 10}px`;
            
            if (elapsed < spinDuration) {
                requestAnimationFrame(animateBall);
            } else {
                // Determine winning number
                const winningNumber = Math.floor(Math.random() * 37);
                wheelElement.classList.remove('spinning');
                
                // Position ball on winning number (simplified)
                const finalAngle = (winningNumber / 37) * 2 * Math.PI;
                const finalX = centerX + Math.cos(finalAngle) * ballRadius;
                const finalY = centerY + Math.sin(finalAngle) * ballRadius;
                ballElement.style.left = `${finalX - 10}px`;
                ballElement.style.top = `${finalY - 10}px`;
                
                this.showMessage(`Winning number: ${winningNumber}`, 'success');
                
                let totalWon = 0;
                let won = false;
                
                this.currentBets.forEach(bet => {
                    if (this.checkBet(winningNumber, bet)) {
                        const payout = this.calculatePayout(bet, winningNumber);
                        totalWon += payout;
                        won = true;
                    }
                });
                
                if (won) {
                    gameState.updateBalance(totalWon);
                    gameState.addGameStat('roulette', true);
                    gameState.addWinLoss(totalWon);
                    this.showMessage(`🎉 You won $${totalWon.toLocaleString()}! 🎉 Winning number: ${winningNumber}`, 'success');
                } else {
                    const totalBet = this.currentBets.reduce((sum, bet) => sum + bet.amount, 0);
                    gameState.addGameStat('roulette', false);
                    gameState.addWinLoss(-totalBet);
                    this.showMessage(`You lost. Winning number: ${winningNumber}`, 'error');
                }
                
                // Reset
                this.currentBets = [];
                document.querySelectorAll('.bet-btn').forEach(btn => btn.classList.remove('active'));
                document.getElementById('currentBets').innerHTML = '';
                this.isSpinning = false;
                document.getElementById('spinRouletteBtn').disabled = false;
            }
        };
        
        animateBall();
    }
}

// Baccarat Game
class BaccaratGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.bankerHand = [];
        this.betSide = null;
        this.betAmount = 0;
        this.gameActive = false;
        this.init();
    }

    init() {
        document.getElementById('startBaccaratBtn').addEventListener('click', () => this.startGame());
        document.getElementById('betPlayerBtn').addEventListener('click', () => this.selectBet('player'));
        document.getElementById('betBankerBtn').addEventListener('click', () => this.selectBet('banker'));
        document.getElementById('betTieBtn').addEventListener('click', () => this.selectBet('tie'));
    }

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value, isRed: suit === '♥' || suit === '♦' });
            }
        }
        return this.shuffle(deck);
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    getCardValue(card) {
        if (['J', 'Q', 'K'].includes(card.value)) return 0;
        if (card.value === 'A') return 1;
        return parseInt(card.value);
    }

    getHandValue(hand) {
        let total = 0;
        for (let card of hand) {
            total += this.getCardValue(card);
        }
        return total % 10;
    }

    displayCard(card, element) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card' + (card.isRed ? ' red' : '');
        cardDiv.textContent = card.suit + ' ' + card.value;
        element.appendChild(cardDiv);
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('baccaratMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    selectBet(side) {
        if (!this.gameActive) {
            this.betSide = side;
            document.querySelectorAll('[data-side]').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-side="${side}"]`).classList.add('active');
        }
    }

    startGame() {
        if (!this.betSide) {
            this.showMessage('Please select a bet first!', 'error');
            return;
        }

        const betInput = parseInt(document.getElementById('baccaratBet').value);
        if (betInput < 50 || betInput > 2000) {
            this.showMessage('Bet must be between $50 and $2000', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.betAmount = betInput;
        this.gameActive = true;
        this.deck = this.createDeck();
        
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.bankerHand = [this.deck.pop(), this.deck.pop()];

        const playerValue = this.getHandValue(this.playerHand);
        const bankerValue = this.getHandValue(this.bankerHand);

        if (playerValue >= 8 || bankerValue >= 8) {
            this.endGame(playerValue, bankerValue);
            return;
        }

        if (playerValue <= 5) {
            this.playerHand.push(this.deck.pop());
        }

        const finalPlayerValue = this.getHandValue(this.playerHand);
        if (finalPlayerValue <= 5 && this.playerHand.length === 3) {
            const thirdCardValue = this.getCardValue(this.playerHand[2]);
            if (bankerValue <= 2 || (bankerValue === 3 && thirdCardValue !== 8) ||
                (bankerValue === 4 && [2,3,4,5,6,7].includes(thirdCardValue)) ||
                (bankerValue === 5 && [4,5,6,7].includes(thirdCardValue)) ||
                (bankerValue === 6 && [6,7].includes(thirdCardValue))) {
                this.bankerHand.push(this.deck.pop());
            }
        } else if (bankerValue <= 5) {
            this.bankerHand.push(this.deck.pop());
        }

        this.endGame(this.getHandValue(this.playerHand), this.getHandValue(this.bankerHand));
    }

    endGame(playerValue, bankerValue) {
        document.getElementById('playerBaccaratHand').innerHTML = '';
        this.playerHand.forEach(card => this.displayCard(card, document.getElementById('playerBaccaratHand')));
        document.getElementById('bankerBaccaratHand').innerHTML = '';
        this.bankerHand.forEach(card => this.displayCard(card, document.getElementById('bankerBaccaratHand')));
        
        document.getElementById('playerBaccaratValue').textContent = `Value: ${playerValue}`;
        document.getElementById('bankerBaccaratValue').textContent = `Value: ${bankerValue}`;

        let winner = 'tie';
        if (playerValue > bankerValue) winner = 'player';
        else if (bankerValue > playerValue) winner = 'banker';

        if (winner === this.betSide || (winner === 'tie' && this.betSide === 'tie')) {
            let payout = this.betAmount;
            if (this.betSide === 'tie') {
                payout = this.betAmount * 9;
            } else if (this.betSide === 'banker') {
                payout = Math.floor(this.betAmount * 1.95);
            } else {
                payout = this.betAmount * 2;
            }
            
            gameState.updateBalance(payout);
            gameState.addGameStat('baccarat', true);
            gameState.addWinLoss(payout);
            this.showMessage(`You win! +$${payout.toLocaleString()}`, 'success');
        } else {
            gameState.updateBalance(-this.betAmount);
            gameState.addGameStat('baccarat', false);
            gameState.addWinLoss(-this.betAmount);
            this.showMessage(`You lost. Winner: ${winner}`, 'error');
        }

        this.gameActive = false;
        this.betSide = null;
        document.querySelectorAll('[data-side]').forEach(btn => btn.classList.remove('active'));
    }
}

// Craps Game
class CrapsGame {
    constructor() {
        this.currentBet = null;
        this.betAmount = 0;
        this.point = null;
        this.init();
    }

    init() {
        document.getElementById('rollCrapsBtn').addEventListener('click', () => this.rollDice());
        document.querySelectorAll('[data-bet]').forEach(btn => {
            if (btn.id === 'rollCrapsBtn' || btn.closest('.craps-table')) return;
            btn.addEventListener('click', (e) => this.selectBet(e.currentTarget.dataset.bet));
        });
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('crapsMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    selectBet(betType) {
        if (this.currentBet === betType) {
            this.currentBet = null;
            document.querySelector(`[data-bet="${betType}"]`)?.classList.remove('active');
        } else {
            if (this.currentBet) {
                document.querySelector(`[data-bet="${this.currentBet}"]`)?.classList.remove('active');
            }
            this.currentBet = betType;
            document.querySelector(`[data-bet="${betType}"]`)?.classList.add('active');
        }
    }

    getDiceFace(value) {
        const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return faces[value - 1];
    }

    rollDice() {
        if (!this.currentBet) {
            this.showMessage('Please select a bet first!', 'error');
            return;
        }

        const betInput = parseInt(document.getElementById('crapsBet').value);
        if (betInput < 25 || betInput > 1000) {
            this.showMessage('Bet must be between $25 and $1000', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.betAmount = betInput;
        gameState.updateBalance(-this.betAmount);

        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2;

        document.getElementById('dice1').textContent = this.getDiceFace(die1);
        document.getElementById('dice2').textContent = this.getDiceFace(die2);
        document.getElementById('diceTotal').textContent = `Total: ${total}`;

        let won = false;
        let payout = 0;

        if (this.currentBet === 'pass') {
            if (this.point === null) {
                if ([7, 11].includes(total)) {
                    won = true;
                    payout = this.betAmount * 2;
                } else if ([2, 3, 12].includes(total)) {
                    // Lost
                } else {
                    this.point = total;
                    this.showMessage(`Point is ${total}. Roll again!`, 'info');
                    return;
                }
            } else {
                if (total === this.point) {
                    won = true;
                    payout = this.betAmount * 2;
                    this.point = null;
                } else if (total === 7) {
                    this.point = null;
                } else {
                    this.showMessage(`Rolled ${total}. Point is ${this.point}. Roll again!`, 'info');
                    return;
                }
            }
        } else if (this.currentBet === 'dont-pass') {
            if (this.point === null) {
                if ([2, 3].includes(total)) {
                    won = true;
                    payout = this.betAmount * 2;
                } else if ([7, 11].includes(total) || total === 12) {
                    // Lost
                } else {
                    this.point = total;
                    this.showMessage(`Point is ${total}. Roll again!`, 'info');
                    return;
                }
            } else {
                if (total === 7) {
                    won = true;
                    payout = this.betAmount * 2;
                    this.point = null;
                } else if (total === this.point) {
                    this.point = null;
                } else {
                    this.showMessage(`Rolled ${total}. Point is ${this.point}. Roll again!`, 'info');
                    return;
                }
            }
        } else if (this.currentBet === 'field') {
            if ([2, 3, 4, 9, 10, 11, 12].includes(total)) {
                won = true;
                if ([2, 12].includes(total)) {
                    payout = this.betAmount * 3;
                } else {
                    payout = this.betAmount * 2;
                }
            }
        } else if (this.currentBet === 'come') {
            if ([7, 11].includes(total)) {
                won = true;
                payout = this.betAmount * 2;
            }
        }

        if (won) {
            gameState.updateBalance(payout);
            gameState.addGameStat('craps', true);
            gameState.addWinLoss(payout);
            this.showMessage(`You win! +$${payout.toLocaleString()}`, 'success');
        } else {
            gameState.addGameStat('craps', false);
            gameState.addWinLoss(-this.betAmount);
            this.showMessage(`You lost. Rolled ${total}`, 'error');
        }

        this.currentBet = null;
        document.querySelectorAll('[data-bet]').forEach(btn => {
            if (!btn.id || !btn.id.includes('Craps')) btn.classList.remove('active');
        });
        this.point = null;
    }
}

// Wheel of Fortune Game
class WheelGame {
    constructor() {
        this.isSpinning = false;
        this.init();
    }

    init() {
        document.getElementById('spinWheelBtn').addEventListener('click', () => this.spin());
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('wheelMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    async spin() {
        if (this.isSpinning) return;

        const betInput = parseInt(document.getElementById('wheelBet').value);
        if (betInput < 25 || betInput > 500) {
            this.showMessage('Bet must be between $25 and $500', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        this.isSpinning = true;
        gameState.updateBalance(-betInput);

        const wheel = document.getElementById('fortuneWheel');
        const segments = [2, 5, 3, 10, 2, 7, 4, 15, 3, 20, 5, 100];
        
        // Determine winning segment BEFORE spinning
        const winningSegment = Math.floor(Math.random() * segments.length);
        const multiplier = segments[winningSegment];

        // Reset wheel position to start
        wheel.style.transform = 'rotate(0deg)';
        
        // Calculate rotation needed
        // Arrow pointer is at top (pointing at 0 degrees)
        // Segments are positioned using --i which rotates them by (i * 30) degrees from top
        // Each segment spans 30 degrees, so center of segment i is at: (i * 30 + 15) degrees from start
        // We want the center of the winning segment to be at the top arrow (0 degrees)
        // Since wheel rotates clockwise, we need: finalRotation = baseRotation - segmentCenterAngle
        const segmentAngle = 360 / 12; // 30 degrees per segment
        const baseRotation = 3600; // 10 full spins (3600 degrees) for visual effect
        const segmentCenterAngle = (winningSegment * segmentAngle) + (segmentAngle / 2); // Center of segment
        const finalRotation = baseRotation - segmentCenterAngle;

        // Apply the rotation using CSS custom property for smoother animation
        wheel.style.setProperty('--final-rotation', `${finalRotation}deg`);
        wheel.classList.add('spinning');
        
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        wheel.classList.remove('spinning');
        // Set final position
        wheel.style.transform = `rotate(${finalRotation}deg)`;

        const win = betInput * multiplier;
        
        gameState.updateBalance(win);
        gameState.addGameStat('wheel', true);
        gameState.addWinLoss(win);
        
        if (multiplier === 100) {
            this.showMessage(`🎉 JACKPOT! You won $${win.toLocaleString()}! 🎉`, 'success');
        } else {
            this.showMessage(`You won ${multiplier}x! +$${win.toLocaleString()}!`, 'success');
        }

        this.isSpinning = false;
    }
}

// Dice Game
class DiceGame {
    constructor() {
        this.prediction = null;
        this.init();
    }

    init() {
        document.getElementById('rollDiceBtn').addEventListener('click', () => this.rollDice());
        document.querySelectorAll('[data-prediction]').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectPrediction(e.currentTarget.dataset.prediction));
        });
    }

    showMessage(text, type = 'info') {
        const messageEl = document.getElementById('diceMessage');
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
    }

    selectPrediction(prediction) {
        if (this.prediction === prediction) {
            this.prediction = null;
            document.querySelector(`[data-prediction="${prediction}"]`).classList.remove('active');
        } else {
            if (this.prediction) {
                document.querySelector(`[data-prediction="${this.prediction}"]`).classList.remove('active');
            }
            this.prediction = prediction;
            document.querySelector(`[data-prediction="${prediction}"]`).classList.add('active');
        }
    }

    getDiceFace(value) {
        const faces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return faces[value - 1];
    }

    async rollDice() {
        if (!this.prediction) {
            this.showMessage('Please select a prediction first!', 'error');
            return;
        }

        const betInput = parseInt(document.getElementById('diceBet').value);
        if (betInput < 10 || betInput > 500) {
            this.showMessage('Bet must be between $10 and $500', 'error');
            return;
        }
        if (betInput > gameState.balance) {
            this.showMessage('Insufficient balance', 'error');
            return;
        }

        gameState.updateBalance(-betInput);

        const dice1 = document.getElementById('diceLarge1');
        const dice2 = document.getElementById('diceLarge2');
        const dice3 = document.getElementById('diceLarge3');

        for (let i = 0; i < 10; i++) {
            dice1.textContent = this.getDiceFace(Math.floor(Math.random() * 6) + 1);
            dice2.textContent = this.getDiceFace(Math.floor(Math.random() * 6) + 1);
            dice3.textContent = this.getDiceFace(Math.floor(Math.random() * 6) + 1);
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const die3 = Math.floor(Math.random() * 6) + 1;
        const total = die1 + die2 + die3;

        dice1.textContent = this.getDiceFace(die1);
        dice2.textContent = this.getDiceFace(die2);
        dice3.textContent = this.getDiceFace(die3);
        document.getElementById('diceGameTotal').textContent = `Total: ${total}`;

        let won = false;
        let payout = 0;

        if (this.prediction === 'high' && total >= 11 && total <= 17) {
            won = true;
            payout = betInput * 2;
        } else if (this.prediction === 'low' && total >= 4 && total <= 10) {
            won = true;
            payout = betInput * 2;
        } else if (this.prediction === 'even' && total % 2 === 0) {
            won = true;
            payout = betInput * 2;
        } else if (this.prediction === 'odd' && total % 2 === 1) {
            won = true;
            payout = betInput * 2;
        } else if (this.prediction === 'doubles' && (die1 === die2 || die2 === die3 || die1 === die3)) {
            won = true;
            payout = betInput * 5;
        }

        if (won) {
            gameState.updateBalance(payout);
            gameState.addGameStat('dice', true);
            gameState.addWinLoss(payout);
            this.showMessage(`You win! +$${payout.toLocaleString()}`, 'success');
        } else {
            gameState.addGameStat('dice', false);
            gameState.addWinLoss(-betInput);
            this.showMessage(`You lost. Total: ${total}`, 'error');
        }

        this.prediction = null;
        document.querySelectorAll('[data-prediction]').forEach(btn => btn.classList.remove('active'));
    }
}

// Initialize Application
const gameState = new GameState();
const viewManager = new ViewManager();
const blackjackGame = new BlackjackGame();
const pokerGame = new PokerGame();
const slotsGame = new SlotsGame();
const rouletteGame = new RouletteGame();
const baccaratGame = new BaccaratGame();
const crapsGame = new CrapsGame();
const wheelGame = new WheelGame();
const diceGame = new DiceGame();

// Initial UI update
gameState.updateUI();

