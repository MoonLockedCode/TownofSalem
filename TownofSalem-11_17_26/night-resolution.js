// ============================================================
// NIGHT RESOLUTION SYSTEM
// ============================================================
// Flag so game-patches.js knows the new engine is loaded
window._nightResolutionLoaded = true;
// Handles proper ordering: roleblocks → transport → resolve
// Also logs every action for post-game review.
// ============================================================

// ---------- ACTION LOG ----------
// Records who each player targeted each night, for reference
// and for correct resolution of roleblock/transport effects.

function initActionLog() {
  if (!state.actionLog) state.actionLog = {};
  if (!state.actionLog[state.night]) state.actionLog[state.night] = [];
}

function logAction(actorId, type, rawTarget, resolvedTarget, meta) {
  initActionLog();
  const actor = getPlayer(actorId);
  state.actionLog[state.night].push({
    actorId,
    actorName: actor ? actor.name : "Unknown",
    role: actor ? actor.role : "Unknown",
    type,
    rawTarget,
    resolvedTarget,
    meta: meta || {}
  });
}

function getNightLog() {
  initActionLog();
  return state.actionLog[state.night] || [];
}

// Private reports are queued during resolution and delivered in the dawn pass.
function queuePrivateNightResult(playerId, title, message) {
  if (!state.privateNightResults) state.privateNightResults = {};
  if (!state.privateNightResults[playerId]) state.privateNightResults[playerId] = [];
  state.privateNightResults[playerId].push({ title, message });
}

// Extension point for additional target-changing roles. A hook may return an
// updated action; rawTarget remains unchanged for logs and visit tracking.
window.nightActionModifierHooks = window.nightActionModifierHooks || [];
window.registerNightActionModifier = function(name, handler) {
  if (typeof name !== "string" || typeof handler !== "function") return;
  const hooks = window.nightActionModifierHooks;
  if (!hooks.some(hook => hook.name === name)) {
    hooks.push({ name, handler });
  }
};

function applyNightActionModifiers(actions, context) {
  return actions.map(action => {
    let modified = action;
    window.nightActionModifierHooks.forEach(({ handler }) => {
      try {
        const result = handler(modified, context);
        if (result && typeof result === "object") modified = result;
      } catch (error) {
        console.error("Night action modifier failed:", error);
      }
    });
    return modified;
  });
}

// ---------- UNDEFINED FIX ----------
// Ensure getInvestigationResult exists for the patch functions.

if (typeof window.getInvestigationResult === "undefined") {
  window.getInvestigationResult = function(player) {
    if (!player) return "Unknown";
    if (state.redactedPlayers && state.redactedPlayers.has(player.id)) return "REDACTED";
    if (state.disguisedPlayers && state.disguisedPlayers[player.id]) {
      const t = getPlayer(state.disguisedPlayers[player.id]);
      if (t) return t.role;
    }
    return player.role;
  };
}

if (typeof window.getSheriffResult === "undefined") {
  window.getSheriffResult = function(player) {
    if (!player) return "Unknown";
    if (player.role === "Godfather") return "Good";
    const bad = ["Mafioso","Consigliere","Blackmailer","Janitor","Framer","Disguiser","Forger","Ambusher","Hypnotist","Consort","Coven Leader","Potion Master","Necromancer","Poisoner","Medusa","Coven Member","Serial Killer","Arsonist","Werewolf","Plaguebearer","Pestilence","Juggernaut"];
    if (state.framedPlayers && state.framedPlayers.has(player.id)) return "Bad";
    if (bad.includes(player.role)) return "Bad";
    if (factionOf(player) === "Town") return "Good";
    return "Neutral";
  };
}

const _baseInvestigationResult = window.getInvestigationResult;
window.getInvestigationResult = function(player) {
  if (!player) return "Unknown";
  const targetId = state.transportedPlayers?.[player.id] ?? player.id;
  const redirectedPlayer = getPlayer(targetId) || player;
  return _baseInvestigationResult.call(window, redirectedPlayer);
};

