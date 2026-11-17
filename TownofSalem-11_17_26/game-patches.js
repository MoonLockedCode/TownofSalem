// Gameplay patches for Murder at Town Square

const _originalSetupNightActionControls =
  window.setupNightActionControls;

const _originalSubmitNightAction =
  window.submitNightAction;

const _originalBeginNight =
  window.beginNight;

const _originalNextNightAction =
  window.nextNightAction;


// ============================================================
// GENERAL HELPERS
// ============================================================

function submitNoNightAction(actor) {
  if (!actor || !actor.alive) return;

  const currentActor =
    state.actionQueue[state.actionIndex - 1];

  if (!currentActor || currentActor.id !== actor.id) {
    return;
  }

  if (state.amnesiacSkipActionId === actor.id) {
    state.amnesiacSkipActionId = null;
  }

  state.actions[actor.id] = {
    actor: actor.id,
    target: null,
    type: "none"
  };

  $("gameArea").innerHTML = "";
  nextNightAction();
}

function addContinueButton(actor) {
  const gameArea = $("gameArea");

  if (!gameArea || $("skipNightAction")) return;

  const button = document.createElement("button");
  button.id = "skipNightAction";
  button.className = "primary";
  button.textContent = "Continue";

  button.onclick = () => submitNoNightAction(actor);

  gameArea.querySelector(".night-action, .night-action-card")
    ?.appendChild(button);
}


// ============================================================
// VIGILANTE, AMNESIAC, AND JANITOR CONTROLS
// ============================================================

function patchedSetupNightActionControls(actor) {
  if (!actor) return;

  // Amnesiac must pass during Nights 1 and 2.
  if (actor.role === "Amnesiac" && state.night < 3) {
    $("gameArea").innerHTML = `
      <div class="night-action animate-in">
        <h2>🧠 Amnesiac</h2>
        <p>
          You cannot remember a role yet.
          You may begin remembering on Night 3.
        </p>
        <button class="primary" id="submitAction">
          Continue
        </button>
      </div>
    `;

    $("submitAction").onclick = () =>
      submitNoNightAction(actor);

    return;
  }

  if (actor.role !== "Transporter") {
    _originalSetupNightActionControls(actor);
  } else {
    setupTransporterControls(actor);
  }

  // The Vigilante may choose not to shoot.
  if (actor.role === "Vigilante") {
    addContinueButton(actor);
  }

  // The Janitor may always pass when no clean is desired.
  if (actor.role === "Janitor") {
    const continueButton = $("submitAction");

    if (continueButton) {
      continueButton.onclick = () =>
        submitNoNightAction(actor);
    }
  }
}


// ============================================================
// TRANSPORTER
// ============================================================

function setupTransporterControls(actor) {
  const cards = document.querySelectorAll(".target-card");
  const selectedInput = $("selectedTarget");
  const confirmButton = $("confirmBtn");

  state.transporterSelection = [];

  cards.forEach(card => {
    card.onclick = () => {
      const targetId = Number(card.dataset.target);

      if (Number.isNaN(targetId)) return;

      if (card.classList.contains("selected")) {
        card.classList.remove("selected");

        state.transporterSelection =
          state.transporterSelection.filter(
            id => id !== targetId
          );
      } else {
        if (state.transporterSelection.length >= 2) {
          const oldest =
            state.transporterSelection.shift();

          document
            .querySelectorAll(".target-card")
            .forEach(other => {
              if (Number(other.dataset.target) === oldest) {
                other.classList.remove("selected");
              }
            });
        }

        card.classList.add("selected");
        state.transporterSelection.push(targetId);
      }

      if (selectedInput) {
        selectedInput.value =
          state.transporterSelection.join(",");
      }

      if (confirmButton) {
        confirmButton.disabled =
          state.transporterSelection.length !== 2;
      }
    };
  });

  if (confirmButton) {
    confirmButton.onclick = () => {
      if (confirmButton.disabled) return;
      submitTransporterAction(actor);
    };
  }
}

function submitTransporterAction(actor) {
  if (!actor || !actor.alive) return;

  const currentActor =
    state.actionQueue[state.actionIndex - 1];

  if (!currentActor || currentActor.id !== actor.id) {
    return;
  }

  const selected = [
    ...state.transporterSelection
  ];

  if (
    selected.length !== 2 ||
    selected[0] === selected[1]
  ) {
    return;
  }

  state.actions[actor.id] = {
    actor: actor.id,
    target: selected,
    type: "transport"
  };

  $("gameArea").innerHTML = "";
  nextNightAction();
}

