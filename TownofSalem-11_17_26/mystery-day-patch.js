(() => {
  const LAST_WORDS_BY_GROUP = {
    mafia: [
      "The shadows took me... find the Godfather!",
      "They came in the night... the Mafia will pay!",
      "I knew too much... avenge me, Town!",
      "Tell my family... it was the Mafia..."
    ],

    coven: [
      "A curse upon the Coven... their magic will not save them!",
      "I felt the dark magic consume me... beware the witches!",
      "The Coven's spell was too strong... protect the innocent!",
      "The necromancy... it is real... stop them!"
    ],

    vigilante: [
      "I should have trusted my instincts...",
      "The bullets were meant for someone else...",
      "Protect the Town... there are still threats among you..."
    ],

    town: [
      "The Town must stand together...",
      "Find the truth before another innocent dies...",
      "Do not let my death divide you..."
    ],

    serialKiller: [
      "A lone figure... a knife... so cold...",
      "The killer walks among you..."
    ],

    poison: [
      "The poison courses through my veins... find the Poisoner!",
      "Death by poison... a coward's way to kill..."
    ],

    execution: [
      "The Town has made a grave mistake! I am innocent!",
      "You will regret this execution! Find the real killer!"
    ],

    neutral: [
      "I was never truly on anyone's side...",
      "Everyone has secrets in this town...",
      "My story ends here, but the game continues..."
    ],

    default: [
      "Tell my story... do not let me be forgotten...",
      "My time has come... finish what I started...",
      "The game continues without me... play well..."
    ]
  };

  const pick = list =>
    list[Math.floor(Math.random() * list.length)];

  function getDeathWords(player, cause = "") {
    const role = player?.role || "";
    const normalizedCause = String(cause).toLowerCase();

    if (normalizedCause.includes("poison")) {
      return pick(LAST_WORDS_BY_GROUP.poison);
    }

    if (
      [
        "execution",
        "executed",
        "lynch",
        "day vote"
      ].some(value => normalizedCause.includes(value))
    ) {
      return pick(LAST_WORDS_BY_GROUP.execution);
    }

    if (factionOf(player) === "Mafia") {
      return pick(LAST_WORDS_BY_GROUP.mafia);
    }

    if (factionOf(player) === "Coven") {
      return pick(LAST_WORDS_BY_GROUP.coven);
    }

    if (role === "Vigilante") {
      return pick(LAST_WORDS_BY_GROUP.vigilante);
    }

    if (role === "Serial Killer") {
      return pick(LAST_WORDS_BY_GROUP.serialKiller);
    }

    if (factionOf(player) === "Town") {
      return pick(LAST_WORDS_BY_GROUP.town);
    }

    if (
      [
        "Survivor",
        "Jester",
        "Executioner",
        "Witch",
        "Amnesiac",
        "Guardian Angel",
        "Pirate"
      ].includes(role)
    ) {
      return pick(LAST_WORDS_BY_GROUP.neutral);
    }

    return pick(LAST_WORDS_BY_GROUP.default);
  }

  function removeInvestigationSummaries() {
    state.results = (state.results || []).filter(result => {
      const text = String(result).toLowerCase();

      return !(
        text.includes(" investigated ") ||
        text.includes("investigation result") ||
        text.includes("tracked ") ||
        text.includes("looked out")
      );
    });
  }

  function publishDeathSummaries() {
    state.deathAnnouncements =
      state.deathAnnouncements || [];

    state.results = state.results || [];

    state.deathAnnouncements.forEach(death => {
      if (death.daySummaryPublished) return;

      const player = getPlayer(death.id);
      const role =
        death.cleaned
          ? "Unknown (cleaned)"
          : death.role || player?.role || "Unknown";

      const words =
        death.lastWords ||
        getDeathWords(player, death.cause);

      death.lastWords = words;
      death.daySummaryPublished = true;

      state.results.push(
        `${death.name} died. Role: ${role}. Last words: "${words}"`
      );
    });
  }

  function patchDeathAnnouncement() {
    if (typeof window.addDeathAnnouncement !== "function") {
      return;
    }

    const originalAddDeathAnnouncement =
      window.addDeathAnnouncement;

    window.addDeathAnnouncement = function (
      player,
      cause = "Unknown",
      cleaned = false,
      wordKey = "default"
    ) {
      originalAddDeathAnnouncement(
        player,
        cause,
        cleaned,
        wordKey
      );

      const death =
        state.deathAnnouncements?.find(
          announcement =>
            announcement.id === player?.id
        );

      if (death) {
        death.lastWords =
          getDeathWords(player, cause);
        death.cleaned = cleaned;
        death.role =
          cleaned ? null : player.role;
        death.daySummaryPublished = false;
      }
    };
  }

  function patchNightFinish() {
    if (
      typeof window.finishNightResolution !== "function" ||
      window.finishNightResolution.__mysteryPatch
    ) {
      return;
    }

    const originalFinishNightResolution =
      window.finishNightResolution;

    function patchedFinishNightResolution(
      trackResults = [],
      infoResults = []
    ) {
      // Keep Tracker, Lookout, Sheriff, and Investigator details private.
      removeInvestigationSummaries();

      // Show only public death information during the Day.
      publishDeathSummaries();

      return originalFinishNightResolution(
        trackResults,
        []
      );
    }

    patchedFinishNightResolution.__mysteryPatch = true;
    window.finishNightResolution =
      patchedFinishNightResolution;
  }

  function applyPatches() {
    patchDeathAnnouncement();
    patchNightFinish();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyPatches);
  } else {
    applyPatches();
  }

  setTimeout(applyPatches, 0);
})();