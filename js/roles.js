// Role Definitions
const ROLES = {
    TOWN:  {
        SHERIFF: 'Sheriff',
        INVESTIGATOR: 'Investigator',
        DOCTOR: 'Doctor',
        BODYGUARD: 'Bodyguard',
        VIGILANTE: 'Vigilante',
        VETERAN: 'Veteran',
        TRAPPER: 'Trapper'
    },
    MAFIA: {
        GODFATHER: 'Godfather',
        MAFIOSO: 'Mafioso',
        FRAMER: 'Framer',
        JANITOR: 'Janitor'
    },
    NEUTRAL: {
        JESTER: 'Jester',
        EXECUTIONER: 'Executioner',
        SURVIVOR: 'Survivor',
        AMNESIAC: 'Amnesiac',
        SERIAL_KILLER: 'Serial Killer',
        ARSONIST: 'Arsonist',
        PLAGUE_DOCTOR: 'Plague Doctor',
        WEREWOLF: 'Werewolf'
    }
};

const ROLE_DESCRIPTIONS = {
    [ROLES. TOWN.SHERIFF]: 'Investigates players and reveals their alignment (Good/Bad/Neutral)',
    [ROLES.TOWN.INVESTIGATOR]:  'Investigates players and reveals their exact role',
    [ROLES. TOWN.DOCTOR]: 'Heals one player per night, preventing night kills',
    [ROLES. TOWN.BODYGUARD]:  'Protects a player; if attacked, both bodyguard and attacker die',
    [ROLES. TOWN.VIGILANTE]: 'Shoots one player at night; survives if kills Mafia, dies otherwise',
    [ROLES. TOWN.VETERAN]: 'Can go on alert 3 times; kills all visitors while alert',
    [ROLES. TOWN.TRAPPER]: 'Places traps (3 total); kills first visitor',
    
    [ROLES.MAFIA.GODFATHER]: 'Leads the Mafia; chooses kill target, appears good to Sheriff',
    [ROLES. MAFIA.MAFIOSO]:  'Performs the Mafia kill; becomes Godfather if Godfather dies',
    [ROLES. MAFIA.FRAMER]: 'Makes target appear suspicious to Sheriff',
    [ROLES.MAFIA.JANITOR]: 'Can clean one Mafia kill; hides role of cleaned player',
    
    [ROLES.NEUTRAL.JESTER]: 'Wins only if lynched by vote',
    [ROLES.NEUTRAL.EXECUTIONER]: 'Chooses target on Night 1; wins if target is lynched',
    [ROLES. NEUTRAL.SURVIVOR]: 'Wins with any faction if alive at end; has 4 vests for protection',
    [ROLES. NEUTRAL.AMNESIAC]: 'May become another role (except Jester or completed Executioner)',
    [ROLES.NEUTRAL.SERIAL_KILLER]: 'Kills one player per night; immune to night attacks',
    [ROLES. NEUTRAL.ARSONIST]: 'Douses players, then ignites to kill all doused',
    [ROLES. NEUTRAL.PLAGUE_DOCTOR]: 'Infects players; wins when all are infected',
    [ROLES. NEUTRAL.WEREWOLF]:  'Acts every 3rd night; kills on active nights and becomes invincible'
};

const ROLE_SYMBOLS = {
    [ROLES. TOWN.SHERIFF]: '👮',
    [ROLES. TOWN.INVESTIGATOR]: '🔍',
    [ROLES.TOWN.DOCTOR]:  '⚕️',
    [ROLES.TOWN.BODYGUARD]: '🛡️',
    [ROLES.TOWN.VIGILANTE]: '🔫',
    [ROLES. TOWN.VETERAN]: '⚔️',
    [ROLES.TOWN.TRAPPER]: '🪤',
    
    [ROLES.MAFIA.GODFATHER]: '👑',
    [ROLES. MAFIA.MAFIOSO]:  '🔫',
    [ROLES. MAFIA.FRAMER]:  '🎭',
    [ROLES. MAFIA.JANITOR]:  '🧹',
    
    [ROLES.NEUTRAL. JESTER]: '🤡',
    [ROLES. NEUTRAL.EXECUTIONER]: '⚰️',
    [ROLES.NEUTRAL.SURVIVOR]:  '🛡️',
    [ROLES.NEUTRAL.AMNESIAC]: '❓',
    [ROLES. NEUTRAL.SERIAL_KILLER]: '💀',
    [ROLES.NEUTRAL.ARSONIST]: '🔥',
    [ROLES.NEUTRAL.PLAGUE_DOCTOR]: '🦠',
    [ROLES.NEUTRAL.WEREWOLF]: '🐺'
};

function getRoleCategory(role) {
    for (const category in ROLES) {
        for (const roleKey in ROLES[category]) {
            if (ROLES[category][roleKey] === role) {
                return category;
            }
        }
    }
    return null;
}

function isTownRole(role) {
    return getRoleCategory(role) === 'TOWN';
}

function isMafiaRole(role) {
    return getRoleCategory(role) === 'MAFIA';
}

function isNeutralRole(role) {
    return getRoleCategory(role) === 'NEUTRAL';
}

function isKillingRole(role) {
    const killingRoles = [
        ROLES.TOWN.VIGILANTE,
        ROLES. TOWN.VETERAN,
        ROLES.MAFIA.GODFATHER,
        ROLES.MAFIA. MAFIOSO,
        ROLES.NEUTRAL.SERIAL_KILLER,
        ROLES.NEUTRAL. WEREWOLF,
        ROLES.TOWN.TRAPPER
    ];
    return killingRoles.includes(role);
}

function getNightRoles() {
    return [
        ROLES.TOWN.SHERIFF,
        ROLES.TOWN.INVESTIGATOR,
        ROLES.TOWN. DOCTOR,
        ROLES. TOWN.BODYGUARD,
        ROLES.TOWN. VIGILANTE,
        ROLES.TOWN.VETERAN,
        ROLES.TOWN. TRAPPER,
        ROLES.MAFIA.GODFATHER,
        ROLES.MAFIA.MAFIOSO,
        ROLES. MAFIA.FRAMER,
        ROLES.MAFIA. JANITOR,
        ROLES. NEUTRAL.EXECUTIONER,
        ROLES. NEUTRAL.SERIAL_KILLER,
        ROLES.NEUTRAL.WEREWOLF,
        ROLES.NEUTRAL. ARSONIST,
        ROLES. NEUTRAL.PLAGUE_DOCTOR
    ];
}

function getRandomRole(availableRoles) {
    return availableRoles[Math.floor(Math.random() * availableRoles.length)];
}
