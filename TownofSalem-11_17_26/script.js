
// ============================================================
// MURDER AT TOWN SQUARE
// COMPLETE CORRECTED JAVASCRIPT
// Pass-and-Play Edition
// ============================================================

// ---------- ROLE DATA ----------
const ROLE_DATA = {
  Citizen: {
    faction: "Town",
    type: "Basic",
    night: "No night action.",
    goal: "Eliminate all threats."
  },

  Sheriff: {
    faction: "Town",
    type: "Investigative",
    night: "Check a player's alignment.",
    goal: "Find Bad players."
  },

  Investigator: {
    faction: "Town",
    type: "Investigative",
    night: "Learn a player's exact role. Two uses.",
    goal: "Find dangerous roles."
  },

  Doctor: {
    faction: "Town",
    type: "Protective",
    night: "Heal one player from attacks.",
    goal: "Keep Town alive."
  },

  Bodyguard: {
    faction: "Town",
    type: "Protective",
    night: "Guard a player. You die with attacker if they're attacked.",
    goal: "Protect important Town members."
  },

  Vigilante: {
    faction: "Town",
    type: "Killing",
    night: "Shoot one player. Two bullets.",
    goal: "Eliminate threats."
  },

  Veteran: {
    faction: "Town",
    type: "Killing/Defensive",
    night: "Go on Alert. Kill all visitors. Three alerts.",
    goal: "Protect the Town by eliminating attackers."
  },

  Tracker: {
    faction: "Town",
    type: "Investigative",
    night: "Track a player to see who they visit.",
    goal: "Find suspicious activity."
  },

  Lookout: {
    faction: "Town",
    type: "Investigative",
    night: "Watch a player to see who visits them.",
    goal: "Discover criminals through their actions."
  },

  Medium: {
    faction: "Town",
    type: "Information",
    night: "Communicate privately with an eliminated player.",
    goal: "Use information from the dead to help the Town."
  },

  Transporter: {
    faction: "Town",
    type: "Support",
    night: "Swap two players. Actions targeting one affect the other.",
    goal: "Protect allies and confuse enemies."
  },

  Godfather: {
    faction: "Mafia",
    type: "Leader",
    night: "Choose the Mafia attack target. Appears Good to Sheriff.",
    goal: "Control the Town."
  },

  Mafioso: {
    faction: "Mafia",
    type: "Killing",
    night: "Perform Mafia attack. Becomes Godfather if original dies.",
    goal: "Help Mafia win."
  },

  Blackmailer: {
    faction: "Mafia",
    type: "Control",
    night: "Blackmail a player. They can't share info during day.",
    goal: "Prevent the Town from sharing information."
  },

  Consigliere: {
    faction: "Mafia",
    type: "Investigative",
    night: "Investigate a player to learn exact role. Two uses.",
    goal: "Find important roles to eliminate."
  },

  Janitor: {
    faction: "Mafia",
    type: "Deception",
    night: "Clean a dead player to hide their role. Three uses.",
    goal: "Keep the Town from learning important information."
  },

  Framer: {
    faction: "Mafia",
    type: "Deception",
    night: "Frame a player to appear suspicious to investigations.",
    goal: "Make innocent players appear guilty."
  },

  Disguiser: {
    faction: "Mafia",
    type: "Deception",
    night: "Disguise as another player. Investigations see that role.",
    goal: "Hide the Mafia's identities."
  },

  Forger: {
    faction: "Mafia",
    type: "Deception",
    night: "Forge a player's death message with false information.",
    goal: "Confuse the Town after a death."
  },

  Ambusher: {
    faction: "Mafia",
    type: "Killing/Defensive",
    night: "Ambush a player. Visitors to them are attacked.",
    goal: "Eliminate important Town roles."
  },

  Hypnotist: {
    faction: "Mafia",
    type: "Deception",
    night: "Hypnotize a player with false messages.",
    goal: "Mislead the Town."
  },

  Consort: {
    faction: "Mafia",
    type: "Roleblocker",
    night: "Block one player's night action.",
    goal: "Stop important roles."
  },

  Survivor: {
    faction: "Neutral",
    type: "Survival",
    night: "Use one of four bulletproof vests.",
    goal: "Survive until the end of the game."
  },

  Jester: {
    faction: "Neutral",
    type: "Trickster",
    night: "No night action.",
    goal: "Be executed by the Town."
  },

  Executioner: {
    faction: "Neutral",
    type: "Manipulation",
    night: "No night action.",
    goal: "Get your target executed."
  },

  "Serial Killer": {
    faction: "Neutral Evil",
    type: "Killing",
    night: "Attack one player.",
    goal: "Be the last player alive."
  },

  Arsonist: {
    faction: "Neutral Evil",
    type: "Killing",
    night: "Douse a player or ignite all doused players.",
    goal: "Eliminate everyone else and survive."
  },

  Werewolf: {
    faction: "Neutral Evil",
    type: "Killing",
    night: "Attack on full moon nights. Also attacks visitors.",
    goal: "Eliminate all other players."
  },

  Witch: {
    faction: "Neutral",
    type: "Control",
    night: "Control a player to use their ability on another target.",
    goal: "Survive and complete your objective."
  },

  Amnesiac: {
    faction: "Neutral",
    type: "Role Changing",
    night: "Remember a dead player's role to become that role.",
    goal: "Complete the goal of the role you remember."
  },

  "Guardian Angel": {
    faction: "Neutral",
    type: "Protection",
    night: "Protect your assigned target from attacks.",
    goal: "Keep your assigned player alive."
  },

  Pirate: {
    faction: "Neutral",
    type: "Duelist",
    night: "Challenge a player to a duel. Both players secretly choose a move.",
    goal: "Win enough duels."
  },

  Plaguebearer: {
    faction: "Neutral Evil",
    type: "Infection",
    night: "Infect one player each night.",
    goal: "Spread the plague and become Pestilence."
  },

  Pestilence: {
    faction: "Neutral Evil",
    type: "Killing",
    night: "Attack one player. Immune to most attacks.",
    goal: "Be the last player alive."
  },

  Juggernaut: {
    faction: "Neutral Evil",
    type: "Killing",
    night: "Attack one player. Gets stronger after kills.",
    goal: "Eliminate everyone else."
  },

  "Coven Leader": {
    faction: "Coven",
    type: "Leadership",
    night: "Redact a player's information.",
    goal: "Help the Coven eliminate all enemies."
  },

  "Potion Master": {
    faction: "Coven",
    type: "Support",
    night: "Use one random potion: Heal, Attack, or Reveal.",
    goal: "Use potions strategically."
  },

  Necromancer: {
    faction: "Coven",
    type: "Role Copy",
    night: "Use a dead player's ability.",
    goal: "Use fallen players to help the Coven."
  },

  Poisoner: {
    faction: "Coven",
    type: "Killing",
    night: "Poison a player. They die after the poison delay.",
    goal: "Secretly eliminate enemies."
  },

  Medusa: {
    faction: "Coven",
    type: "Killing/Deception",
    night: "Use Stone Gaze to kill visitors.",
    goal: "Eliminate enemies of the Coven."
  },

  "Coven Member": {
    faction: "Coven",
    type: "Basic",
    night: "Assist the Coven's plans.",
    goal: "Help the Coven eliminate all opposing factions."
  }
};

// ============================================================
// LAST WORDS
// ============================================================

const LAST_WORDS = {
  mafia: [
    "\"The shadows took me... find the Godfather!\"",
    "\"They came in the night... the Mafia will pay!\"",
    "\"I knew too much... avenge me, Town!\"",
    "\"Tell my family... it was the Mafia...\""
  ],

  coven: [
    "\"A curse upon the Coven... their magic won't save them!\"",
    "\"I felt the dark magic consume me... beware the witches...\"",
    "\"The Coven's spell was too strong... protect the innocent!\"",
    "\"The necromancy... it's real... stop them!\""
  ],

  serialKiller: [
    "\"A lone figure... a knife... so cold...\"",
    "\"The killer walks among you...\""
  ],

  poison: [
    "\"The poison courses through my veins... find the Poisoner...\"",
    "\"Death by poison... a coward's way to kill...\""
  ],

  execution: [
    "\"The Town has made a grave mistake! I am innocent!\"",
    "\"You'll regret this execution! Find the real killer!\""
  ],

  default: [
    "\"Tell my story... don't let me be forgotten...\"",
    "\"My time has come... finish what I started...\"",
    "\"The game continues without me... play well...\""
  ]
};

// ============================================================
// GAME STATE
// ============================================================

let state = {
  players: [],
  roles: [],

  night: 1,
  phase: "setup",

  actionQueue: [],
  actionIndex: 0,
  actions: {},

  votes: {},
  results: [],
  deathAnnouncements: [],

  dayStarted: false,

  executionerTarget: null,
  guardianTarget: null,

  fullMoon: false,

  dousedPlayers: new Set(),
  infectedPlayers: new Set(),

  juggernautKills: 0,

  redactedPlayers: new Set(),

  blackmailedPlayers: new Set(),
  disguisedPlayers: {},
  framedPlayers: new Set(),
  forgedPlayers: {},
  hypnotizedPlayers: {},

  poisonedPlayers: {},

  transportedPlayers: {},

  roleRevealIndex: 0,

  dayTimerInterval: null,

  transporterSelection: []
};

// ============================================================
// BASIC HELPERS
// ============================================================

const $ = id => document.getElementById(id);

const living = () =>
  state.players.filter(player => player.alive);

const getPlayer = id =>
  state.players.find(player => player.id === Number(id));

const roleInfo = role =>
  ROLE_DATA[role] || {
    faction: "Unknown",
    type: "Unknown",
    night: "Unknown",
    goal: "Unknown"
  };

const shuffle = array => {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
};

function factionOf(player) {
  if (!player) return "Unknown";

  const mafiaRoles = [
    "Godfather",
    "Mafioso",
    "Blackmailer",
    "Consigliere",
    "Janitor",
    "Framer",
    "Disguiser",
    "Forger",
    "Ambusher",
    "Hypnotist",
    "Consort"
  ];

  const covenRoles = [
    "Coven Leader",
    "Potion Master",
    "Necromancer",
    "Poisoner",
    "Medusa",
    "Coven Member"
  ];

  if (mafiaRoles.includes(player.role)) {
    return "Mafia";
  }

  if (covenRoles.includes(player.role)) {
    return "Coven";
  }

  return roleInfo(player.role).faction;
}

function isMafia(player) {
  return factionOf(player) === "Mafia";
}

function isCoven(player) {
  return factionOf(player) === "Coven";
}

