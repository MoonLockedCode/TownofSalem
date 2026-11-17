// Every player receives a matching night-turn screen, including roles without
// an ability and the Amnesiac's no-action Night 3 turn.
(() => {
  const originalRenderNightAction = window.renderNightAction;

  window.renderNightAction = function (actor) {
    const decoyRoles = ["Citizen", "Jester", "Executioner"];
    const amnesiacPass = state.amnesiacSkipActionId === actor?.id;

    if (actor?.role === "Sheriff") {
      const targets = living().filter(player => player.id !== actor.id);
      const cards = targets.map(player => `
        <div class="target-card" data-sheriff-target="${player.id}">
          🔎 ${escapeHTML(player.name)}
        </div>
      `).join("");

      $("gameArea").innerHTML = `
        <div class="night-action animate-in">
          <h2>🌙 Sheriff</h2>
          <p>Choose one living player to investigate. Your result will be shown privately at dawn.</p>
          <div class="target-grid">${cards}</div>
          <button class="primary" id="sheriffInvestigate" disabled>Investigate</button>
        </div>
      `;

      const confirmButton = $("sheriffInvestigate");
      let selectedTarget = null;

      document.querySelectorAll("[data-sheriff-target]").forEach(card => {
        card.onclick = () => {
          document.querySelectorAll("[data-sheriff-target]").forEach(item =>
            item.classList.remove("selected")
          );
          card.classList.add("selected");
          selectedTarget = Number(card.dataset.sheriffTarget);
          confirmButton.disabled = false;
        };
      });

      confirmButton.onclick = () => {
        const currentActor = state.actionQueue[state.actionIndex - 1];
        const target = getPlayer(selectedTarget);

        if (
          !actor.alive ||
          !currentActor || currentActor.id !== actor.id ||
          !target || !target.alive || target.id === actor.id
        ) return;

        state.actions[actor.id] = {
          actor: actor.id,
          target: target.id,
          type: "investigate"
        };

        $("gameArea").innerHTML = "";
        nextNightAction();
      };

      return;
    }

    if (!actor || (!decoyRoles.includes(actor.role) && !amnesiacPass)) {
      return originalRenderNightAction.call(this, actor);
    }

    const targets = living().filter(player => player.id !== actor.id);
    const cards = targets.map(player => `
      <button type="button" class="target-card" data-decoy-target="${player.id}">
        👤 ${escapeHTML(player.name)}
      </button>
    `).join("");

    $("gameArea").innerHTML = `
      <div class="night-action animate-in">
        <h2>🌙 Your Night Turn</h2>
        <p>Tap any player, then continue. This choice has no effect.</p>
        <div class="target-grid">${cards}</div>
        <button class="primary" id="decoyContinue" disabled>Continue</button>
      </div>
    `;

    const continueButton = $("decoyContinue");
    document.querySelectorAll("[data-decoy-target]").forEach(card => {
      card.onclick = () => {
        document.querySelectorAll("[data-decoy-target]").forEach(item =>
          item.classList.remove("selected")
        );
        card.classList.add("selected");
        continueButton.disabled = false;
      };
    });

    continueButton.onclick = () => submitNoNightAction(actor);
  };

  // Suppress legacy Sheriff/Investigator popups. The resolver computes all
  // information after every action has been submitted and delivers it at dawn.
  window.showImmediateInvestigationResult = function () {};
})();

function beginDawnPass() {
  const dawnPlayers = living();
  const queuedReports = state.privateNightResults || {};
  state.privateNightResults = {};

  function showPlayerReport(index) {
    if (index >= dawnPlayers.length) {
      finishNight();
      return;
    }

    const player = dawnPlayers[index];
    const reports = queuedReports[player.id] || [];

    passTo(
      `Pass to ${player.name}`,
      "Keep the screen private. Every living player receives a dawn report screen.",
      () => {
        const reportHTML = reports.length
          ? reports.map(report => `
              <section class="results">
                <h3>${escapeHTML(report.title)}</h3>
                <p>${escapeHTML(report.message)}</p>
              </section>
            `).join("")
          : "<p>Nothing happened to you tonight.</p>";

        $("gameArea").innerHTML = `
          <div class="night-action animate-in">
            <h2>🌅 Private Dawn Report</h2>
            ${reportHTML}
            <button class="primary" id="continueDawn">Continue</button>
          </div>
        `;

        $("continueDawn").onclick = () => showPlayerReport(index + 1);
      }
    );
  }

  showPlayerReport(0);
}
