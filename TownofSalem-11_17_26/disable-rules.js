(() => {
  const disabledRoles = new Set([
    "Blackmailer",
    "Forger",
    "Medium",
    "Framer",
    "Tracker",
    "juggernaut"

  ]);

  // Remove disabled roles from the rules/reference data.
  disabledRoles.forEach(role => {
    if (typeof ROLE_DATA !== "undefined") {
      delete ROLE_DATA[role];
    }
  });

  // Keep disabled roles out of automatic balancing without creating Citizens.
  if (typeof balancedRoles === "function") {
    const originalBalancedRoles = balancedRoles;

    balancedRoles = count => {
      const roles = originalBalancedRoles(count);

      if (!roles) {
        return roles;
      }

      const replacementRoles = [
        "Sheriff",
        "Doctor",
        "Investigator",
        "Bodyguard",
        "Vigilante",
        "Lookout",
        "Transporter",
        "Veteran",
        "Consigliere",
        "Janitor",
        "Consort"
      ];

      const used = new Set(roles);

      return roles.map(role => {
        if (!disabledRoles.has(role)) {
          return role;
        }

        const available = replacementRoles.find(
          replacement =>
            !used.has(replacement) &&
            !disabledRoles.has(replacement)
        );

        const replacement =
          available ||
          replacementRoles[
            Math.floor(
              Math.random() * replacementRoles.length
            )
          ];

        used.add(replacement);
        return replacement;
      });
    };
  }

  // Remove disabled roles from manually created role selectors.
  const removeDisabledOptions = () => {
    document
      .querySelectorAll(".role-choice option")
      .forEach(option => {
        if (disabledRoles.has(option.value)) {
          option.remove();
        }
      });
  };

  new MutationObserver(removeDisabledOptions).observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

  removeDisabledOptions();

  // Fix script.js naming mismatch.
  // script.js calls getInvestigationResult(), while the helper
  // currently provided is named getInvestigatorResult().
  if (
    typeof window.getInvestigationResult !== "function" &&
    typeof window.getInvestigatorResult === "function"
  ) {
    window.getInvestigationResult =
      window.getInvestigatorResult;
  }

  // ----------------------------------------------------------
  // MAFIA TEAM VOTING
  // ----------------------------------------------------------

  const originalSetupNightActionControls =
    window.setupNightActionControls;

  const originalRenderNightAction =
    window.renderNightAction;

  const originalNextNightAction =
    window.nextNightAction;

  state.mafiaVotes = state.mafiaVotes || {};
  state.mafiaVotePreparedNight = null;

  const mafiaHasSpecialAction = actor =>
    actor &&
    isMafia(actor) &&
    ![
      "Godfather",
      "Mafioso"
    ].includes(actor.role);

  const getMafiaVoteTargets = actor =>
    living().filter(player =>
      player.id !== actor.id &&
      !isMafia(player)
    );

  function submitMafiaVote(actor) {
    if (!actor || !actor.alive) {
      return;
    }

    const currentActor =
      state.actionQueue[state.actionIndex - 1];

    if (
      !currentActor ||
      currentActor.id !== actor.id
    ) {
      return;
    }

    const targetInput = $("selectedTarget");
    const targetId = Number(
      targetInput?.value
    );

    if (
      !Number.isInteger(targetId) ||
      !getPlayer(targetId) ||
      !getPlayer(targetId).alive ||
      isMafia(getPlayer(targetId))
    ) {
      return;
    }

    state.mafiaVotes[actor.id] = targetId;

    // No mafiaAttack action is created here. The final target
    // is selected after every Mafia member has voted.
    $("gameArea").innerHTML = "";

    if (mafiaHasSpecialAction(actor)) {
      state.mafiaSpecialPhase = true;
      originalRenderNightAction(actor);
      return;
    }

    state.mafiaSpecialPhase = false;
    nextNightAction();
  }

  function renderMafiaVoteAction(actor) {
    const targets = getMafiaVoteTargets(actor);

    $("gameArea").innerHTML = `
      <div class="night-action animate-in">
        <h2>🔪 Mafia Vote</h2>

        <p>
          Choose the player you want the Mafia to attack.
          This is only your vote; the final target is chosen
          after all Mafia members vote.
        </p>

        <div class="target-grid">
          ${targets.map(player => `
            <div
              class="target-card"
              data-target="${player.id}">
              ☠️ ${escapeHTML(player.name)}
            </div>
          `).join("")}
        </div>

        <input
          type="hidden"
          id="selectedTarget"
          value="">

        <button
          class="primary confirm-btn"
          id="mafiaVoteConfirm"
          disabled>
          Submit Mafia Vote
        </button>
      </div>
    `;

    const cards =
      document.querySelectorAll(".target-card");

    const selected =
      $("selectedTarget");

    const confirm =
      $("mafiaVoteConfirm");

    cards.forEach(card => {
      card.onclick = () => {
        cards.forEach(other =>
          other.classList.remove("selected")
        );

        card.classList.add("selected");
        selected.value = card.dataset.target;
        confirm.disabled = false;
      };
    });

    confirm.onclick = () => {
      if (!confirm.disabled) {
        submitMafiaVote(actor);
      }
    };
  }

  window.setupNightActionControls = actor => {
    if (
      actor &&
      isMafia(actor) &&
      !state.mafiaSpecialPhase
    ) {
      renderMafiaVoteAction(actor);
      return;
    }

    if (typeof originalSetupNightActionControls === "function") {
      originalSetupNightActionControls(actor);
    }
  };

  function prepareMafiaAttack() {
    if (
      state.mafiaVotePreparedNight === state.night
    ) {
      return;
    }

    const mafiaMembers =
      living().filter(isMafia);

    const votes = mafiaMembers
      .map(member => ({
        member,
        target: Number(
          state.mafiaVotes?.[member.id]
        )
      }))
      .filter(vote =>
        Number.isInteger(vote.target) &&
        getPlayer(vote.target)?.alive &&
        !isMafia(getPlayer(vote.target))
      );

    if (!votes.length) {
      state.mafiaVotePreparedNight = state.night;
      return;
    }

    const godfather =
      mafiaMembers.find(
        member => member.role === "Godfather"
      );

    let winningTarget = null;

    // The Godfather's valid vote is final.
    if (
      godfather &&
      votes.some(vote =>
        vote.member.id === godfather.id
      )
    ) {
      winningTarget =
        votes.find(vote =>
          vote.member.id === godfather.id
        ).target;
    } else {
      const counts = {};

      votes.forEach(vote => {
        counts[vote.target] =
          (counts[vote.target] || 0) + 1;
      });

      const highest =
        Math.max(...Object.values(counts));

      const tiedTargets =
        Object.keys(counts)
          .filter(target =>
            counts[target] === highest
          )
          .map(Number);

      winningTarget =
        tiedTargets[
          Math.floor(
            Math.random() * tiedTargets.length
          )
        ];
    }

    const attackActor =
      godfather ||
      votes[0].member;

    state.actions[attackActor.id] = {
      actor: attackActor.id,
      target: winningTarget,
      type: "mafiaAttack"
    };

    state.mafiaVotePreparedNight = state.night;
  }

  window.nextNightAction = () => {
    const nextActor =
      state.actionQueue &&
      state.actionQueue[state.actionIndex];

    if (
      nextActor &&
      isMafia(nextActor) &&
      state.mafiaSpecialPhase
    ) {
      state.mafiaSpecialPhase = false;
    }

    if (
      !nextActor &&
      state.actionIndex >=
        (state.actionQueue?.length || 0)
    ) {
      prepareMafiaAttack();
    }

    if (typeof originalNextNightAction === "function") {
      return originalNextNightAction();
    }
  };

  // Reset Mafia voting state at the beginning of each night.
  const originalBeginNight =
    window.beginNight;

  window.beginNight = () => {
    state.mafiaVotes = {};
    state.mafiaVotePreparedNight = null;
    state.mafiaSpecialPhase = false;

    if (typeof originalBeginNight === "function") {
      return originalBeginNight();
    }
  };
})();