const _baseSheriffResult = window.getSheriffResult;
window.getSheriffResult = function(player) {
  if (!player) return "Unknown";
  const targetId = state.transportedPlayers?.[player.id] ?? player.id;
  const redirectedPlayer = getPlayer(targetId) || player;
  if (state.framedPlayers?.has(redirectedPlayer.id)) return "Bad";
  return _baseSheriffResult.call(window, redirectedPlayer);
};

// ---------- NIGHT RESOLUTION ENGINE ----------

function resolveNightActions() {
  // Gather all actions submitted this night
  const allActions = Object.values(state.actions || {}).filter(a => a && a.actor != null);

  initActionLog();

  // --- STEP 1: Resolve roleblocks before transport ---
  // A block targets the actor directly; blocked actors cannot apply a swap
  // or any other action, even if their action was submitted earlier.
  const blockActions = allActions.filter(a => a.type === "block");
  const blockedPlayerIds = new Set(
    blockActions.map(a => Number(a.target)).filter(Number.isFinite)
  );

  // --- STEP 2: Build a consistent, non-overlapping transport map ---
  state.transportedPlayers = {};
  const transportActions = allActions.filter(a =>
    a.type === "transport" &&
    Array.isArray(a.target) &&
    !blockedPlayerIds.has(Number(a.actor))
  );
  transportActions.forEach(a => {
    const pair = a.target.map(Number);
    if (
      pair.length !== 2 ||
      !pair.every(Number.isFinite) ||
      pair[0] === pair[1] ||
      state.transportedPlayers[pair[0]] !== undefined ||
      state.transportedPlayers[pair[1]] !== undefined
    ) return;

    state.transportedPlayers[pair[0]] = pair[1];
    state.transportedPlayers[pair[1]] = pair[0];
  });

  // Only scalar player targets are redirected. The submitted pair that
  // defines a transport remains intact rather than being swapped itself.
  function effectiveTarget(rawTarget) {
    if (rawTarget == null) return null;
    const id = Number(rawTarget);
    if (Number.isNaN(id)) return rawTarget;
    return state.transportedPlayers[id] !== undefined
      ? state.transportedPlayers[id]
      : id;
  }

  // --- STEP 3: Remove blocked actions and resolve all other targets ---
  const usableActions = allActions.filter(a => {
    if (a.type === "block") return true;
    if (blockedPlayerIds.has(Number(a.actor))) {
      logAction(a.actor, "blocked", null, null);
      return false;
    }
    return true;
  });

  // --- STEP 4: Apply registered role modifiers to normalized actions ---
  const resolvedActions = applyNightActionModifiers(
    usableActions.map(a => ({
      ...a,
      rawTarget: a.target,
      resolvedTarget: a.type === "transport"
        ? a.target
        : effectiveTarget(a.target)
    })),
    { state, effectiveTarget }
  );

  // --- STEP 5: Log the raw and final targets ---

  resolvedActions.forEach(a => {
    logAction(a.actor, a.type, a.target, a.resolvedTarget);
  });

  // --- STEP 6: Apply state-modifying effects (blackmail, frame, etc.) ---
  // Clear and re-apply each night
  state.blackmailedPlayers = new Set();
  state.framedPlayers = new Set();
  state.disguisedPlayers = {};
  state.redactedPlayers = new Set();

  resolvedActions.forEach(a => {
    if (a.type === "blackmail" && a.resolvedTarget != null)
      state.blackmailedPlayers.add(a.resolvedTarget);
    if (a.type === "frame" && a.resolvedTarget != null)
      state.framedPlayers.add(a.resolvedTarget);
    if (a.type === "disguise" && a.resolvedTarget != null)
      state.disguisedPlayers[a.actor] = a.resolvedTarget;
    if (a.type === "redact" && a.resolvedTarget != null)
      state.redactedPlayers.add(a.resolvedTarget);
  });

  // --- STEP 7: Collect protection effects ---
  const protectedSet = new Set(); // healed / vested / GA'd
  const guardedSet = new Set();   // bodyguarded
  const alertSet = new Set();     // veteran on alert

  resolvedActions.forEach(a => {
    if (a.type === "heal" && a.resolvedTarget != null) protectedSet.add(a.resolvedTarget);
    if (a.type === "gaProtect" && a.resolvedTarget != null) protectedSet.add(a.resolvedTarget);
    if (a.type === "vest") protectedSet.add(a.actor);
    if (a.type === "potion" && a.potion === "heal" && a.resolvedTarget != null) protectedSet.add(a.resolvedTarget);
    if (a.type === "alert") { alertSet.add(a.actor); protectedSet.add(a.actor); }
    if (a.type === "guard" && a.resolvedTarget != null) guardedSet.add(a.resolvedTarget);
  });

  // --- STEP 8: Collect all attack attempts ---
  // Format: { targetId: sourceName }
  const attackMap = new Map();

  function queueAttack(targetId, source) {
    if (targetId == null) return;
    if (!attackMap.has(targetId)) {
      attackMap.set(targetId, source);
    }
  }

  // Mafia attack (Godfather target preferred)
  const mafiaAttacks = resolvedActions.filter(a => a.type === "mafiaAttack");
  const gfAttack = mafiaAttacks.find(a => {
    const p = getPlayer(a.actor);
    return p && p.role === "Godfather";
  });
  const chosenMafia = gfAttack || mafiaAttacks[0];
  if (chosenMafia && chosenMafia.resolvedTarget != null) {
    queueAttack(chosenMafia.resolvedTarget, "Mafia");
  }

  // Vigilante
  resolvedActions.filter(a => {
    const p = getPlayer(a.actor);
    return a.type === "attack" && p && p.role === "Vigilante";
  }).forEach(a => {
    if (a.resolvedTarget != null) queueAttack(a.resolvedTarget, "Vigilante");
  });

  // Serial Killer
  resolvedActions.filter(a => {
    const p = getPlayer(a.actor);
    return a.type === "attack" && p && p.role === "Serial Killer";
  }).forEach(a => {
    if (a.resolvedTarget != null) queueAttack(a.resolvedTarget, "Serial Killer");
  });

  // Werewolf
  if (state.fullMoon) {
    resolvedActions.filter(a => a.type === "werewolfAttack").forEach(a => {
      if (a.resolvedTarget != null) queueAttack(a.resolvedTarget, "Werewolf");
    });
    // Werewolf also attacks visitors to its target
    resolvedActions.filter(a => a.type === "werewolfAttack").forEach(ww => {
      const wwTarget = ww.resolvedTarget;
      if (wwTarget == null) return;
      resolvedActions.forEach(v => {
        if (v.actor === ww.actor) return;
        if (v.resolvedTarget != null &&
            Number(v.resolvedTarget) === Number(wwTarget)) {
          queueAttack(v.actor, "Werewolf");
        }
      });
    });
  }

  // Ambusher
  resolvedActions.filter(a => a.type === "ambush").forEach(a => {
    const ambTarget = a.resolvedTarget;
    if (ambTarget == null) return;
    resolvedActions.forEach(v => {
      if (v.actor === a.actor) return;
      if (v.resolvedTarget != null && Number(v.resolvedTarget) === Number(ambTarget)) {
        queueAttack(v.actor, "Ambusher");
      }
    });
  });

  // Potion Master attack
  resolvedActions.filter(a => a.type === "potion" && a.potion === "attack").forEach(a => {
    if (a.resolvedTarget != null) queueAttack(a.resolvedTarget, "Potion Master");
  });

  // Juggernaut
  resolvedActions.filter(a => a.type === "jugAttack").forEach(a => {
    if (a.resolvedTarget != null) queueAttack(a.resolvedTarget, "Juggernaut");
  });

  // Pestilence
  resolvedActions.filter(a => a.type === "pestAttack").forEach(a => {
    if (a.resolvedTarget != null) queueAttack(a.resolvedTarget, "Pestilence");
  });

  // Arsonist ignite
  resolvedActions.filter(a => a.type === "ignite").forEach(() => {
    state.dousedPlayers.forEach(pId => {
      queueAttack(pId, "Arsonist");
    });
    state.dousedPlayers.clear();
  });

  // Arsonist douse (adds to set, doesn't kill)
  resolvedActions.filter(a => a.type === "douse").forEach(a => {
    if (a.resolvedTarget != null) state.dousedPlayers.add(a.resolvedTarget);
  });

  // Poison
  resolvedActions.filter(a => a.type === "poison").forEach(a => {
    if (a.resolvedTarget != null) {
      state.poisonedPlayers[a.resolvedTarget] = state.night;
    }
  });

  // Medusa stone gaze
  const stoneGazeActors = new Set(
    resolvedActions.filter(a => a.type === "stone").map(a => a.actor)
  );
  resolvedActions.forEach(a => {
    if (a.resolvedTarget == null) return;
    if (stoneGazeActors.has(a.resolvedTarget)) {
      // The visitor dies
      queueAttack(a.actor, "Medusa");
    }
  });

  // Pirate duels
  resolvedActions.filter(a => a.type === "duel").forEach(a => {
    const pirate = getPlayer(a.actor);
    const opponent = getPlayer(a.resolvedTarget);
    if (!pirate || !opponent || !pirate.alive || !opponent.alive) return;
    if (a.winner === "pirate") {
      pirate.pirateDuelsWon = (pirate.pirateDuelsWon || 0) + 1;
      opponent.alive = false;
      addDeathAnnouncement(opponent, "Pirate Duel", false, "default");
      state.results.push(`${pirate.name} won the Pirate duel.`);
    } else if (a.winner === "opponent") {
      pirate.alive = false;
      addDeathAnnouncement(pirate, "Pirate Duel", false, "default");
      state.results.push(`${pirate.name} lost the Pirate duel.`);
    } else {
      state.results.push("The Pirate duel ended in a tie.");
    }
  });

  // --- STEP 9: Apply kills with protection checks ---
  let jugKills = 0;
  const killResults = [];

  attackMap.forEach((source, targetId) => {
    const target = getPlayer(targetId);
    if (!target || !target.alive) return;

    // Pestilence immune to non-Pestilence attacks
    if (target.role === "Pestilence" && source !== "Pestilence") return;

    // Veteran on Alert kills the attacker instead
    if (alertSet.has(target.id)) {
      const attacker = state.players.find(p => p.alive && (p.role === source || true));
      // Find who actually sent this attack
      let attackerId = null;
      resolvedActions.forEach(ra => {
        if (ra.resolvedTarget != null && Number(ra.resolvedTarget) === targetId) {
          attackerId = ra.actor;
        }
      });
      if (attackerId != null) {
        const atk = getPlayer(attackerId);
        if (atk && atk.alive) {
          atk.alive = false;
          addDeathAnnouncement(atk, "Veteran", false, "default");
          state.results.push(`${atk.name} was killed by Veteran's alert.`);
        }
      }
      return;
    }

    // Protection
    if (protectedSet.has(target.id)) return;

    // Bodyguard
    if (guardedSet.has(target.id)) {
      const bg = state.players.find(p =>
        p.alive && p.role === "Bodyguard" &&
        resolvedActions.some(ra => ra.actor === p.id && ra.type === "guard" && ra.resolvedTarget != null && Number(ra.resolvedTarget) === targetId)
      );
      if (bg) {
        bg.alive = false;
        addDeathAnnouncement(bg, "Bodyguard", false, "default");
        state.results.push(`${bg.name} died protecting ${target.name}.`);
      }
      return; // protected player survives
    }

    // Kill
    target.alive = false;
    killResults.push({ name: target.name, role: target.role, source });
    addDeathAnnouncement(target, source, false, "default");

    if (source === "Juggernaut") jugKills++;
  });

  if (jugKills > 0) {
    state.juggernautKills = (state.juggernautKills || 0) + jugKills;
    state.results.push(`The Juggernaut grows stronger after ${jugKills} kill(s).`);
  }

  killResults.forEach(r => {
    state.results.push(`${r.name} was eliminated by ${r.source}.`);
  });

  // --- STEP 10: Plaguebearer → Pestilence check ---
  const pb = state.players.find(p => p.alive && p.role === "Plaguebearer");
  if (pb) {
    // Plaguebearer itself counts
    state.infectedPlayers.add(pb.id);
    const aliveAll = living();
    if (aliveAll.length > 0 && aliveAll.every(p => state.infectedPlayers.has(p.id))) {
      pb.role = "Pestilence";
      state.infectedPlayers.delete(pb.id);
      state.results.push("The Plaguebearer has become Pestilence!");
    }
  }

  // --- STEP 11: Amnesiac ---
  resolvedActions.filter(a => a.type === "remember").forEach(a => {
    const amne = getPlayer(a.actor);
    const deadP = getPlayer(a.resolvedTarget);
    if (amne && amne.alive && deadP && !deadP.alive && deadP.role && deadP.role !== "Amnesiac") {
      const newRole = deadP.role;
      amne.role = newRole;
      amne.rememberedRole = newRole;
      // Give resources
      if (newRole === "Vigilante") amne.bullets = 2;
      else if (newRole === "Survivor") amne.vests = 4;
      else if (newRole === "Investigator" || newRole === "Consigliere") amne.investigations = 2;
      else if (newRole === "Veteran") amne.alerts = 3;
      else if (newRole === "Janitor") amne.cleans = 3;
      else if (newRole === "Potion Master") amne.potionUses = { heal: 1, attack: 1, reveal: 1 };
      else if (newRole === "Pirate") amne.pirateDuelsWon = 0;
      state.results.push(`${amne.name} remembered the role ${newRole}.`);
    }
  });

  // --- STEP 12: Necromancer ---
  resolvedActions.filter(a => a.type === "necromance").forEach(a => {
    // Placeholder – the necromancer's copied ability would be resolved here.
    // For now, just log it.
    const necro = getPlayer(a.actor);
    const deadP = getPlayer(a.resolvedTarget);
    if (necro && deadP) {
      state.results.push(`${necro.name} used ${deadP.name}'s (${deadP.role}) ability.`);
    }
  });

  // --- STEP 13: Track / Lookout (private dawn reports) ---
  resolvedActions.filter(a => a.type === "track" || a.type === "lookout").forEach(a => {
    const actor = getPlayer(a.actor);
    const tgt = getPlayer(a.resolvedTarget);
    if (!actor || !actor.alive) return;
    if (a.type === "track") {
      const visited = resolvedActions
        .filter(other => other.resolvedTarget != null && Number(other.resolvedTarget) === Number(a.resolvedTarget) && other.actor !== a.actor)
        .map(other => getPlayer(other.actor))
        .filter(Boolean)
        .map(p => p.name);
      const msg = visited.length ? `visited by ${visited.join(", ")}` : "visited no one";
      logAction(a.actor, "track_result", a.resolvedTarget, null, { result: msg });
      queuePrivateNightResult(
        actor.id,
        "Tracker report",
        `👣 ${tgt ? tgt.name : "Target"} was ${msg}.`
      );
    } else {
      const visitors = resolvedActions
        .filter(other => other.resolvedTarget != null && Number(other.resolvedTarget) === Number(a.resolvedTarget) && other.actor !== a.actor)
        .map(other => getPlayer(other.actor))
        .filter(Boolean)
        .map(p => p.name);
      const msg = visitors.length ? visitors.join(", ") : "no one";
      logAction(a.actor, "lookout_result", a.resolvedTarget, null, { result: msg });
      queuePrivateNightResult(
        actor.id,
        "Lookout report",
        `👁️ ${tgt ? tgt.name : "Target"} was visited by ${msg}.`
      );
    }
  });

  // --- STEP 14: Queue private investigation reports after modifiers resolve ---
  resolvedActions
    .filter(a => {
      const actor = getPlayer(a.actor);
      return actor && actor.alive &&
        ["Sheriff", "Investigator", "Consigliere"].includes(actor.role) &&
        a.rawTarget != null;
    })
    .forEach(a => {
      const actor = getPlayer(a.actor);
      const target = getPlayer(a.rawTarget);
      if (!actor || !actor.alive || !target) return;

      if (actor.role === "Sheriff") {
        queuePrivateNightResult(
          actor.id,
          "Sheriff report",
          `🔎 ${target.name} appears ${getSheriffResult(target)}.`
        );
      } else {
        queuePrivateNightResult(
          actor.id,
          actor.role === "Consigliere" ? "Consigliere report" : "Investigator report",
          `🔎 ${target.name} is a ${getInvestigationResult(target)}.`
        );
      }
    });

  // --- STEP 15: Queue private potion reports for the dawn pass ---
  resolvedActions
    .filter(a => a.type === "potion" && a.potion === "reveal")
    .forEach(a => {
      const actor = getPlayer(a.actor);
      const target = getPlayer(a.resolvedTarget);
      if (actor && actor.alive && target) {
        queuePrivateNightResult(
          actor.id,
          "Potion result",
          `🧪 Reveal Potion: ${target.name} is a ${target.role}.`
        );
      }
    });

  beginDawnPass();
}

