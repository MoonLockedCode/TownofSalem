function renderDay() {
  const gameArea = document.getElementById("gameArea");

  if (!gameArea) return;

  const results = Array.isArray(state.results)
    ? state.results
    : [];

  const announcements = Array.isArray(state.deathAnnouncements)
    ? state.deathAnnouncements
    : [];

  const resultHTML = results.length
    ? `<ul>${results.map(result => `<li>${escapeHTML(result)}</li>`).join("")}</ul>`
    : "<p>No major events were reported during the Night.</p>";

  const deathHTML = announcements.length
    ? `
      <h3>Night Deaths</h3>
      <ul>
        ${announcements.map(death => {
          const hidden =
            death.redacted === true ||
            death.roleRedacted === true ||
            death.cleaned === true ||
            death.cleanedUp === true ||
            death.janitorCleaned === true;

          if (hidden) {
            return "<li>💀 Someone died during the Night, but their identity was hidden.</li>";
          }

          return `
            <li>
              💀 ${escapeHTML(death.name || "Unknown player")}
              ${death.role ? ` — ${escapeHTML(death.role)}` : ""}
            </li>
          `;
        }).join("")}
      </ul>
    `
    : "<p>No one died during the Night.</p>";

  gameArea.innerHTML = `
    <div class="day-action animate-in">
      <h2>☀️ Day ${state.night}</h2>

      <section class="results">
        <h3>Night Results</h3>
        ${resultHTML}
        ${deathHTML}
      </section>

      <button class="primary" id="continueDay">
        Continue
      </button>
    </div>
  `;

  document.getElementById("continueDay").onclick = renderDayVote;
}

function renderDayVote() {
  const gameArea = document.getElementById("gameArea");

  if (!gameArea) return;

  const playerOptions = living()
    .map(player => `
      <option value="${escapeHTML(player.id)}">
        ${escapeHTML(player.name)}
      </option>
    `)
    .join("");

  gameArea.innerHTML = `
    <div class="day-action animate-in">
      <h2>☀️ Day ${state.night}</h2>

      <section class="voting-section">
        <h3>Town Discussion and Vote</h3>
        <p>
          Discuss publicly, then choose one living player to eliminate,
          or skip the Day elimination.
        </p>

        <select id="dayVoteTarget">
          <option value="">Choose a player</option>
          ${playerOptions}
        </select>

        <div class="day-vote-actions">
          <button class="primary" id="submitDayVote">
            Eliminate Selected Player
          </button>

          <button class="secondary" id="skipDayVote">
            Skip Day Elimination
          </button>
        </div>
      </section>
    </div>
  `;

  const voteButton = document.getElementById("submitDayVote");
  const skipButton = document.getElementById("skipDayVote");
  const voteTarget = document.getElementById("dayVoteTarget");

  voteButton.onclick = () => {
    if (!voteTarget.value) {
      return;
    }

    const target = getPlayer(voteTarget.value);

    if (!target || !target.alive) {
      return;
    }

    target.alive = false;
    target.revealed = true;

    if (!Array.isArray(state.results)) {
      state.results = [];
    }

    state.results.push(
      `${target.name} was eliminated by the Town. Their role was ${target.role}.`
    );

    addDeathAnnouncement(target, "Execution");
    showDayElimination(target);
  };

  skipButton.onclick = () => {
    if (!Array.isArray(state.results)) {
      state.results = [];
    }

    state.results.push("The Town skipped the Day elimination.");

    finishDayPhase();
  };
}

function showDayElimination(player) {
  const gameArea = document.getElementById("gameArea");
  if (!gameArea || !player) return;

  renderPlayers();
  gameArea.innerHTML = `
    <div class="day-action elimination-reveal animate-in">
      <div class="reveal-mark" aria-hidden="true">⚖️</div>
      <p class="eyebrow">The Town has voted</p>
      <h2>${escapeHTML(player.name)} was eliminated</h2>
      <p class="revealed-role">Their role was <strong>${escapeHTML(player.role)}</strong>.</p>
      <button class="primary" id="continueAfterExecution">Continue to Night</button>
    </div>
  `;

  document.getElementById("continueAfterExecution").onclick = finishDayPhase;
}

function finishDayPhase() {
  renderPlayers();
  announcePhase();

  if (!checkWin()) {
    state.night++;
    state.dayStarted = false;
    beginNight();
  }
}