function redirectedTarget(target) {
  if (Array.isArray(target)) {
    return target.map(id => redirectedTarget(id));
  }

  const id = Number(target);

  if (
    Number.isNaN(id) ||
    !state.transportedPlayers
  ) {
    return target;
  }

  return state.transportedPlayers[id] ?? id;
}


// ============================================================
// AMNESIAC REASSIGNMENT
// ============================================================

function assignAmnesiacRoleOnNightThree() {
  if (
    !state ||
    !Array.isArray(state.players) ||
    state.night !== 3
  ) {
    return;
  }

  const amnesiac = state.players.find(
    player =>
      player.alive &&
      player.role === "Amnesiac"
  );

  if (!amnesiac) return;

  const randomRoles = Object.keys(ROLE_DATA).filter(
    role =>
      ![
        "Amnesiac",
        "Citizen",
        "Jester",
        "Executioner"
      ].includes(role)
  );

  if (!randomRoles.length) return;

  const newRole =
    randomRoles[
      Math.floor(Math.random() * randomRoles.length)
    ];

  amnesiac.role = newRole;
  amnesiac.rememberedRole = newRole;

  if (typeof initializeRoleResources === "function") {
    initializeRoleResources(amnesiac, false);
  }

  // Prevent the newly assigned role from acting on Night 3.
  state.amnesiacSkipActionId = amnesiac.id;

  state.results = state.results || [];
  state.results.push(
    `${amnesiac.name} has received a new role.`
  );
}

window.beginNight = function () {
  assignAmnesiacRoleOnNightThree();

  if (typeof _originalBeginNight === "function") {
    return _originalBeginNight();
  }
};

window.nextNightAction = function () {
  if (typeof _originalNextNightAction === "function") {
    return _originalNextNightAction();
  }
};


// ============================================================
// AUTO-BALANCE: AVOID USELESS CITIZENS
// ============================================================

const _originalBalancedRoles =
  window.balancedRoles;

if (typeof _originalBalancedRoles === "function") {
  window.balancedRoles = function (count) {
    const roles = _originalBalancedRoles(count);

    if (!roles) return roles;

    const replacementTownRoles = [
      "Sheriff",
      "Doctor",
      "Investigator",
      "Bodyguard",
      "Vigilante",
      "Tracker",
      "Lookout",
      "Medium",
      "Transporter",
      "Veteran"
    ];

    const used = new Set(roles);

    return roles.map(role => {
      if (role !== "Citizen") return role;

      const unusedRole =
        replacementTownRoles.find(
          candidate => !used.has(candidate)
        );

      const replacement =
        unusedRole ||
        replacementTownRoles[
          Math.floor(
            Math.random() *
            replacementTownRoles.length
          )
        ];

      used.add(replacement);
      return replacement;
    });
  };
}


// ============================================================
// PUBLIC DEATH ANNOUNCEMENTS
// ============================================================

function addDeathAnnouncement(
  player,
  cause = "Unknown",
  cleaned = false,
  wordKey = "default"
) {
  if (!player) return;

  state.deathAnnouncements =
    state.deathAnnouncements || [];

  if (
    state.deathAnnouncements.some(
      announcement => announcement.id === player.id
    )
  ) {
    return;
  }

  state.deathAnnouncements.push({
    id: player.id,
    name: player.name,
    role: player.role,
    cause,
    cleaned,
    lastWords: getLastWords(player, wordKey)
  });

  player.deathAnnounced = true;
}


// ============================================================
// WIN CHECK
// ============================================================