function isEvil(player) {
  return (
    isMafia(player) ||
    isCoven(player) ||
    player.role === "Serial Killer" ||
    player.role === "Arsonist" ||
    player.role === "Werewolf" ||
    player.role === "Pestilence" ||
    player.role === "Juggernaut"
  );
}

function getFactionMembers(faction, players) {
  return players.filter(
    player => factionOf(player) === faction
  );
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

// ============================================================
// LAST WORDS
// ============================================================

function getLastWords(player, causeOfDeath) {
  const category =
    LAST_WORDS[causeOfDeath] ||
    LAST_WORDS.default;

  const words =
    category[
      Math.floor(Math.random() * category.length)
    ];

  if (
    player &&
    state.forgedPlayers[player.id]
  ) {
    return `"${state.forgedPlayers[player.id]}"`;
  }

  return words;
}

// ============================================================
// PLAYER SETUP
// ============================================================

let playerNames = [];

function renderPlayerTags() {
  const container = $("playerTags");

  if (!container) return;

  container.innerHTML =
    playerNames.map((name, index) => `
      <div class="player-tag">
        <span>${escapeHTML(name)}</span>
        <button
          class="remove-tag"
          data-index="${index}">
          ×
        </button>
      </div>
    `).join("");

  $("playerCount").textContent =
    `${playerNames.length} players added (minimum 5)`;

  container
    .querySelectorAll(".remove-tag")
    .forEach(button => {
      button.onclick = () => {
        playerNames.splice(
          Number(button.dataset.index),
          1
        );

        renderPlayerTags();

        $("roleEditor").classList.add("hidden");
        $("roleAssignmentNote").classList.add("hidden");
      };
    });
}

$("addPlayerBtn").onclick = () => {
  const input = $("newPlayerName");

  if (!input) return;

  const name = input.value.trim();

  if (!name) return;

  if (playerNames.includes(name)) {
    showMessage(
      "Each player name must be unique.",
      true
    );
    return;
  }

  playerNames.push(name);
  input.value = "";

  renderPlayerTags();

  $("roleEditor").classList.add("hidden");
  $("roleAssignmentNote").classList.add("hidden");
};

$("newPlayerName").addEventListener(
  "keydown",
  event => {
    if (event.key === "Enter") {
      $("addPlayerBtn").click();
    }
  }
);

$("clearPlayersBtn").onclick = () => {
  playerNames = [];

  renderPlayerTags();

  $("roleEditor").classList.add("hidden");
  $("roleAssignmentNote").classList.add("hidden");

  showMessage("");
};

function showMessage(text, error = false) {
  $("setupMessage").textContent = text;

  $("setupMessage").className =
    error
      ? "message error"
      : "message";
}

// ============================================================
// BALANCED ROLE SELECTION
// Mayor and Jailor have been completely removed.
// ============================================================

function balancedRoles(count) {
  if (count < 5) return null;

  const townRoles = [
    "Sheriff",
    "Doctor",
    "Investigator",
    "Bodyguard",
    "Vigilante",
    "Tracker",
    "Lookout",
    "Medium",
    "Transporter",
    "Veteran",
    "Citizen"
  ];

  const mafiaRoles = [
    "Godfather",
    "Mafioso",
    "Consigliere",
    "Blackmailer",
    "Janitor",
    "Framer",
    "Disguiser",
    "Forger",
    "Ambusher",
    "Hypnotist",
    "Consort"
  ];

  const neutralRoles = [
    "Survivor",
    "Jester",
    "Executioner",
    "Serial Killer",
    "Arsonist",
    "Werewolf",
    "Witch",
    "Amnesiac",
    "Guardian Angel",
    "Pirate",
    "Plaguebearer",
    "Juggernaut"
  ];

  const covenRoles = [
    "Coven Leader",
    "Potion Master",
    "Necromancer",
    "Poisoner",
    "Medusa",
    "Coven Member"
  ];

  const roles = [];

  let townCount;
  let mafiaCount;
  let neutralCount;

  if (count <= 6) {
    townCount = count - 2;
    mafiaCount = 1;
    neutralCount = 1;
  } else if (count <= 10) {
    townCount = Math.ceil(count * 0.6);
    mafiaCount = 2;
    neutralCount =
      count - townCount - mafiaCount;
  } else {
    townCount = Math.floor(count * 0.6);
    mafiaCount = Math.max(
      2,
      Math.floor(count * 0.25)
    );
    neutralCount =
      count - townCount - mafiaCount;
  }

  const shuffledTown = shuffle(townRoles);
  const shuffledMafia = shuffle(mafiaRoles);
  const shuffledNeutral = shuffle(neutralRoles);

  for (let i = 0; i < townCount; i++) {
    roles.push(
      shuffledTown[i % shuffledTown.length]
    );
  }

  for (let i = 0; i < mafiaCount; i++) {
    roles.push(
      shuffledMafia[i % shuffledMafia.length]
    );
  }

  for (let i = 0; i < neutralCount; i++) {
    roles.push(
      shuffledNeutral[i % shuffledNeutral.length]
    );
  }

  return roles.slice(0, count);
}

// ============================================================
// ROLE EDITOR
// ============================================================

function makeRoleEditor(roles) {
  const editor = $("roleEditor");

  if (!editor) return;

  let html = `
    <h3>Game Role List</h3>
    <p class="info-text">
      Choose the roles that will be in the game. The game randomly assigns them to players.
    </p>
  `;

  roles.forEach((role, index) => {
    html += `
      <div class="role-row">
        <label>
          Role ${index + 1}
        </label>

        <select
          class="role-choice"
          data-role-slot="${index}">
          ${Object.keys(ROLE_DATA)
            .map(optionRole => `
              <option
                value="${escapeHTML(optionRole)}"
                ${role === optionRole ? "selected" : ""}>
                ${escapeHTML(optionRole)}
              </option>
            `)
            .join("")}
        </select>
      </div>
    `;
  });

  editor.innerHTML = html;
  editor.classList.remove("hidden");

  $("roleAssignmentNote").classList.remove("hidden");
}

$("balanceButton").onclick = () => {
  if (playerNames.length < 5) {
    return showMessage(
      "Add at least 5 players.",
      true
    );
  }

  const roles =
    balancedRoles(playerNames.length);

  if (!roles) {
    return showMessage(
      "Use at least 5 players.",
      true
    );
  }

  makeRoleEditor(roles);

  showMessage(
    `${roles.length} roles added to the game list. Adjust the list above; assignments stay random.`
  );
};

// ============================================================
// START GAME
// ============================================================

$("startButton").onclick = () => {
  if (playerNames.length < 5) {
    return showMessage(
      "Add at least 5 players.",
      true
    );
  }

  let roles;

  const choices =
    [...document.querySelectorAll(".role-choice")];

  if (choices.length === playerNames.length) {
    roles = choices.map(
      select => select.value
    );
  } else {
    roles =
      balancedRoles(playerNames.length);

    if (!roles) {
      return showMessage(
        "Use at least 5 players.",
        true
      );
    }
  }

  if (
    !roles ||
    roles.length !== playerNames.length
  ) {
    return showMessage(
      `Select exactly ${playerNames.length} roles.`,
      true
    );
  }

  state.players =
    shuffle(
      playerNames.map((name, index) => ({
        id: index,
        name,
        role: null,

        alive: true,

        bullets: 0,
        vests: 0,
        investigations: 0,
        alerts: 0,
        cleans: 0,

        revealed: false,

        poisoned: false,
        doused: false,
        infected: false,
        blackmailed: false,
        hypnotized: false,
        controlled: false,
        roleblocked: false,

        potionUses: {
          heal: 0,
          attack: 0,
          reveal: 0
        },

        pirateDuelsWon: 0
      }))
    );

  const shuffledRoles =
    shuffle(roles);

  state.players.forEach(
    (player, index) => {
      player.role =
        shuffledRoles[index];

      if (player.role === "Vigilante") {
        player.bullets = 2;
      }

      if (player.role === "Survivor") {
        player.vests = 4;
      }

      if (
        player.role === "Investigator" ||
        player.role === "Consigliere"
      ) {
        player.investigations = 2;
      }

      if (player.role === "Veteran") {
        player.alerts = 3;
      }

      if (player.role === "Janitor") {
        player.cleans = 3;
      }

      if (player.role === "Potion Master") {
        player.potionUses = {
          heal: 1,
          attack: 1,
          reveal: 1
        };
      }

      if (player.role === "Pirate") {
        player.pirateDuelsWon = 0;
      }
    }
  );

  // ----------------------------------------------------------
  // EXECUTIONER TARGET
  // ----------------------------------------------------------

  const executioner =
    state.players.find(
      player =>
        player.role === "Executioner"
    );

  if (executioner) {
    const targets =
      state.players.filter(
        player =>
          player.id !== executioner.id &&
          player.role !== "Jester"
      );

    state.executionerTarget =
      targets.length
        ? targets[
            Math.floor(
              Math.random() * targets.length
            )
          ].id
        : null;
  }

  // ----------------------------------------------------------
  // GUARDIAN ANGEL TARGET
  // ----------------------------------------------------------

  const guardian =
    state.players.find(
      player =>
        player.role === "Guardian Angel"
    );

  if (guardian) {
    const targets =
      state.players.filter(
        player =>
          player.id !== guardian.id &&
          factionOf(player) === "Town"
      );

    state.guardianTarget =
      targets.length
        ? targets[
            Math.floor(
              Math.random() * targets.length
            )
          ].id
        : null;
  }

  state.fullMoon = false;
  state.privateNightResults = {};

  state.juggernautKills = 0;

  state.redactedPlayers =
    new Set();

  state.dousedPlayers =
    new Set();

  state.infectedPlayers =
    new Set();

  state.blackmailedPlayers =
    new Set();

  state.framedPlayers =
    new Set();

  state.forgedPlayers = {};

  state.poisonedPlayers = {};

  state.roleRevealIndex = 0;

  state.deathAnnouncements = [];

  $("setupScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");

  renderPlayers();
  announcePhase();

  showNextRoleReveal();
};

// ============================================================
// ROLE REVEAL SEQUENCE
// ============================================================

function showNextRoleReveal() {
  if (
    state.roleRevealIndex >=
    state.players.length
  ) {
    beginNight();
    return;
  }

  const player =
    state.players[state.roleRevealIndex];

  $("passTitle").textContent =
    `Pass the device to ${player.name}`;

  $("passText").textContent =
    "Keep all other players from seeing this screen. Press ready when only you can see it.";

  $("passOverlay").classList.remove("hidden");

  $("continueButton").onclick = () => {
    $("passOverlay").classList.add("hidden");

    showRoleInfo(player);
  };
}

function showRoleInfo(player) {
  const info =
    roleInfo(player.role);

  const faction =
    factionOf(player);

  const color =
    faction === "Town"
      ? "#2d5a27"
      : faction === "Mafia"
      ? "#8d2d23"
      : faction === "Coven"
      ? "#6b2380"
      : "#b8860b";

  let teamInfo = "";

  if (faction === "Mafia") {
    const mafiaMembers =
      state.players.filter(
        p =>
          p.alive &&
          isMafia(p)
      );

    teamInfo = `
      <div class="team-info">
        <p class="team-label"
           style="color:${color}">
          Your Mafia Team:
        </p>

        <div class="team-grid">
          ${mafiaMembers.map(
            member => `
              <span class="team-member">
                ${escapeHTML(member.name)}
                (${escapeHTML(member.role)})
              </span>
            `
          ).join("")}
        </div>
      </div>
    `;
  }

  if (faction === "Coven") {
    const covenMembers =
      state.players.filter(
        p =>
          p.alive &&
          isCoven(p)
      );

    if (
      player.role === "Coven Leader"
    ) {
      teamInfo = `
        <div class="team-info">
          <p class="team-label"
             style="color:${color}">
            Your Coven Team:
          </p>

          <div class="team-grid">
            ${covenMembers.map(
              member => `
                <span class="team-member">
                  ${escapeHTML(member.name)}
                  (${escapeHTML(member.role)})
                </span>
              `
            ).join("")}
          </div>
        </div>
      `;
    } else {
      teamInfo = `
        <div class="team-info">
          <p class="team-label"
             style="color:${color}">
            Coven:
          </p>

          <p class="info-text">
            Only the Coven Leader can see the Coven membership list.
          </p>
        </div>
      `;
    }
  }

  if (
    player.role === "Guardian Angel" &&
    state.guardianTarget !== null
  ) {
    const target =
      getPlayer(state.guardianTarget);

    if (target) {
      teamInfo += `
        <div class="team-info">
          Your protected target:
          <strong>
            ${escapeHTML(target.name)}
          </strong>
        </div>
      `;
    }
  }

  $("gameArea").innerHTML = `
    <div class="role-card">
      <h2>${escapeHTML(player.role)}</h2>

      <p>
        <strong style="color:${color}">
          ${escapeHTML(faction)}
        </strong>
      </p>

      ${teamInfo}

      <h3>Night Ability</h3>
      <p>
        ${escapeHTML(info.night)}
      </p>

      <h3>Goal</h3>
      <p>
        ${escapeHTML(info.goal)}
      </p>

      <button
        class="primary"
        id="roleRevealContinue">
        Continue
      </button>
    </div>
  `;

  $("roleRevealContinue").onclick = () => {
    state.roleRevealIndex++;

    $("gameArea").innerHTML = "";

    showNextRoleReveal();
  };
}

// ============================================================
// GAME FUNCTIONS
// NIGHT PHASE
// ============================================================

function renderPlayers() {
  $("playerList").innerHTML =
    `<h2>Players</h2>` +
    state.players.map(p => {
      const statusIcon =
        p.alive ? "🟢" : "💀";

      const roleText =
        p.alive
          ? ""
          : `<small>${escapeHTML(p.role)}</small>`;

      const extraIcons =
        !p.alive
          ? " ⚰️"
          : p.revealed
          ? " 👑"
          : "";

      return `
        <div
          class="player ${p.alive ? "alive" : "dead"}"
          style="animation: slideIn 0.3s ease">

          <span>
            ${statusIcon}
            ${escapeHTML(p.name)}
            ${extraIcons}
          </span>

          ${roleText}
        </div>
      `;
    }).join("");

  const aliveCount =
    living().length;

  $("phaseLabel").textContent =
    `${state.phase === "night" ? "🌙 Night" : "☀️ Day"} ${state.night} | ${aliveCount} alive`;
}


function announcePhase() {
  const aliveCount =
    living().length;

  $("announcement").innerHTML = `
    <div class="phase-banner">
      <span class="phase-icon">
        ${state.phase === "night" ? "🌙" : "☀️"}
      </span>

      <span class="phase-text">
        ${state.phase === "night" ? "Night" : "Day"} ${state.night}
      </span>

      <span class="player-count">
        ${aliveCount} players remaining
      </span>
    </div>
  `;
}


function announce(text, type = "info") {
  $("announcement").innerHTML =
    `<div class="announce-banner ${type}">${text}</div>`;
}


// ============================================================
// PRIVATE PASS-AND-PLAY HANDOFF
// ============================================================

function passTo(title, text, callback) {
  $("passTitle").textContent =
    title;

  $("passText").textContent =
    text;

  $("passOverlay").classList.remove("hidden");

  $("passOverlay").style.animation =
    "fadeIn 0.3s ease";

  $("continueButton").onclick = () => {
    $("passOverlay").style.animation =
      "fadeOut 0.3s ease";

    setTimeout(() => {
      $("passOverlay").classList.add("hidden");

      callback();
    }, 300);
  };
}


// ============================================================
// BEGIN NIGHT
// ============================================================

function beginNight() {
  if (checkWin()) return;

  state.phase = "night";

  state.actions = {};
  state.results = [];
  state.deathAnnouncements = [];

  state.actionIndex = 0;

  state.transportedPlayers = {};
  state.transporterSelection = [];

  state.fullMoon =
    state.night % 2 === 0;

  if (state.dayTimerInterval) {
    clearInterval(
      state.dayTimerInterval
    );

    state.dayTimerInterval = null;
  }

  announcePhase();

  /*
   * POISON
   *
   * Poison is delayed. A player poisoned on Night N
   * dies at the beginning of Night N+2 unless something
   * else has already killed them.
   */
  Object.entries(
    state.poisonedPlayers || {}
  ).forEach(
    ([id, nightApplied]) => {

      if (
        nightApplied + 2 <=
        state.night
      ) {
        const player =
          getPlayer(Number(id));

        if (
          player &&
          player.alive
        ) {
          player.alive = false;

          state.results.push(
            `${player.name} succumbed to poison.`
          );

          addDeathAnnouncement(
            player,
            "Poison",
            false,
            "poison"
          );

          delete state.poisonedPlayers[id];
        }
      }
    }
  );

  /*
   * The device is now private.
   * Players should only see their own Night action.
   */
  announce(
    "🌙 Night has begun. Pass the device only when instructed."
  );

  // Every living player gets a private turn; order carries no information
  // because all actions and reports are resolved in separate passes.
  state.actionQueue = shuffle(living());

  nextNightAction();
}


// ============================================================
// NEXT NIGHT ACTION
// ============================================================

function nextNightAction() {

  /*
   * Skip anyone who died earlier in the Night sequence.
   */
  while (
    state.actionIndex <
      state.actionQueue.length &&

    !state
      .actionQueue[
        state.actionIndex
      ].alive
  ) {
    state.actionIndex++;
  }

  /*
   * Everyone has acted.
   */
  if (
    state.actionIndex >=
    state.actionQueue.length
  ) {
    return resolveNight();
  }

  const actor =
    state.actionQueue[
      state.actionIndex++
    ];

  // Roleblocks are applied by resolveNightActions after everyone has chosen.
  // No Jailor check exists here; Jailor has been removed from the game.

  passTo(
    `Pass to ${actor.name}`,
    "Keep all other players from seeing this private action.",
    () =>
      renderNightAction(actor)
  );
}


// ============================================================
// NIGHT ACTION UI
// ============================================================

function renderNightAction(actor) {

  const faction =
    factionOf(actor);

  let factionMembers = [];

  let teamInfo = "";

  // ----------------------------------------------------------
  // MAFIA INFORMATION
  // ----------------------------------------------------------

  if (faction === "Mafia") {

    factionMembers =
      state.players.filter(
        player =>
          player.alive &&
          isMafia(player) &&
          player.id !== actor.id
      );

    if (
      factionMembers.length > 0
    ) {

      teamInfo = `
        <div class="team-info">

          <p
            class="team-label"
            style="color: var(--danger)">
            Your Mafia team:
          </p>

          <div class="team-grid">

            ${
              factionMembers
                .map(
                  member => `
                    <span class="team-member">
                      ${escapeHTML(member.name)}
                      (${escapeHTML(member.role)})
                    </span>
                  `
                )
                .join("")
            }

          </div>

        </div>
      `;
    }
  }

  // ----------------------------------------------------------
  // COVEN INFORMATION
  // ----------------------------------------------------------

  else if (faction === "Coven") {

    const covenMembers =
      state.players.filter(
        player =>
          player.alive &&
          isCoven(player) &&
          player.id !== actor.id
      );

    /*
     * IMPORTANT:
     *
     * Only the Coven Leader sees the Coven roster.
     * Other Coven roles do NOT see their teammates.
     */
    const visibleMembers =
      actor.role === "Coven Leader"
        ? covenMembers
        : [];

    if (
      actor.role === "Coven Leader"
    ) {

      teamInfo = `
        <div class="team-info">

          <p
            class="team-label"
            style="color: var(--coven)">
            Your Coven team:
          </p>

          <div class="team-grid">

            ${
              visibleMembers
                .map(
                  member => `
                    <span class="team-member">
                      ${escapeHTML(member.name)}
                      (${escapeHTML(member.role)})
                    </span>
                  `
                )
                .join("")
            }

          </div>

        </div>
      `;

    } else {

      teamInfo = `
        <div class="team-info">

          <p
            class="team-label"
            style="color: var(--coven)">
            Your Coven team:
          </p>

          <p class="info-text">
            Only the Coven Leader can see the Coven membership list.
          </p>

        </div>
      `;
    }
  }

  // ----------------------------------------------------------
  // GUARDIAN ANGEL TARGET
  // ----------------------------------------------------------

  if (
    actor.role === "Guardian Angel" &&
    state.guardianTarget !== null
  ) {

    const target =
      getPlayer(
        state.guardianTarget
      );

    if (target) {

      teamInfo += `
        <div class="team-info">

          <p>
            Your protected target:
            <strong>
              ${escapeHTML(target.name)}
            </strong>
          </p>

        </div>
      `;
    }
  }

  // ----------------------------------------------------------
  // ACTION HTML
  // ----------------------------------------------------------

  let html = `
    <div class="night-action animate-in">

      <h2>
        🌙 ${escapeHTML(actor.role)}
      </h2>

      ${teamInfo}

      <div class="action-description">
  `;

  // ==========================================================
  // SHERIFF
  // ==========================================================

  switch (actor.role) {

    case "Sheriff":

      html += `
        <p>
          Choose one living player to investigate.
          You will privately learn their alignment.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🔎
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Investigate
        </button>
      `;

      break;


    // ========================================================
    // INVESTIGATOR
    // ========================================================

    case "Investigator":

      if (
        actor.investigations <= 0
      ) {

        html += `
          <p class="info">
            You have used all of your investigations.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Investigations remaining:
            ${actor.investigations}
          </p>

          <div class="target-grid">

            ${
              living()
                .filter(
                  player =>
                    player.id !== actor.id
                )
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="${player.id}">
                      🔎
                      ${escapeHTML(player.name)}
                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Investigate
          </button>
        `;
      }

      break;


    // ========================================================
    // DOCTOR
    // ========================================================

    case "Doctor":

      html += `
        <p>
          Choose one living player to protect from
          an attack tonight.
        </p>

        <div class="target-grid">

          ${
            living()
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    ❤️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Heal
        </button>
      `;

      break;


    // ========================================================
    // BODYGUARD
    // ========================================================

    case "Bodyguard":

      html += `
        <p>
          Guard a player tonight.
          If an attacker visits them,
          you may die protecting them.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🛡️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Guard
        </button>
      `;

      break;


    // ========================================================
    // VIGILANTE
    // ========================================================

    case "Vigilante":

      if (
        actor.bullets <= 0
      ) {

        html += `
          <p class="info">
            You have no bullets remaining.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Bullets remaining:
            ${actor.bullets}
          </p>

          <div class="target-grid">

            ${
              living()
                .filter(
                  player =>
                    player.id !== actor.id
                )
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="${player.id}">
                      🔫
                      ${escapeHTML(player.name)}
                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Shoot
          </button>
        `;
      }

      break;


    // ========================================================
    // VETERAN
    // ========================================================

    case "Veteran":

      if (
        actor.alerts <= 0
      ) {

        html += `
          <p class="info">
            You have no Alerts remaining.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Alerts remaining:
            ${actor.alerts}
          </p>

          <div class="target-grid">

            <div
              class="target-card"
              data-target="alert">

              ⚔️
              Go on Alert

            </div>

            <div
              class="target-card"
              data-target="none">

              💤
              Stay Home

            </div>

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Confirm
          </button>
        `;
      }

      break;


    // ========================================================
    // TRACKER
    // ========================================================

    case "Tracker":

      html += `
        <p>
          Choose a player to track.
          You will learn who they visited.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    👣
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Track
        </button>
      `;

      break;


    // ========================================================
    // LOOKOUT
    // ========================================================

    case "Lookout":

      html += `
        <p>
          Watch a player and learn who visited them.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    👁️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Watch
        </button>
      `;

      break;


    // ========================================================
    // MEDIUM
    // ========================================================

    case "Medium": {

      const deadPlayers =
        state.players.filter(
          player =>
            !player.alive
        );

      if (
        deadPlayers.length === 0
      ) {

        html += `
          <p class="info">
            No dead players are available
            to communicate with.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p>
            Choose one dead player to
            communicate with privately.
          </p>

          <div class="target-grid">

            ${
              deadPlayers
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="medium-${player.id}">

                      👻
                      ${escapeHTML(player.name)}

                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Contact Spirit
          </button>
        `;
      }

      break;
    }


    // ========================================================
    // TRANSPORTER
    // ========================================================

    case "Transporter":

      html += `
        <p>
          Choose two players to swap.
          Actions targeting one will affect the other.
        </p>

        <p class="info">
          Select the first player, then the second player.
        </p>

        <div
          class="target-grid"
          id="transporterTargets">

          ${
            living()
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🔄
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Transport
        </button>
      `;

      break;


    // ========================================================
    // SURVIVOR
    // ========================================================

    case "Survivor":

      if (
        actor.vests <= 0
      ) {

        html += `
          <p class="info">
            You have no bulletproof vests remaining.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Vests remaining:
            ${actor.vests}
          </p>

          <div class="target-grid">

            <div
              class="target-card"
              data-target="vest">

              🛡️
              Wear Bulletproof Vest

            </div>

            <div
              class="target-card"
              data-target="none">

              💤
              Do Not Use Vest

            </div>

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Confirm
          </button>
        `;
      }

      break;


    // ========================================================
    // GODFATHER
    // ========================================================

    case "Godfather":

      html += `
        <p>
          Choose the Mafia's attack target.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id &&
                  !isMafia(player)
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    ☠️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Mafia Attack
        </button>
      `;

      break;


    // ========================================================
    // MAFIOSO
    // ========================================================

    case "Mafioso":

      html += `
        <p>
          Assist the Mafia attack.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id &&
                  !isMafia(player)
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    ☠️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Attack
        </button>
      `;

      break;


    // ========================================================
    // CONSORT
    // ========================================================

    case "Consort":

      html += `
        <p>
          Choose a player to roleblock.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🚫
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Roleblock
        </button>
      `;

      break;


    // ========================================================
    // BLACKMAILER
    // ========================================================

    case "Blackmailer":

      html += `
        <p>
          Blackmail a player.
          They cannot share information normally during the Day.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🤐
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Blackmail
        </button>
      `;

      break;


    // ========================================================
    // INVESTIGATIVE MAFIA ROLES
    // ========================================================

    case "Consigliere":

      if (
        actor.investigations <= 0
      ) {

        html += `
          <p class="info">
            You have used all of your investigations.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Investigations remaining:
            ${actor.investigations}
          </p>

          <div class="target-grid">

            ${
              living()
                .filter(
                  player =>
                    player.id !== actor.id
                )
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="${player.id}">
                      🔎
                      ${escapeHTML(player.name)}
                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Investigate
          </button>
        `;
      }

      break;


    // ========================================================
    // JANITOR
    // ========================================================

    case "Janitor": {

      const deadPlayers =
        state.players.filter(
          player =>
            !player.alive &&
            !player.cleaned
        );

      if (
        actor.cleans <= 0
      ) {

        html += `
          <p class="info">
            You have no cleans remaining.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else if (
        deadPlayers.length === 0
      ) {

        html += `
          <p class="info">
            There are no dead players to clean.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Cleans remaining:
            ${actor.cleans}
          </p>

          <div class="target-grid">

            ${
              deadPlayers
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="${player.id}">
                      🧹
                      ${escapeHTML(player.name)}
                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Clean
          </button>
        `;
      }

      break;
    }


    // ========================================================
    // FRAMER
    // ========================================================

    case "Framer":

      html += `
        <p>
          Frame a player so investigations may
          return suspicious information.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🖼️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Frame
        </button>
      `;

      break;


    // ========================================================
    // DISGUISER
    // ========================================================

    case "Disguiser":

      html += `
        <p>
          Choose another player whose role
          you will appear to have to investigations.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🎭
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Disguise
        </button>
      `;

      break;


    // ========================================================
    // FORGER
    // ========================================================

    case "Forger":

      html += `
        <p>
          Choose a dead player's death message to forge.
        </p>

        <div class="target-grid">

          ${
            state.players
              .filter(
                player =>
                  !player.alive
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    📜
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Forge
        </button>
      `;

      break;


    // ========================================================
    // AMBUSHER
    // ========================================================

    case "Ambusher":

      html += `
        <p>
          Choose a player to ambush.
          Visitors to that player may be attacked.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🗡️
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Ambush
        </button>
      `;

      break;


    // ========================================================
    // HYPNOTIST
    // ========================================================

    case "Hypnotist":

      html += `
        <p>
          Choose a player to hypnotize.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🌀
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Hypnotize
        </button>
      `;

      break;


    // ========================================================
    // SERIAL KILLER
    // ========================================================

    case "Serial Killer":

      html += `
        <p>
          Choose one player to attack.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">
                    🔪
                    ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Attack
        </button>
      `;

      break;


    // ========================================================
    // ARSONIST
    // ========================================================

    case "Arsonist":

      html += `
        <p>
          Choose whether to douse a player
          or ignite all currently doused players.
        </p>

        <div class="target-grid">

          <div
            class="target-card"
            data-target="ignite">

            🔥
            Ignite all doused players

          </div>

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="douse-${player.id}">

                    🛢️
                    Douse ${escapeHTML(player.name)}

                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Confirm
        </button>
      `;

      break;


    // ========================================================
    // WEREWOLF
    // ========================================================

    case "Werewolf":

      if (!state.fullMoon) {

        html += `
          <p class="info">
            🌕 It is not a Full Moon tonight.
            You cannot attack.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p>
            🌕 Full Moon!
            Choose a player to attack.
          </p>

          <div class="target-grid">

            ${
              living()
                .filter(
                  player =>
                    player.id !== actor.id
                )
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="${player.id}">
                      🐺
                      ${escapeHTML(player.name)}
                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Attack
          </button>
        `;
      }

      break;


    // ========================================================
    // WITCH
    // ========================================================

    case "Witch":

      html += `
        <p>
          Choose a player to control.
          Then choose who they will target.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="control-${player.id}">
                    🧙
                    Control ${escapeHTML(player.name)}
                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Control
        </button>
      `;

      break;


    // ========================================================
    // AMNESIAC
    // ========================================================

    case "Amnesiac": {

      /*
       * Only DEAD players may be remembered.
       * The role itself is not revealed to the other players.
       */

      const deadPlayers =
        state.players.filter(
          player =>
            !player.alive &&
            player.role &&
            ROLE_DATA[player.role]
        );

      if (
        deadPlayers.length === 0
      ) {

        html += `
          <p class="info">
            There are no available dead roles to remember.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p>
            Choose a dead player whose role you will remember.
            Your new role will remain private.
          </p>

          <div class="target-grid">

            ${
              deadPlayers
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="remember-${player.id}">

                      🧠
                      Remember ${escapeHTML(player.name)}

                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Remember
          </button>
        `;
      }

      break;
    }


    // ========================================================
    // GUARDIAN ANGEL
    // ========================================================

    case "Guardian Angel":

      html += `
        <p>
          Protect your assigned target from attacks.
        </p>

        ${
          state.guardianTarget !== null
            ? `
              <div
                class="target-card selected"
                data-target="protect">

                🪽
                Protect
                ${escapeHTML(
                  getPlayer(
                    state.guardianTarget
                  )?.name || "Target"
                )}

              </div>
            `
            : `
              <p class="info">
                Your target is unavailable.
              </p>
            `
        }

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Protect
        </button>
      `;

      break;


    // ========================================================
    // PIRATE
    // ========================================================

    case "Pirate":

      if (
        (actor.pirateDuelsWon || 0) >= 2
      ) {

        html += `
          <p class="success">
            🏴‍☠️ You have already won enough duels.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p class="uses-left">
            Duels won:
            ${actor.pirateDuelsWon || 0}/2
          </p>

          <p>
            Challenge one living player.
            The opponent will secretly choose
            their own move when the duel is resolved.
          </p>

          <div class="target-grid">

            ${
              living()
                .filter(
                  player =>
                    player.id !== actor.id
                )
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="duel-${player.id}">

                      ⚔️
                      Duel ${escapeHTML(player.name)}

                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Confirm Duel
          </button>
        `;
      }

      break;


    // ========================================================
    // PLAGUEBEARER
    // ========================================================

    case "Plaguebearer":

      html += `
        <p>
          Infect one living player.
        </p>

        <p class="uses-left">
          Infected:
          ${state.infectedPlayers.size}
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">

                    🦠
                    Infect ${escapeHTML(player.name)}

                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Infect
        </button>
      `;

      break;


    // ========================================================
    // COVEN LEADER
    // ========================================================

    case "Coven Leader":

      html += `
        <p>
          Choose one player whose investigation
          information will be redacted.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">

                    📝
                    Redact ${escapeHTML(player.name)}

                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Redact
        </button>
      `;

      break;


    // ========================================================
    // POTION MASTER
    // ========================================================

    case "Potion Master": {

      const uses =
        actor.potionUses ||
        {
          heal: 0,
          attack: 0,
          reveal: 0
        };

      const available =
        Object.entries(uses)
          .filter(
            ([, amount]) =>
              amount > 0
          );

      if (
        available.length === 0
      ) {

        html += `
          <p class="info">
            You have no potions remaining.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p>
            Your potion is selected randomly.
            You only choose the target.
          </p>

          <div class="uses-left">
            Heal: ${uses.heal}
            |
            Attack: ${uses.attack}
            |
            Reveal: ${uses.reveal}
          </div>

          <div class="target-grid">

            ${
              living()
                .filter(
                  player =>
                    player.id !== actor.id
                )
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="${player.id}">

                      🧪
                      ${escapeHTML(player.name)}

                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Use Random Potion
          </button>
        `;
      }

      break;
    }


    // ========================================================
    // NECROMANCER
    // ========================================================

    case "Necromancer": {

      const deadWithAbilities =
        state.players.filter(
          player =>
            !player.alive &&
            ![
              "Citizen",
              "Jester",
              "Executioner",
              "Survivor"
            ].includes(player.role)
        );

      if (
        deadWithAbilities.length === 0
      ) {

        html += `
          <p class="info">
            No usable dead players are available.
          </p>

          <button
            class="primary"
            id="submitAction">
            Continue
          </button>
        `;

      } else {

        html += `
          <p>
            Choose one dead player's ability
            to use this Night.
          </p>

          <div class="target-grid">

            ${
              deadWithAbilities
                .map(
                  player => `
                    <div
                      class="target-card"
                      data-target="necromance-${player.id}">

                      💀
                      Use ${escapeHTML(player.name)}'s
                      ${escapeHTML(player.role)}
                      ability

                    </div>
                  `
                )
                .join("")
            }

          </div>

          <input
            type="hidden"
            id="selectedTarget"
            value="">

          <button
            class="primary confirm-btn"
            id="confirmBtn"
            disabled>
            Use Ability
          </button>
        `;
      }

      break;
    }


    // ========================================================
    // POISONER
    // ========================================================

    case "Poisoner":

      html += `
        <p>
          Poison one living player.
          They will die after the poison delay.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">

                    ☠️
                    Poison ${escapeHTML(player.name)}

                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Poison
        </button>
      `;

      break;


    // ========================================================
    // MEDUSA
    // ========================================================

    case "Medusa":

      html += `
        <p>
          Stone Gaze kills visitors to you tonight.
        </p>

        <div class="target-grid">

          <div
            class="target-card"
            data-target="stone">

            🗿
            Activate Stone Gaze

          </div>

          <div
            class="target-card"
            data-target="none">

            💤
            Stay Home

          </div>

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Confirm
        </button>
      `;

      break;


    // ========================================================
    // JUGGERNAUT
    // ========================================================

    case "Juggernaut":

      html += `
        <p>
          Attack one player.
        </p>

        <p class="uses-left">
          Successful kills:
          ${state.juggernautKills}
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">

                    💀
                    Attack ${escapeHTML(player.name)}

                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Attack
        </button>
      `;

      break;


    // ========================================================
    // PESTILENCE
    // ========================================================

    case "Pestilence":

      html += `
        <p>
          Attack one player.
          Pestilence is immune to most attacks.
        </p>

        <div class="target-grid">

          ${
            living()
              .filter(
                player =>
                  player.id !== actor.id
              )
              .map(
                player => `
                  <div
                    class="target-card"
                    data-target="${player.id}">

                    ☠️
                    Attack ${escapeHTML(player.name)}

                  </div>
                `
              )
              .join("")
          }

        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="confirmBtn"
          disabled>
          Attack
        </button>
      `;

      break;


    // ========================================================
    // DEFAULT
    // ========================================================

    default:

      html += `
        <p class="info">
          You have no Night action.
        </p>

        <button
          class="primary"
          id="submitAction">
          Continue
        </button>
      `;
  }

  html += `
      </div>
    </div>
  `;

  $("gameArea").innerHTML =
    html;

  setupNightActionControls(actor);
}


// ============================================================
// NIGHT ACTION CONTROLS
// ============================================================

function setupNightActionControls(actor) {

  const cards =
    document.querySelectorAll(
      ".target-card"
    );

  const selectedInput =
    $("selectedTarget");

  const confirmButton =
    $("confirmBtn");

  /*
   * Standard target selection.
   */
  cards.forEach(card => {

    card.onclick = () => {

      cards.forEach(
        other =>
          other.classList.remove(
            "selected"
          )
      );

      card.classList.add(
        "selected"
      );

      if (selectedInput) {
        selectedInput.value =
          card.dataset.target;
      }

      if (confirmButton) {
        confirmButton.disabled =
          !card.dataset.target;
      }
    };
  });

  /*
   * Some roles have no confirm button
   * because they simply continue.
   */
  const submitButton =
    $("submitAction");

  if (submitButton) {

    submitButton.onclick = () =>
      submitNightAction(actor);
  }

  /*
   * Confirm buttons are handled here rather than
   * depending on a global click handler.
   *
   * This prevents an old actor from accidentally
   * submitting another player's action.
   */
  if (confirmButton) {

    confirmButton.onclick = () => {

      if (
        confirmButton.disabled
      ) return;

      submitNightAction(actor);
    };
  }
}

// ============================================================
// PRIVATE NIGHT ACTION SUBMISSION
// ============================================================

function submitNightAction(actor) {

  if (!actor || !actor.alive) {
    return;
  }

  /*
   * Make sure this is actually the player whose private
   * Night screen is currently being displayed.
   */
  const currentActor =
    state.actionQueue[state.actionIndex - 1];

  if (
    !currentActor ||
    currentActor.id !== actor.id
  ) {
    return;
  }

  const targetInput =
    $("selectedTarget");

  const confirmBtn =
    $("confirmBtn");

  if (
    confirmBtn &&
    confirmBtn.disabled
  ) {
    return;
  }

  const targetValue =
    targetInput
      ? targetInput.value
      : "";

  let actionType = "none";
  let actionTarget = null;

  /*
   * Most actions require a target.
   *
   * Actions such as Veteran Alert, Survivor Vest,
   * Medusa Stone Gaze, etc. are handled separately.
   */

  switch (actor.role) {

    // ========================================================
    // TOWN
    // ========================================================

    case "Sheriff":

      if (!targetValue) return;

      actionType = "sheriff";
      actionTarget =
        Number(targetValue);

      break;


    case "Investigator":

      if (!targetValue) return;

      if (
        actor.investigations <= 0
      ) {
        return;
      }

      actor.investigations--;

      actionType = "investigate";
      actionTarget =
        Number(targetValue);

      break;


    case "Doctor":

      if (!targetValue) return;

      actionType = "heal";
      actionTarget =
        Number(targetValue);

      break;


    case "Bodyguard":

      if (!targetValue) return;

      actionType = "guard";
      actionTarget =
        Number(targetValue);

      break;


    case "Vigilante":

      if (
        actor.bullets <= 0 ||
        !targetValue
      ) {
        return;
      }

      actor.bullets--;

      actionType = "attack";
      actionTarget =
        Number(targetValue);

      break;


    case "Veteran":

      if (
        targetValue === "alert"
      ) {

        if (
          actor.alerts <= 0
        ) {
          return;
        }

        actor.alerts--;

        actionType = "alert";

      } else {

        actionType = "none";
      }

      break;


    case "Survivor":

      if (
        targetValue === "vest"
      ) {

        if (
          actor.vests <= 0
        ) {
          return;
        }

        actor.vests--;

        actionType = "vest";

      } else {

        actionType = "none";
      }

      break;


    case "Tracker":

      if (!targetValue) return;

      actionType = "track";
      actionTarget =
        Number(targetValue);

      break;


    case "Lookout":

      if (!targetValue) return;

      actionType = "lookout";
      actionTarget =
        Number(targetValue);

      break;


    case "Transporter": {

      /*
       * Transporter must choose TWO players.
       */
      const selected =
        targetValue
          .split(",")
          .filter(Boolean)
          .map(Number);

      if (
        selected.length !== 2 ||
        selected[0] === selected[1]
      ) {
        return;
      }

      actionType = "transport";

      actionTarget =
        selected;

      break;
    }


    // ========================================================
    // MAFIA
    // ========================================================

    case "Godfather":

      if (!targetValue) return;

      actionType = "mafiaAttack";
      actionTarget =
        Number(targetValue);

      break;


    case "Mafioso":

      if (!targetValue) return;

      actionType = "mafiaAttack";
      actionTarget =
        Number(targetValue);

      break;


    case "Consort":

      if (!targetValue) return;

      actionType = "block";
      actionTarget =
        Number(targetValue);

      break;


    case "Consigliere":

      if (
        actor.investigations <= 0 ||
        !targetValue
      ) {
        return;
      }

      actor.investigations--;

      actionType = "investigate";
      actionTarget =
        Number(targetValue);

      break;


    case "Blackmailer":

      if (!targetValue) return;

      actionType = "blackmail";
      actionTarget =
        Number(targetValue);

      break;


    case "Janitor":

      if (
        actor.cleans <= 0 ||
        !targetValue
      ) {
        return;
      }

      actor.cleans--;

      actionType = "clean";
      actionTarget =
        Number(targetValue);

      break;


    case "Framer":

      if (!targetValue) return;

      actionType = "frame";
      actionTarget =
        Number(targetValue);

      break;


    case "Disguiser":

      if (!targetValue) return;

      actionType = "disguise";
      actionTarget =
        Number(targetValue);

      break;


    case "Forger":

      if (!targetValue) return;

      actionType = "forge";
      actionTarget =
        Number(targetValue);

      break;


    case "Ambusher":

      if (!targetValue) return;

      actionType = "ambush";
      actionTarget =
        Number(targetValue);

      break;


    case "Hypnotist":

      if (!targetValue) return;

      actionType = "hypnotize";
      actionTarget =
        Number(targetValue);

      break;


    // ========================================================
    // NEUTRAL
    // ========================================================

    case "Serial Killer":

      if (!targetValue) return;

      actionType = "attack";
      actionTarget =
        Number(targetValue);

      break;


    case "Arsonist":

      if (!targetValue) return;

      if (
        targetValue === "ignite"
      ) {

        actionType = "ignite";

      } else if (
        targetValue.startsWith(
          "douse-"
        )
      ) {

        actionType = "douse";

        actionTarget =
          Number(
            targetValue.replace(
              "douse-",
              ""
            )
          );

      } else {

        return;
      }

      break;


    case "Werewolf":

      if (
        !state.fullMoon
      ) {

        actionType = "none";

      } else {

        if (!targetValue) return;

        actionType =
          "werewolfAttack";

        actionTarget =
          Number(targetValue);
      }

      break;


    case "Witch":

      if (
        !targetValue ||
        !targetValue.startsWith(
          "control-"
        )
      ) {
        return;
      }

      actionType = "control";

      actionTarget =
        Number(
          targetValue.replace(
            "control-",
            ""
          )
        );

      break;


    // ========================================================
    // AMNESIAC
    // ========================================================

    case "Amnesiac":

      if (
        !targetValue ||
        !targetValue.startsWith(
          "remember-"
        )
      ) {
        return;
      }

      actionType = "remember";

      actionTarget =
        Number(
          targetValue.replace(
            "remember-",
            ""
          )
        );

      break;


    // ========================================================
    // GUARDIAN ANGEL
    // ========================================================

    case "Guardian Angel":

      if (
        targetValue === "protect"
      ) {

        if (
          state.guardianTarget === null
        ) {
          return;
        }

        actionType =
          "gaProtect";

      } else {

        actionType =
          "none";
      }

      break;


    // ========================================================
    // PIRATE
    // ========================================================

    case "Pirate":

      /*
       * Pirate is different from every other role.
       *
       * The Pirate chooses the opponent first.
       * The opponent then gets their own private screen
       * and secretly chooses their move.
       *
       * DO NOT resolve the winner randomly.
       */
      if (
        !targetValue ||
        !targetValue.startsWith(
          "duel-"
        )
      ) {
        return;
      }

      const duelTarget =
        Number(
          targetValue.replace(
            "duel-",
            ""
          )
        );

      if (
        !getPlayer(duelTarget) ||
        !getPlayer(duelTarget).alive
      ) {
        return;
      }

      return startPirateDuel(
        actor,
        duelTarget
      );


    // ========================================================
    // PLAGUEBEARER
    // ========================================================

    case "Plaguebearer":

      if (!targetValue) return;

      actionType = "infect";

      actionTarget =
        Number(targetValue);

      break;


    // ========================================================
    // COVEN LEADER
    // ========================================================

    case "Coven Leader":

      if (!targetValue) return;

      actionType = "redact";

      actionTarget =
        Number(targetValue);

      break;


    // ========================================================
    // POTION MASTER
    // ========================================================

    case "Potion Master": {

      if (!targetValue) {
        return;
      }

      const uses =
        actor.potionUses ||
        {
          heal: 0,
          attack: 0,
          reveal: 0
        };

      const available =
        Object.keys(uses)
          .filter(
            potion =>
              uses[potion] > 0
          );

      /*
       * No potions left.
       */
      if (
        available.length === 0
      ) {
        return;
      }

      /*
       * The rules specifically say the potion
       * is random, not chosen by the player.
       */
      const potion =
        available[
          Math.floor(
            Math.random() *
            available.length
          )
        ];

      uses[potion]--;

      actor.potionUses =
        uses;

      actionType =
        "potion";

      actionTarget =
        Number(targetValue);

      state.actions[actor.id] = {
        actor: actor.id,
        target: actionTarget,
        type: actionType,
        potion
      };

      $("gameArea").innerHTML = "";

      return nextNightAction();
    }


    // ========================================================
    // NECROMANCER
    // ========================================================

    case "Necromancer":

      if (
        !targetValue ||
        !targetValue.startsWith(
          "necromance-"
        )
      ) {
        return;
      }

      actionType =
        "necromance";

      actionTarget =
        Number(
          targetValue.replace(
            "necromance-",
            ""
          )
        );

      break;


    // ========================================================
    // POISONER
    // ========================================================

    case "Poisoner":

      if (!targetValue) return;

      actionType =
        "poison";

      actionTarget =
        Number(targetValue);

      break;


    // ========================================================
    // MEDUSA
    // ========================================================

    case "Medusa":

      if (
        targetValue === "stone"
      ) {

        actionType =
          "stone";

      } else {

        actionType =
          "none";
      }

      break;


    // ========================================================
    // JUGGERNAUT
    // ========================================================

    case "Juggernaut":

      if (!targetValue) return;

      actionType =
        "jugAttack";

      actionTarget =
        Number(targetValue);

      break;


    // ========================================================
    // PESTILENCE
    // ========================================================

    case "Pestilence":

      if (!targetValue) return;

      actionType =
        "pestAttack";

      actionTarget =
        Number(targetValue);

      break;


    // ========================================================
    // COVEN MEMBER
    // ========================================================

    case "Coven Member":

      /*
       * A Coven Member does not independently select an
       * action according to the current rules/code.
       */
      actionType =
        "none";

      break;


    // ========================================================
    // DEFAULT
    // ========================================================

    default:

      actionType =
        "none";

      break;
  }


  /*
   * Store the action.
   */
  state.actions[actor.id] = {
    actor: actor.id,
    target: actionTarget,
    type: actionType
  };


  /*
   * Remove the private action screen before moving
   * to the next player.
   */
  $("gameArea").innerHTML = "";


  /*
   * Investigation results are shown immediately,
   * but ONLY through the private pass screen.
   *
   * This means the other players never see the result.
   */
  if (
    actionType === "sheriff" ||
    actionType === "investigate"
  ) {

    showImmediateInvestigationResult(
      actor,
      actionType,
      actionTarget,
      nextNightAction
    );

  } else {

    nextNightAction();
  }
}


// ============================================================
// PIRATE DUEL
// ============================================================

function startPirateDuel(pirate, opponentId) {

  const opponent = getPlayer(opponentId);

  if (
    !pirate ||
    !pirate.alive ||
    !opponent ||
    !opponent.alive
  ) {
    return nextNightAction();
  }

  // ----------------------------------------------------------
  // PIRATE CHOOSES SECRET MOVE
  // ----------------------------------------------------------

  passTo(
    `Pirate Duel — ${pirate.name}`,
    `Choose your move. Keep it secret from ${opponent.name}.`,
    () => {

      $("gameArea").innerHTML = `
        <div class="night-action-card animate-in">

          <h2>🏴‍☠️ Pirate Duel</h2>

          <p>
            You are challenging
            <strong>${escapeHTML(opponent.name)}</strong>.
          </p>

          <div class="target-grid">

            <div
              class="target-card pirate-move"
              data-move="rock">
              🪨 Rock
            </div>

            <div
              class="target-card pirate-move"
              data-move="paper">
              📜 Paper
            </div>

            <div
              class="target-card pirate-move"
              data-move="scissors">
              ✂️ Scissors
            </div>

          </div>

          <button
            class="primary"
            id="pirateMoveConfirm"
            disabled>
            Confirm Secret Move
          </button>

        </div>
      `;

      let pirateMove = null;

      document
        .querySelectorAll(".pirate-move")
        .forEach(card => {

          card.onclick = () => {

            document
              .querySelectorAll(".pirate-move")
              .forEach(c =>
                c.classList.remove("selected")
              );

            card.classList.add("selected");

            pirateMove =
              card.dataset.move;

            $("pirateMoveConfirm")
              .disabled = false;
          };
        });


      $("pirateMoveConfirm").onclick = () => {

        if (!pirateMove) {
          return;
        }

        // Erase Pirate's screen before passing the device.
        $("gameArea").innerHTML = "";


        // ----------------------------------------------------
        // PASS TO OPPONENT
        // ----------------------------------------------------

        passTo(
          `Pass to ${opponent.name}`,
          "The Pirate has challenged you. Keep your move secret.",
          () => {

            $("gameArea").innerHTML = `
              <div class="night-action-card animate-in">

                <h2>⚔️ Pirate Duel</h2>

                <p>
                  Choose your secret move.
                </p>

                <div class="target-grid">

                  <div
                    class="target-card pirate-opponent-move"
                    data-move="rock">
                    🪨 Rock
                  </div>

                  <div
                    class="target-card pirate-opponent-move"
                    data-move="paper">
                    📜 Paper
                  </div>

                  <div
                    class="target-card pirate-opponent-move"
                    data-move="scissors">
                    ✂️ Scissors
                  </div>

                </div>

                <button
                  class="primary"
                  id="opponentMoveConfirm"
                  disabled>
                  Confirm Secret Move
                </button>

              </div>
            `;


            let opponentMove = null;


            document
              .querySelectorAll(".pirate-opponent-move")
              .forEach(card => {

                card.onclick = () => {

                  document
                    .querySelectorAll(".pirate-opponent-move")
                    .forEach(c =>
                      c.classList.remove("selected")
                    );

                  card.classList.add("selected");

                  opponentMove =
                    card.dataset.move;

                  $("opponentMoveConfirm")
                    .disabled = false;
                };
              });


            $("opponentMoveConfirm").onclick = () => {

              if (!opponentMove) {
                return;
              }


              const winner =
                pirateWinner(
                  pirateMove,
                  opponentMove
                );


              // Save the completed duel.
              state.actions[pirate.id] = {
                actor: pirate.id,
                target: opponent.id,
                type: "duel",
                pirateMove: pirateMove,
                opponentMove: opponentMove,
                winner: winner
              };


              // Clear the opponent's screen.
              $("gameArea").innerHTML = "";


              // Continue to the next Night player.
              nextNightAction();

            };

          }
        );

      };

    }
  );

}

// ============================================================
// PIRATE WINNER CALCULATION
// ============================================================

function pirateWinner(
  pirateMove,
  opponentMove
) {

  if (
    pirateMove === opponentMove
  ) {
    return "tie";
  }

  if (
    (
      pirateMove === "rock" &&
      opponentMove === "scissors"
    ) ||
    (
      pirateMove === "paper" &&
      opponentMove === "rock"
    ) ||
    (
      pirateMove === "scissors" &&
      opponentMove === "paper"
    )
  ) {
    return "pirate";
  }

  return "opponent";
}


// ============================================================
// PRIVATE INVESTIGATION RESULT
// ============================================================

function showImmediateInvestigationResult(
  actor,
  actionType,
  targetId,
  callback
) {

  const target =
    getPlayer(targetId);

  if (
    !target ||
    !target.alive
  ) {
    callback();
    return;
  }


  /*
   * COVEN LEADER REDACTION
   *
   * This MUST happen before displaying investigative
   * information.
   */
  if (
    state.redactedPlayers &&
    state.redactedPlayers.has(target.id)
  ) {

    let message;

    if (
      actionType === "sheriff"
    ) {

      message = `
        Sheriff Result:
        ${escapeHTML(target.name)}
        appears as
        <strong>REDACTED</strong>.
        <br><br>
        The target's alignment information
        has been blocked.
      `;

    } else {

      message = `
        Investigator Result:
        ${escapeHTML(target.name)}'s role is
        REDACTED.
        <br><br>
        The target's role information
        has been blocked.
      `;
    }


    passTo(
      `Private Result for ${actor.name}`,
      message,
      callback
    );

    return;
  }


  let result;
  let message;


  // ==========================================================
  // SHERIFF
  // ==========================================================

  if (
    actionType === "sheriff"
  ) {

    if (
      state.framedPlayers &&
      state.framedPlayers.has(
        target.id
      )
    ) {

      result = "Bad";

    } else if (
      target.role === "Godfather" ||
      (
        state.disguisedPlayers &&
        state.disguisedPlayers[
          target.id
        ]
      ) ||
      factionOf(target) === "Town" ||
      target.role === "Survivor"
    ) {

      result = "Good";

    } else {

      result = "Bad";
    }


    message = `
      Sheriff Result:
      
        ${escapeHTML(target.name)}
      
      appears to be
      
        ${escapeHTML(result)}
      .
    `;


  // ==========================================================
  // INVESTIGATOR / CONSIGLIERE
  // ==========================================================

  } else {

    const disguisedRole =
      state.disguisedPlayers &&
      state.disguisedPlayers[
        target.id
      ]
        ? state.players.find(
            p =>
              p.id ===
              state.disguisedPlayers[
                target.id
              ]
          )?.role
        : null;


    result =
      disguisedRole ||
      target.role;


    message = `
      Investigator Result:
      
        ${escapeHTML(target.name)}
     
      is
      
        ${escapeHTML(result)}
      .
    `;
  }


  /*
   * IMPORTANT:
   *
   * This is displayed through passTo().
   * Therefore the result is never shown to the
   * rest of the table during pass-and-play.
   */
  passTo(
    `Private Result for ${actor.name}`,
    message,
    callback
  );
}

// ============================================================
// NIGHT RESOLUTION
// ============================================================

function resolveNight() {
  // Delegate to the new night-resolution engine if available
  // Use window.resolveNight (which may be overridden by night-resolution.js)
  if (typeof window.resolveNight === "function" && window.resolveNight !== resolveNight) {
    window.resolveNight();
    return;
  }
  if (typeof window.resolveNightActions === "function") {
    window.resolveNightActions();
    return;
  }

  // Fallback: simple resolution
  state.results = state.results || [];
  state.results.push("Night resolved (basic mode).");
  renderPlayers();
  state.phase = "day";
  state.dayStarted = true;
  announcePhase();
  if (typeof checkWin === "function" && checkWin()) return;
  if (typeof renderDay === "function") renderDay();
  else if (typeof finishNight === "function") finishNight();
}


// ============================================================
// NIGHT KILL QUEUE
// ============================================================

function queueNightKill(
  nightKills,
  attackSources,
  targetId,
  sourceName
) {

  if (
    targetId == null
  ) {
    return;
  }

  /*
   * Do not overwrite an existing attack source.
   * The first successful attack is kept for the
   * public death announcement.
   */
  if (
    !nightKills.has(
      targetId
    )
  ) {

    nightKills.set(
      targetId,
      sourceName
    );

    attackSources.set(
      targetId,
      sourceName
    );
  }
}

// ============================================================
// MURDER AT TOWN SQUARE
// FINAL NIGHT-RESOLUTION HELPERS
//
// These helpers are designed to work with the existing state
// structure in the supplied JavaScript file.
// ============================================================


// ------------------------------------------------------------
// SAFELY GET A PLAYER
// ------------------------------------------------------------

function safeGetPlayer(id) {
  if (id === null || id === undefined) {
    return null;
  }

  return state.players.find(
    p => Number(p.id) === Number(id)
  ) || null;
}


// ------------------------------------------------------------
// CHECK WHETHER A PLAYER IS ALIVE
// ------------------------------------------------------------

function isAlive(id) {
  const player = safeGetPlayer(id);
  return !!(player && player.alive);
}


// ------------------------------------------------------------
// GET A PLAYER'S FACTION
// ------------------------------------------------------------

function getPlayerFaction(player) {
  if (!player) {
    return "Unknown";
  }

  return factionOf(player);
}


// ------------------------------------------------------------
// SHERIFF RESULT
//
// Rules:
// Sheriff sees Good / Bad / Neutral.
//
// Coven/Mafia and the Neutral Evil killing roles are Bad.
// Survivor, Jester, Executioner, Witch, GA, Pirate,
// Amnesiac, etc. are Neutral.
// ------------------------------------------------------------

function getSheriffResult(player) {

  if (!player) {
    return "Unknown";
  }

  const badRoles = [
    "Godfather",
    "Mafioso",
    "Consigliere",
    "Blackmailer",
    "Janitor",
    "Framer",
    "Disguiser",
    "Forger",
    "Ambusher",
    "Hypnotist",
    "Consort",

    "Coven Leader",
    "Potion Master",
    "Necromancer",
    "Poisoner",
    "Medusa",
    "Coven Member",

    "Serial Killer",
    "Arsonist",
    "Werewolf",
    "Plaguebearer",
    "Pestilence",
    "Juggernaut"
  ];

  if (
    state.framedPlayers &&
    state.framedPlayers.has(player.id)
  ) {
    return "Bad";
  }

  if (
    badRoles.includes(player.role)
  ) {
    return "Bad";
  }

  if (
    factionOf(player) === "Town"
  ) {
    return "Good";
  }

  return "Neutral";
}


// ------------------------------------------------------------
// INVESTIGATOR RESULT
//
// IMPORTANT:
// Coven Leader redaction happens here before the real
// role is revealed.
// ------------------------------------------------------------

function getInvestigatorResult(player) {

  if (!player) {
    return "Unknown";
  }

  if (
    state.redactedPlayers &&
    state.redactedPlayers.has(player.id)
  ) {
    return "REDACTED";
  }

  /*
   * Framing does not change the actual role.
   * It only changes investigative information where
   * the existing role system says it should.
   */

  if (
    state.disguisedPlayers &&
    state.disguisedPlayers[player.id]
  ) {

    const disguiseTarget =
      safeGetPlayer(
        state.disguisedPlayers[player.id]
      );

    if (disguiseTarget) {
      return disguiseTarget.role;
    }
  }

  return player.role;
}


// ------------------------------------------------------------
// REDACTED SHERIFF RESULT
// ------------------------------------------------------------

function getSheriffResultWithRedaction(player) {

  if (!player) {
    return "Unknown";
  }

  if (
    state.redactedPlayers &&
    state.redactedPlayers.has(player.id)
  ) {
    return "REDACTED";
  }

  return getSheriffResult(player);
}


// ------------------------------------------------------------
// ROLE RESOURCE INITIALIZATION
//
// This is especially important for the AMNESIAC.
//
// When the Amnesiac becomes another role, they must actually
// receive the resources that role requires.
// ------------------------------------------------------------

function initializeRoleResources(player, preserveExisting = false) {

  if (!player) {
    return;
  }

  switch (player.role) {

    // --------------------------------------------------------
    // INVESTIGATOR
    // --------------------------------------------------------

    case "Investigator":

      if (
        !preserveExisting ||
        player.investigations === undefined
      ) {
        player.investigations = 2;
      }

      break;


    // --------------------------------------------------------
    // VIGILANTE
    // --------------------------------------------------------

    case "Vigilante":

      if (
        !preserveExisting ||
        player.bullets === undefined
      ) {
        player.bullets = 3;
      }

      break;


    // --------------------------------------------------------
    // VETERAN
    // --------------------------------------------------------

    case "Veteran":

      if (
        !preserveExisting ||
        player.alerts === undefined
      ) {
        player.alerts = 3;
      }

      break;


    // --------------------------------------------------------
    // SURVIVOR
    // --------------------------------------------------------

    case "Survivor":

      if (
        !preserveExisting ||
        player.vests === undefined
      ) {
        player.vests = 4;
      }

      break;


    // --------------------------------------------------------
    // JAILOR
    // --------------------------------------------------------

    case "Jailor":

      /*
       * The global state already tracks Jailor executions.
       * Do not create a second counter on the player.
       */
      if (
        state.jailorExecutions === undefined
      ) {
        state.jailorExecutions = 3;
      }

      break;


    // --------------------------------------------------------
    // POTION MASTER
    // --------------------------------------------------------

    case "Potion Master":

      if (
        !preserveExisting ||
        !player.potionUses
      ) {

        player.potionUses = {
          heal: 2,
          attack: 2,
          reveal: 2
        };
      }

      break;


    // --------------------------------------------------------
    // PIRATE
    // --------------------------------------------------------

    case "Pirate":

      if (
        player.pirateDuelsWon === undefined
      ) {
        player.pirateDuelsWon = 0;
      }

      break;


    // --------------------------------------------------------
    // GUARDIAN ANGEL
    // --------------------------------------------------------

    case "Guardian Angel":

      /*
       * The existing game stores the GA target globally.
       * Do not randomly assign a new target here.
       */
      break;


    // --------------------------------------------------------
    // JUGGERNAUT
    // --------------------------------------------------------

    case "Juggernaut":

      if (
        state.juggernautKills === undefined
      ) {
        state.juggernautKills = 0;
      }

      break;


    // --------------------------------------------------------
    // OTHER ROLES
    // --------------------------------------------------------

    default:
      break;
  }
}


// ------------------------------------------------------------
// INITIALIZE ALL ROLE RESOURCES
//
// Call this once after roles are assigned.
// ------------------------------------------------------------

function initializeAllRoleResources() {

  state.players.forEach(
    player => {
      initializeRoleResources(
        player,
        false
      );
    }
  );
}


// ------------------------------------------------------------
// AMNESIAC TRANSFORMATION
//
// Rules:
//
// 1. Target must already be dead.
// 2. Amnesiac becomes that role.
// 3. Gains the role's abilities.
// 4. Gains the role's goal.
//
// This does NOT resurrect the dead player.
// ------------------------------------------------------------

function transformAmnesiac(
  amnesiac,
  deadPlayer
) {

  if (
    !amnesiac ||
    !deadPlayer
  ) {
    return false;
  }

  if (
    !amnesiac.alive ||
    deadPlayer.alive
  ) {
    return false;
  }

  const rememberedRole =
    deadPlayer.role;

  /*
   * The Amnesiac cannot remember itself.
   */
  if (
    rememberedRole ===
    "Amnesiac"
  ) {
    return false;
  }

  amnesiac.role =
    rememberedRole;

  amnesiac.rememberedRole =
    rememberedRole;

  initializeRoleResources(
    amnesiac,
    false
  );

  state.results.push(
    `${amnesiac.name} remembered the role ${rememberedRole}.`
  );

  return true;
}


// ------------------------------------------------------------
// PLAGUEBEARER TRANSFORMATION
// ------------------------------------------------------------

function checkPlaguebearerTransformation() {

  const plaguebearer =
    state.players.find(
      p =>
        p.alive &&
        p.role === "Plaguebearer"
    );

  if (!plaguebearer) {
    return false;
  }

  const livingPlayers =
    living();

  if (
    livingPlayers.length === 0
  ) {
    return false;
  }

  /*
   * The rules say:
   * "When all living players are infected."
   */
  const allInfected =
    livingPlayers.every(
      p =>
        state.infectedPlayers.has(
          p.id
        )
    );

  if (!allInfected) {
    return false;
  }

  plaguebearer.role =
    "Pestilence";

  state.results.push(
    "The Plaguebearer has become Pestilence!"
  );

  return true;
}


// ------------------------------------------------------------
// JUGGERNAUT KILL TRACKING
//
// IMPORTANT BUG FIX:
//
// The old code incremented juggernautKills simply because
// a Juggernaut selected a target.
//
// That is NOT the same as getting a kill.
//
// This function should ONLY be called after a target actually
// dies from the Juggernaut.
// ------------------------------------------------------------

function registerJuggernautKill() {

  if (
    state.juggernautKills === undefined
  ) {
    state.juggernautKills = 0;
  }

  state.juggernautKills++;

  return state.juggernautKills;
}


// ------------------------------------------------------------
// JUGGERNAUT POWER
//
// The rules only specify that the Juggernaut gets stronger
// after kills; they do not specify exact numerical tiers.
//
// Therefore this function gives the rest of the game one
// consistent place to check the number of successful kills
// without inventing a new ruleset.
// ------------------------------------------------------------

function getJuggernautPower() {

  return {
    kills:
      state.juggernautKills || 0,

    stronger:
      (state.juggernautKills || 0) > 0
  };
}


// ------------------------------------------------------------
// POISON RESOLUTION
//
// Existing rules:
// Poisoned players die after 2 nights.
//
// The existing game stores the night on which poison was
// applied in state.poisonedPlayers.
// ------------------------------------------------------------

function resolvePoison() {

  if (
    !state.poisonedPlayers
  ) {
    return;
  }

  Object.entries(
    state.poisonedPlayers
  ).forEach(
    ([id, appliedNight]) => {

      const player =
        safeGetPlayer(id);

      if (
        !player ||
        !player.alive
      ) {
        delete state.poisonedPlayers[id];
        return;
      }

      if (
        Number(appliedNight) + 2 <=
        state.night
      ) {

        player.alive =
          false;

        state.results.push(
          `${player.name} succumbed to poison.`
        );

        state.deathAnnouncements.push({
          name: player.name,
          role: player.role,
          cause: "Poison",
          cleaned: false,
          lastWords:
            getLastWords(
              player,
              "poison"
            )
        });

        delete state.poisonedPlayers[id];
      }
    }
  );
}


// ------------------------------------------------------------
// PRIVATE ROLE RESULT
//
// This prevents investigation information from being left
// on the public game screen.
// ------------------------------------------------------------

function showPrivateInvestigation(
  actor,
  target,
  type,
  callback
) {

  if (
    !actor ||
    !target
  ) {
    callback();
    return;
  }

  let result;

  if (
    type === "sheriff"
  ) {

    result =
      getSheriffResultWithRedaction(
        target
      );

  } else {

    result =
      getInvestigatorResult(
        target
      );
  }


  const label =
    type === "sheriff"
      ? "Alignment"
      : "Role";


  passTo(
    `Private Result — ${actor.name}`,
    `
      <div class="private-result">

        <h2>🔎 Investigation Result</h2>

        <p>
          Target:
          <strong>
            ${escapeHTML(target.name)}
          </strong>
        </p>

        <p>
          ${label}:
          <strong>
            ${escapeHTML(result)}
          </strong>
        </p>

      </div>
    `,
    callback
  );
}


// ------------------------------------------------------------
// PRIVATE PIRATE RESULT
// ------------------------------------------------------------

function showPirateResult(
  pirate,
  opponent,
  winner,
  callback
) {

  let text;

  if (
    winner === "pirate"
  ) {

    text =
      `You won the duel against ${opponent.name}.`;

  } else if (
    winner === "opponent"
  ) {

    text =
      `You lost the duel against ${opponent.name}.`;

  } else {

    text =
      `The duel was a tie. Neither player wins.`;
  }


  passTo(
    `Private Pirate Result — ${pirate.name}`,
    `
      <h2>🏴‍☠️ Duel Complete</h2>
      <p>${escapeHTML(text)}</p>
    `,
    callback
  );
}


// ------------------------------------------------------------
// PIRATE WIN CHECK
// ------------------------------------------------------------

function checkPirateVictory() {

  /*
   * Support both the old global counter and the newer
   * per-player counter if either is being used.
   */

  if (
    state.pirateDuelsWon >= 2
  ) {
    return true;
  }

  const pirate =
    state.players.find(
      p =>
        p.alive &&
        p.role === "Pirate"
    );

  if (
    pirate &&
    (pirate.pirateDuelsWon || 0) >= 2
  ) {
    return true;
  }

  return false;
}


// ------------------------------------------------------------
// PIRATE DUEL RESOLUTION
//
// NEVER RANDOMIZE THIS.
//
// The Pirate and opponent already secretly selected their
// moves during the Night.
// ------------------------------------------------------------

function resolvePirateDuel(action) {

  if (
    !action ||
    action.type !== "duel"
  ) {
    return;
  }

  const pirate =
    safeGetPlayer(
      action.actor
    );

  const opponent =
    safeGetPlayer(
      action.target
    );

  if (
    !pirate ||
    !opponent
  ) {
    return;
  }

  /*
   * The winner must have been selected by the private
   * Rock/Paper/Scissors interaction.
   */
  const winner =
    action.winner;

  if (
    winner === "pirate"
  ) {

    pirate.pirateDuelsWon =
      (
        pirate.pirateDuelsWon ||
        0
      ) + 1;

    /*
     * Pirate wins.
     * Opponent dies.
     */
    if (
      opponent.alive
    ) {

      opponent.alive =
        false;

      state.deathAnnouncements.push({
        name: opponent.name,
        role: opponent.role,
        cause: "Pirate Duel",
        cleaned: false,
        lastWords:
          getLastWords(
            opponent,
            "duel"
          )
      });
    }


  } else if (
    winner === "opponent"
  ) {

    /*
     * Pirate loses.
     * The rules say the loser dies, so the Pirate dies.
     */
    if (
      pirate.alive
    ) {

      pirate.alive =
        false;

      state.deathAnnouncements.push({
        name: pirate.name,
        role: pirate.role,
        cause: "Pirate Duel",
        cleaned: false,
        lastWords:
          getLastWords(
            pirate,
            "duel"
          )
      });
    }


  } else if (
    winner === "tie"
  ) {

    /*
     * No death.
     */
    state.results.push(
      "The Pirate duel ended in a tie."
    );
  }
}


// ------------------------------------------------------------
// CLEAR NIGHT-ONLY STATE
// ------------------------------------------------------------

function clearNightState() {

  state.actions = {};
  state.actionQueue = [];
  state.actionIndex = 0;

  state.transportedPlayers = {};
  state.transporterSelection = [];

  state.redactedPlayers =
    new Set();
}


// ------------------------------------------------------------
// START DAY SAFELY
// ------------------------------------------------------------

function startDayAfterNight() {

  state.phase =
    "day";

  state.dayStarted =
    true;

  announcePhase();

  /*
   * Check whether the game ended during the Night before
   * showing the Day screen.
   */
  if (
    checkWin()
  ) {
    return;
  }

  /*
   * Results are now shown to everybody.
   *
   * Private information has already been shown through
   * passTo(), so it is safe to enter the public Day phase.
   */
  renderDay();
}


// ============================================================
// IMPORTANT PATCH TO YOUR EXISTING beginNight()
// ============================================================
//
// At the beginning of beginNight(), after:
//
//   state.actions = {};
//
// make sure these are also reset:
//
//   state.redactedPlayers = new Set();
//
// Then call:
//
//   initializeAllRoleResources();
//
// ============================================================


// ============================================================
// IMPORTANT PATCH TO YOUR EXISTING nextNightAction()
// ============================================================
//
// DO NOT use the old:
//
//   const blocked = Object.values(state.actions).some(...)
//
// as the only source of roleblocking.
//
// It is order-dependent.
//
// A role that acts later in the queue could incorrectly
// avoid being blocked depending on the queue order.
//
// Instead, roleblocks should be resolved from the complete
// action list during Night resolution.
//
// The existing "blocked" check can remain as a UI shortcut,
// but the final resolution must still verify blocks.
// ============================================================