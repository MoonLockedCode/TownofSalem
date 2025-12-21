// UI Management and Display Functions

const ui = {
    updatePhaseDisplay(title, description) {
        const phaseDisplay = document.getElementById('phaseDisplay');
        phaseDisplay.innerHTML = `
            <h2>${title}</h2>
            <p>${description}</p>
        `;
    },

    updatePlayerGrid() {
        const { players } = window.gameState;
        const grid = document.getElementById('playerGrid');
        grid.innerHTML = '';

        players.forEach(player => {
            const card = document.createElement('div');
            card.className = `player-card ${player.dead ? 'dead' : ''}`;
            card.innerHTML = `
                <div class="player-number">P${player.number}</div>
                <div class="player-icon">${player.dead ? '†' : '👤'}</div>
                <div class="player-status">${player.dead ? 'Dead' : 'Alive'}</div>
                ${player.causeOfDeath ? `<div class="cause">${player.causeOfDeath}</div>` : ''}
            `;

            if (!player.dead) {
                card.addEventListener('click', () => {
                    selectPlayer(player. number);
                });
            }

            grid.appendChild(card);
        });
    },

    updateStats() {
        const { players, dayCount } = window.gameState;
        const aliveCount = players.filter(p => !p.dead).length;
        
        document.getElementById('dayCounter').textContent = `Day ${dayCount}`;
        document.getElementById('aliveCount').textContent = `${aliveCount} alive`;
    },

    switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
};

function changePlayerCount(delta) {
    const input = document.getElementById('playerCount');
    const newValue = parseInt(input.value) + delta;
    
    if (newValue >= 5 && newValue <= 15) {
        input.value = newValue;
        updateRoleInfo();
    }
}

function updateRoleInfo() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const distribution = getRoleDistribution(playerCount);
    
    const infoText = `${distribution.town} Town • ${distribution.mafia} Mafia • ${distribution.neutral} Neutral`;
    document.getElementById('roleInfo').textContent = infoText;
}

function getRoleDistribution(playerCount) {
    const distributions = {
        5: { town: 3, mafia: 1, neutral: 1 },
        6: { town: 4, mafia: 1, neutral: 1 },
        7: { town: 4, mafia: 2, neutral: 1 },
        8: { town: 5, mafia: 2, neutral: 1 },
        9: { town: 5, mafia: 2, neutral: 2 },
        10: { town: 6, mafia: 2, neutral: 2 },
        11: { town: 6, mafia: 3, neutral: 2 },
        12: { town: 7, mafia:  3, neutral: 2 },
        13: { town:  7, mafia: 3, neutral: 3 },
        14: { town: 8, mafia: 3, neutral: 3 },
        15: { town: 8, mafia: 4, neutral: 3 }
    };
    
    return distributions[playerCount] || distributions[5];
}

function startGame() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    window.gameState = initializeGame(playerCount);
    ui.switchScreen('roleAssignmentScreen');
    assignRoles();
}

function showRules() {
    ui.switchScreen('rulesScreen');
}

function hideRules() {
    ui.switchScreen('mainMenu');
}

function showRoleReveal(player) {
    const screen = document.getElementById('roleRevealScreen');
    document.getElementById('revealPlayerName').textContent = `Player ${player.number}`;
    
    const roleDisplay = document.getElementById('roleDisplay');
    roleDisplay.innerHTML = `
        ${ROLE_SYMBOLS[player.role]}<br>
        <strong>${player.role}</strong>
    `;

    if (isMafiaRole(player.role)) {
        const mafiaTeam = window.gameState.players
            .filter(p => isMafiaRole(p.role))
            .map(p => `Player ${p.number} – ${p.role}`)
            .join('<br>');
        
        document.getElementById('mafiaTeam').style.display = 'block';
        document.getElementById('mafiaTeam').innerHTML = `
            <strong>Mafia Team:</strong><br>${mafiaTeam}
        `;
    } else {
        document.getElementById('mafiaTeam').style.display = 'none';
    }

    ui.switchScreen('roleRevealScreen');
}

function selectPlayer(playerNumber) {
    const cards = document.querySelectorAll('. player-card');
    cards.forEach(card => card.classList. remove('selected'));
    
    if (window.selectedPlayer === playerNumber) {
        window.selectedPlayer = null;
    } else {
        window.selectedPlayer = playerNumber;
        cards[playerNumber - 1].classList. add('selected');
    }
}

function addLog(message, type = 'event') {
    const logContent = document.getElementById('logContent');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    logContent.appendChild(entry);
    logContent.scrollTop = logContent. scrollHeight;
    
    if (! window.gameState.messageLog) {
        window.gameState. messageLog = [];
    }
    window.gameState.messageLog.push(message);
}

function returnToMenu() {
    window.selectedPlayer = null;
    ui. switchScreen('mainMenu');
}
