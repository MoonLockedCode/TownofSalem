// Game Phases and Turn Management

class GamePhase {
    constructor(gameState) {
        this.gameState = gameState;
    }

    getCurrentPhase() {
        return 'day'; // Overridden in subclasses
    }

    async execute() {
        // Overridden in subclasses
    }
}

class DayPhase extends GamePhase {
    getCurrentPhase() {
        return 'day';
    }

    async execute() {
        const { players, dayCount, messageLog } = this.gameState;
        
        addLog(`Day ${dayCount}:  Discussion Phase`, 'event');
        await this.discussionPhase();
        
        if (this.gameState.gameOver) return;
        
        await this.votingPhase();
    }

    async discussionPhase() {
        ui.updatePhaseDisplay(`☀️ Day ${this.gameState.dayCount}`, 'Players discuss who to lynch.. .');
        
        return new Promise(resolve => {
            setTimeout(resolve, 3000);
        });
    }

    async votingPhase() {
        const { players } = this.gameState;
        const alivePlayers = players.filter(p => ! p.dead);
        
        if (alivePlayers.length === 0) {
            endGame();
            return;
        }

        ui.updatePhaseDisplay(`☀️ Voting Phase`, 'Select a player to lynch...');
        
        return new Promise(resolve => {
            const actionArea = document.getElementById('actionArea');
            actionArea.innerHTML = `
                <h3>Lynch Vote</h3>
                <p>Select a player to lynch by majority vote. </p>
                <p id="voteStatus"></p>
            `;

            let selectedPlayer = null;
            const votes = {};

            // Simulate voting
            alivePlayers.forEach(player => {
                votes[player.number] = getRandomPlayer(alivePlayers);
            });

            const voteResults = {};
            Object.values(votes).forEach(votedPlayer => {
                voteResults[votedPlayer.number] = (voteResults[votedPlayer. number] || 0) + 1;
            });

            const maxVotes = Math.max(...Object.values(voteResults));
            const lynchCandidates = Object.keys(voteResults).filter(
                playerNum => voteResults[playerNum] === maxVotes
            );

            let lynchedPlayer;
            if (lynchCandidates. length === 1) {
                lynchedPlayer = this.gameState.players[parseInt(lynchCandidates[0]) - 1];
            } else {
                const randomIndex = Math.floor(Math. random() * lynchCandidates.length);
                lynchedPlayer = this.gameState. players[parseInt(lynchCandidates[randomIndex]) - 1];
            }

            setTimeout(() => {
                lynchedPlayer.dead = true;
                lynchedPlayer.causeOfDeath = 'Lynched';
                addLog(`Player ${lynchedPlayer.number} was lynched! `, 'death');
                
                checkWinConditions();
                resolve();
            }, 2000);
        });
    }
}

class NightPhase extends GamePhase {
    getCurrentPhase() {
        return 'night';
    }

    async execute() {
        const { nightCount, players } = this.gameState;
        
        addLog(`Night ${nightCount}`, 'event');
        
        // Get night roles that are still alive
        const activeNightRoles = getNightRoles().filter(role => {
            const player = players.find(p => p.role === role && !p.dead);
            return player !== undefined;
        });

        for (const role of activeNightRoles) {
            if (this.gameState.gameOver) break;
            
            const player = players.find(p => p. role === role && !p.dead);
            if (player) {
                await this.executeNightRole(player, role);
            }
        }

        // Resolve all night actions
        this.resolveNightActions();
    }

    async executeNightRole(player, role) {
        return new Promise(resolve => {
            ui.updatePhaseDisplay(`🌙 Night ${this.gameState.nightCount}`, `${player.number} - ${role}'s turn... `);
            
            // Show role reveal screen for this player
            setTimeout(() => {
                showRoleReveal(player);
                
                setTimeout(() => {
                    resolve();
                }, 3000);
            }, 500);
        });
    }

    resolveNightActions() {
        const { players, nightActions } = this.gameState;
        
        // Resolve kills
        const kills = nightActions.filter(a => a.type === 'kill');
        kills.forEach(action => {
            const target = players[action.target - 1];
            if (! target.dead) {
                target.dead = true;
                target.causeOfDeath = action.cause;
                addLog(`Player ${target.number} was killed by ${action.cause}! `, 'death');
            }
        });

        // Resolve investigations
        const investigations = nightActions. filter(a => a.type === 'investigate');
        investigations.forEach(action => {
            // Handle investigation results
        });

        // Clear night actions
        this.gameState.nightActions = [];
    }
}

function getRandomPlayer(players) {
    return players[Math.floor(Math.random() * players.length)];
}