// ---------- FINISH NIGHT ----------

function publishDeathSummaries() {
  // Replicates mystery-day-patch logic: format death announcements with last words
  state.deathAnnouncements = state.deathAnnouncements || [];
  state.results = state.results || [];
  
  state.deathAnnouncements.forEach(death => {
    if (death.daySummaryPublished) return;
    const player = getPlayer(death.id);
    const role = death.cleaned ? "Unknown (cleaned)" : (death.role || player?.role || "Unknown");
    const words = death.lastWords || `"The game continues without me... play well..."`;
    death.lastWords = words;
    death.daySummaryPublished = true;
    state.results.push(`${death.name} died. Role: ${role}. Last words: ${words}`);
  });
}

function finishNight() {
  renderPlayers();
  
  // Publish death summaries before transitioning to day
  publishDeathSummaries();
  
  state.phase = "day";
  state.dayStarted = true;
  announcePhase();

  if (checkWin()) return;

  // Show day results
  const gameArea = $("gameArea");
  if (!gameArea) return;

  const results = Array.isArray(state.results) ? state.results : [];
  const announcements = Array.isArray(state.deathAnnouncements) ? state.deathAnnouncements : [];

  const resultHTML = results.length
    ? `<ul>${results.map(r => `<li>${escapeHTML(r)}</li>`).join("")}</ul>`
    : "<p>No major events were reported during the Night.</p>";

  const deathHTML = announcements.length
    ? `<h3>Night Deaths</h3><ul>${announcements.map(d => {
        const hidden = d.cleaned === true;
        if (hidden) return "<li>💀 Someone died during the Night, but their identity was hidden.</li>";
        return `<li>💀 ${escapeHTML(d.name || "Unknown player")}${d.role ? ` — ${escapeHTML(d.role)}` : ""}</li>`;
      }).join("")}</ul>`
    : "<p>No one died during the Night.</p>";

  gameArea.innerHTML = `
    <div class="day-action animate-in">
      <h2>☀️ Day ${state.night}</h2>
      <section class="results">
        <h3>Night Results</h3>
        ${resultHTML}
        ${deathHTML}
      </section>
      <button class="primary" id="continueDay">Continue</button>
    </div>
  `;

  $("continueDay").onclick = () => {
    renderDayVote();
  };
}

// ---------- OVERRIDE resolveNight ----------

// Replace the original resolveNight with the new engine
if (typeof resolveNight === "function") {
  window._originalResolveNight = resolveNight;
}

window.resolveNight = function() {
  // Clean up any lingering state
  state.results = state.results || [];

  // Check pirate victory before resolution
  const pirate = state.players.find(p => p.alive && p.role === "Pirate" && (p.pirateDuelsWon || 0) >= 2);
  if (pirate) {
    endGame(`🏴‍☠️ ${pirate.name} wins by winning 2 Pirate duels!`);
    return;
  }

  resolveNightActions();
};