window.checkWin = function () {
  const alivePlayers = living();

  const mafiaAlive =
    alivePlayers.some(isMafia);

  const covenAlive =
    alivePlayers.some(isCoven);

  const hostileAlive =
    mafiaAlive ||
    covenAlive ||
    alivePlayers.some(player =>
      [
        "Serial Killer",
        "Arsonist",
        "Werewolf",
        "Pestilence",
        "Juggernaut"
      ].includes(player.role)
    );

  if (!hostileAlive && alivePlayers.length > 0) {
    endGame("🏘️ The Town wins!");
    return true;
  }

  if (
    mafiaAlive &&
    alivePlayers.filter(player => !isMafia(player)).length <=
    alivePlayers.filter(isMafia).length
  ) {
    endGame("🔪 The Mafia wins!");
    return true;
  }

  if (
    !mafiaAlive &&
    covenAlive &&
    alivePlayers.filter(player => !isCoven(player)).length <=
    alivePlayers.filter(isCoven).length
  ) {
    endGame("🧙 The Coven wins!");
    return true;
  }

  if (alivePlayers.length === 1 && hostileAlive) {
    endGame(`☠️ ${alivePlayers[0].name} wins!`);
    return true;
  }

  return false;
};

window.endGame = window.endGame || function (message) {
  state.phase = "ended";
  announce(message);
  renderPlayers();
};


// ============================================================
// PRIVATE TRACKER RESULTS
// ============================================================

function finishNightResolution(
  trackResults = [],
  infoResults = [],
  callback
) {
  state.results = state.results || [];

  // Tracker and Lookout results remain private.
  // They are intentionally not added to the public Day log.

  // Only log public investigation info
  infoResults.forEach(result => {
    state.results.push(
      `${result.actor.name} investigated ${result.target.name}.`
    );
  });

  renderPlayers();

  // Use the new night-resolution.js finishNight if available
  if (typeof finishNight === "function" && window._nightResolutionLoaded) {
    finishNight();
    if (typeof callback === "function") callback();
    return;
  }

  if (typeof startDayAfterNight === "function") {
    startDayAfterNight();
    if (typeof callback === "function") callback();
  } else if (typeof renderDay === "function") {
    state.phase = "day";
    renderDay();
    if (typeof callback === "function") callback();
  }
}


// ============================================================
// RULES BUTTON
// ============================================================

function setupRulesButton() {
  const button =
    document.getElementById("rulesButton") ||
    document.getElementById("rulesBtn") ||
    document.getElementById("rules-button");

  if (!button || button.dataset.rulesReady) return;

  button.dataset.rulesReady = "true";

  button.onclick = event => {
    event.preventDefault();

    let modal = document.getElementById("rulesOverlay");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "rulesOverlay";
      modal.className = "pass-overlay";

      modal.innerHTML = `
        <div class="role-card rules-card">
          <h2>Game Rules and Roles</h2>
          <div id="rulesContent"></div>
          <button class="primary" id="closeRulesButton">
            Close
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      $("closeRulesButton").onclick = () =>
        modal.classList.add("hidden");
    }

    const grouped = {};

    Object.entries(ROLE_DATA).forEach(([role, info]) => {
      const faction = info.faction || "Other";

      if (!grouped[faction]) {
        grouped[faction] = [];
      }

      grouped[faction].push(`
        <div class="rule-role">
          <h3>${escapeHTML(role)}</h3>
          <p><strong>Type:</strong> ${escapeHTML(info.type)}</p>
          <p><strong>Night:</strong> ${escapeHTML(info.night)}</p>
          <p><strong>Goal:</strong> ${escapeHTML(info.goal)}</p>
        </div>
      `);
    });

    $("rulesContent").innerHTML =
      Object.entries(grouped).map(
        ([faction, roles]) => `
          <section>
            <h2>${escapeHTML(faction)}</h2>
            ${roles.join("")}
          </section>
        `
      ).join("");

    modal.classList.remove("hidden");
  };
}

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    setupRulesButton
  );
} else {
  setupRulesButton();
}


// ============================================================
// QUICK TUTORIAL
// ============================================================

function setupTutorialButtons() {
  const modal = document.getElementById("tutorialModal");
  if (!modal) return;

  const closeTutorial = () => modal.classList.add("hidden");

  ["tutorialButton", "setupTutorialButton"].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.onclick = () => modal.classList.remove("hidden");
  });

  ["closeTutorial", "closeTutorialButton"].forEach(id => {
    const button = document.getElementById(id);
    if (button) button.onclick = closeTutorial;
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) closeTutorial();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.classList.contains("hidden")) {
      closeTutorial();
    }
  });
}

setupTutorialButtons();

// ============================================================
// APPLY PATCHES
// ============================================================

window.setupNightActionControls =
  patchedSetupNightActionControls;