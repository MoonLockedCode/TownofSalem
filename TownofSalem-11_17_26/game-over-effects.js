(() => {
  let gameEnded = false;

  const TEAM_STYLES = {
    town: {
      title: "Town Victory",
      colors: ["#6f9f45", "#a8c878", "#d8c58a", "#405c2b"],
      symbols: ["🍂", "🌿", "✦", "🕯️"],
      className: "winner-town",
      particleClass: "town-particle"
    },
    mafia: {
      title: "Mafia Victory",
      colors: ["#8f1d14", "#b33a2b", "#d2763d", "#3a1714"],
      symbols: ["🔥", "🩸", "⚔️", "☠"],
      className: "winner-mafia",
      particleClass: "mafia-particle"
    },
    coven: {
      title: "Coven Victory",
      colors: ["#6f3b8f", "#9b65bd", "#c19bd8", "#321b4a"],
      symbols: ["☽", "✧", "ᛉ", "🔮"],
      className: "winner-coven",
      particleClass: "coven-particle"
    },
    jester: {
      title: "Jester Victory",
      colors: ["#9a3f72", "#d08b35", "#3e648c", "#d7c37a"],
      symbols: ["♠", "♦", "♣", "♥", "🃏"],
      className: "winner-jester",
      particleClass: "jester-particle"
    },
    executioner: {
      title: "Executioner Victory",
      colors: ["#8d2723", "#b84235", "#575757", "#b8b09b"],
      symbols: ["⚔", "⛓", "✦", "🪓"],
      className: "winner-executioner",
      particleClass: "executioner-particle"
    },
    arsonist: {
      title: "Arsonist Victory",
      colors: ["#ff4500", "#ff8c00", "#ffd700", "#3a1200"],
      symbols: ["🔥", "💥", "🛢️", "⚡"],
      className: "winner-arsonist",
      particleClass: "arsonist-particle"
    },
    serialKiller: {
      title: "Serial Killer Victory",
      colors: ["#3b0000", "#8b0000", "#ff0000", "#1a0000"],
      symbols: ["🔪", "🩸", "💀", "🩸"],
      className: "winner-sk",
      particleClass: "sk-particle"
    },
    neutral: {
      title: "Neutral Victory",
      colors: ["#f8f9fa", "#9ea7ad", "#0b0c10", "#ffffff"],
      symbols: ["⚜", "♟", "♞", "⚖", "🕊"],
      className: "winner-neutral",
      particleClass: "neutral-particle"
    }
  };

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character]));
  }

  function getWinnerTheme(message) {
    const text = String(message || "").toLowerCase();

    if (text.includes("coven")) return "coven";
    if (text.includes("mafia")) return "mafia";
    if (text.includes("town")) return "town";
    if (text.includes("jester")) return "jester";
    if (text.includes("executioner")) return "executioner";
    if (text.includes("arsonist")) return "arsonist";
    if (text.includes("serial killer")) return "serialKiller";

    // Generic neutral keywords
    if (
      text.includes("werewolf") ||
      text.includes("pestilence") ||
      text.includes("witch") ||
      text.includes("vampire") ||
      text.includes("plaguebearer") ||
      text.includes("juggernaut") ||
      text.includes("neutral")
    ) {
      return "neutral";
    }

    const winner = state.players.find(player =>
      text.includes(player.name.toLowerCase())
    );

    if (winner?.role === "Arsonist") return "arsonist";
    if (winner?.role === "Serial Killer") return "serialKiller";  
    if (winner?.role === "Jester") return "jester";
    if (winner?.role === "Executioner") return "executioner";
    if (winner && factionOf(winner) === "Town") return "town";
    if (winner && factionOf(winner) === "Mafia") return "mafia";
    if (winner && factionOf(winner) === "Coven") return "coven";

    return "neutral";
  }

  function getWinners(theme, message) {
    const text = String(message || "").toLowerCase();

    const namedWinners = state.players.filter(player =>
      text.includes(player.name.toLowerCase())
    );

    if (namedWinners.length) return namedWinners;

    if (theme === "jester") {
      return state.players.filter(player => player.role === "Jester");
    }

    if (theme === "executioner") {
      return state.players.filter(player => player.role === "Executioner");
    }

    if (theme === "town") {
      return state.players.filter(player => factionOf(player) === "Town");
    }

    if (theme === "mafia") {
      return state.players.filter(player => factionOf(player) === "Mafia");
    }

    if (theme === "coven") {
      return state.players.filter(player => factionOf(player) === "Coven");
    }

    if (theme === "arsonist") {
      return state.players.filter(player => player.role === "Arsonist");
    }

    if (theme === "serialKiller") {
      return state.players.filter(player => player.role === "Serial Killer");
    }

    if (theme === "neutral") {
      const neutralPlayers = state.players.filter(player => 
        player.alive && 
        !["Town", "Mafia", "Coven"].includes(factionOf(player))
      );
      if (neutralPlayers.length) return neutralPlayers;
    }

    return state.players.filter(player => player.alive);
  }

  function addEffects(theme) {
    const style = TEAM_STYLES[theme];

    for (let index = 0; index < 100; index++) {
      const particle = document.createElement("span");
      const color = style.colors[index % style.colors.length];

      particle.className = `winner-particle ${style.particleClass}`;
      particle.textContent = style.symbols[index % style.symbols.length];

      particle.style.color = color;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 2.5}s`;
      particle.style.animationDuration = `${3 + Math.random() * 4}s`;

      particle.style.setProperty(
        "--drift",
        `${-160 + Math.random() * 320}px`
      );

      particle.style.fontSize = `${14 + Math.random() * 24}px`;

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 8500);
    }

    for (let index = 0; index < 18; index++) {
      const sigil = document.createElement("span");

      sigil.className = `medieval-sigil ${style.particleClass}`;
      sigil.textContent = style.symbols[index % style.symbols.length];

      sigil.style.color = style.colors[index % style.colors.length];

      sigil.style.left = `${5 + Math.random() * 90}%`;
      sigil.style.top = `${5 + Math.random() * 90}%`;
      sigil.style.animationDelay = `${Math.random() * 2}s`;

      document.body.appendChild(sigil);

      setTimeout(() => sigil.remove(), 6500);
    }
  }

  function showGameOver(message) {
    if (gameEnded) return;

    gameEnded = true;

    const theme = getWinnerTheme(message);
    const style = TEAM_STYLES[theme];
    const winners = getWinners(theme, message);

    const winnerHTML = winners.length
      ? winners.map(player => `
          <div class="winner-player">
            <strong>${escapeHTML(player.name)}</strong>
            <span>${escapeHTML(player.role)}</span>
          </div>
        `).join("")
      : `
        <div class="winner-player">
          <strong>Victory!</strong>
          <span>${escapeHTML(style.title)}</span>
        </div>
      `;

    const overlay = document.createElement("div");

    overlay.id = "winnerOverlay";
    overlay.className = `winner-overlay ${style.className}`;

    overlay.innerHTML = `
      <div class="medieval-moon"></div>
      <div class="winner-glow"></div>

      <div class="winner-card">
        <div class="banner-rope"></div>
        <div class="winner-icon">♜</div>

        <p class="winner-kicker">
          THEIR FATE IS SEALED
        </p>

        <h1>${escapeHTML(style.title)}</h1>

        <p class="winner-message">
          ${escapeHTML(message || "The game has ended.")}
        </p>

        <div class="wax-seal">✦</div>

        <h2>Victorious Players</h2>

        <div class="winner-list">
          ${winnerHTML}
        </div>

        <button
          class="primary winner-restart"
          id="playAgainButton">
          Begin a New Game
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("winner-screen");

    addEffects(theme);

    document.getElementById("playAgainButton").onclick = () => {
      window.location.reload();
    };
  }

  function addWinnerStyles() {
    if (document.getElementById("winner-effects-style")) return;

    const style = document.createElement("style");

    style.id = "winner-effects-style";

    style.textContent = `
      .winner-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        overflow: hidden;
        color: #ead9ad;
        background:
          radial-gradient(circle at 50% 35%,
            rgba(120, 94, 47, 0.2),
            transparent 34%),
          repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.018) 0px,
            rgba(255,255,255,0.018) 1px,
            transparent 1px,
            transparent 5px
          ),
          #17120e;
        animation: medievalFadeIn 1s ease forwards;
      }

      .winner-overlay::before,
      .winner-overlay::after {
        content: "";
        position: absolute;
        inset: 18px;
        pointer-events: none;
        border: 5px double currentColor;
        opacity: 0.45;
      }

      .winner-overlay::after {
        inset: 34px;
        border: 1px solid currentColor;
        opacity: 0.25;
      }

      .winner-card {
        position: relative;
        z-index: 3;
        width: min(92vw, 650px);
        max-height: 88vh;
        overflow-y: auto;
        padding: 38px 30px;
        text-align: center;
        color: #ead9ad;
        border: 4px double currentColor;
        background:
          linear-gradient(
            rgba(47, 31, 19, 0.94),
            rgba(25, 17, 12, 0.97)
          );
        box-shadow:
          0 0 0 10px rgba(40, 24, 13, 0.8),
          0 0 0 13px rgba(187, 148, 73, 0.35),
          0 0 55px currentColor;
        animation: medievalRise 1s ease forwards;
      }

      .winner-card::before,
      .winner-card::after {
        content: "✦";
        position: absolute;
        top: 12px;
        font-size: 28px;
        color: currentColor;
      }

      .winner-card::before { left: 18px; }
      .winner-card::after { right: 18px; }

      .winner-town { color: #b7d38a; }
      .winner-mafia { color: #d05b45; }
      .winner-coven { color: #bd8bd8; }
      .winner-jester { color: #d4a35d; }
      .winner-executioner { color: #c8c0ae; }
      .winner-arsonist { color: #ff6a00; }
      .winner-sk { color: #cc0000; }
      .winner-neutral { color: #d7b969; }

      .winner-icon {
        font-size: 64px;
        color: #d4b56b;
        text-shadow: 0 0 15px currentColor;
        animation: heraldicSway 2.4s ease-in-out infinite;
      }

      .winner-kicker {
        margin: 8px 0;
        color: #bda16b;
        font-family: Georgia, serif;
        font-size: 0.8rem;
        letter-spacing: 4px;
      }

      .winner-card h1 {
        margin: 8px 0 16px;
        color: currentColor;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(2.2rem, 8vw, 4.2rem);
        font-variant: small-caps;
        text-shadow: 2px 3px #26150d, 0 0 16px currentColor;
      }

      .winner-message {
        color: #e3d5b4;
        font-family: Georgia, serif;
        font-style: italic;
        font-size: 1.05rem;
      }

      .wax-seal {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        margin: 22px auto 8px;
        border-radius: 50%;
        color: #f0c67a;
        background: #7b211d;
        border: 3px solid #bd754f;
        box-shadow: inset 0 0 0 3px #591817, 0 4px 8px #000;
        font-size: 24px;
      }

      .winner-card h2 {
        margin: 20px 0 12px;
        color: #d7bd83;
        font-family: Georgia, serif;
        font-variant: small-caps;
      }

      .winner-list {
        display: grid;
        gap: 10px;
        margin-bottom: 26px;
      }

      .winner-player {
        display: flex;
        justify-content: space-between;
        gap: 18px;
        padding: 12px 16px;
        color: #ead9ad;
        border: 1px solid #9d7b45;
        background: rgba(12, 8, 5, 0.55);
        box-shadow: inset 0 0 15px rgba(0,0,0,0.35);
        font-family: Georgia, serif;
      }

      .winner-player strong { color: #f0d28b; }
      .winner-player span { color: #c5b796; font-style: italic; }

      .winner-restart {
        min-width: 210px;
        color: #24170e;
        border: 2px solid #d6b66d;
        background: #b8904c;
        box-shadow: inset 0 0 0 2px #694c26, 0 4px 0 #4a3018;
        font-family: Georgia, serif;
        font-variant: small-caps;
        font-size: 1.1rem;
      }

      .winner-particle {
        position: fixed;
        top: -55px;
        z-index: 10001;
        pointer-events: none;
        font-family: Georgia, serif;
        filter: drop-shadow(0 0 7px currentColor);
      }

      .town-particle { animation: leafFall linear forwards; }
      .mafia-particle { animation: emberRise linear forwards; }
      .coven-particle { animation: runeDrift linear forwards; }
      .jester-particle { animation: jesterTumble linear forwards; }
      .executioner-particle { animation: ironSpark linear forwards; }
      .arsonist-particle { animation: emberRise linear forwards; }
      .sk-particle { animation: leafFall linear forwards; }
      .neutral-particle { animation: relicFall linear forwards; }

      .medieval-sigil {
        position: fixed;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        font-family: Georgia, serif;
        font-size: 32px;
        text-shadow: 0 0 14px currentColor;
        animation: sigilAppear 6s ease-in-out forwards;
      }

      .winner-glow {
        position: absolute;
        inset: 20%;
        border-radius: 50%;
        background: currentColor;
        opacity: 0.12;
        filter: blur(90px);
        animation: candlePulse 3s ease-in-out infinite;
      }

      .medieval-moon {
        position: absolute;
        top: 8%;
        right: 10%;
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background: #d9c58c;
        box-shadow: 0 0 35px #d9c58c;
        opacity: 0.25;
      }

      @keyframes medievalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes medievalRise {
        from {
          opacity: 0;
          transform: translateY(50px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes heraldicSway {
        0%, 100% { transform: rotate(-5deg) translateY(0); }
        50% { transform: rotate(5deg) translateY(-8px); }
      }

      @keyframes candlePulse {
        0%, 100% { opacity: 0.08; transform: scale(0.85); }
        50% { opacity: 0.2; transform: scale(1.15); }
      }

      @keyframes leafFall {
        0% { transform: translate3d(0, -40px, 0) rotate(0deg); opacity: 0; }
        12% { opacity: 1; }
        100% { transform: translate3d(var(--drift), 110vh, 0) rotate(560deg); opacity: 0; }
      }

      @keyframes emberRise {
        0% { transform: translate3d(0, 105vh, 0) scale(0.6); opacity: 0; }
        15% { opacity: 1; }
        100% { transform: translate3d(var(--drift), -20vh, 0) scale(1.2); opacity: 0; }
      }

      @keyframes runeDrift {
        0% { transform: translate3d(0, 100vh, 0) rotate(0deg) scale(0.6); opacity: 0; }
        20% { opacity: 1; }
        100% { transform: translate3d(var(--drift), -20vh, 0) rotate(360deg) scale(1.4); opacity: 0; }
      }

      @keyframes jesterTumble {
        0% { transform: translate3d(0, -40px, 0) rotate(0deg); opacity: 0; }
        12% { opacity: 1; }
        100% { transform: translate3d(var(--drift), 110vh, 0) rotate(1080deg); opacity: 0; }
      }

      @keyframes ironSpark {
        0% { transform: translate3d(0, 100vh, 0) rotate(0deg); opacity: 0; }
        15% { opacity: 1; }
        100% { transform: translate3d(var(--drift), 35vh, 0) rotate(720deg); opacity: 0; }
      }

      @keyframes relicFall {
        0% { transform: translate3d(0, -40px, 0) rotate(0deg); opacity: 0; }
        15% { opacity: 1; }
        100% { transform: translate3d(var(--drift), 110vh, 0) rotate(480deg); opacity: 0; }
      }

      @keyframes sigilAppear {
        0%, 100% { opacity: 0; transform: scale(0.5) rotate(-20deg); }
        35%, 65% { opacity: 0.7; transform: scale(1.2) rotate(20deg); }
      }

      @media (max-width: 520px) {
        .winner-player { flex-direction: column; gap: 4px; }
        .winner-card { padding: 32px 20px; }
        .medieval-moon { width: 60px; height: 60px; }
      }
      button, 
      #addPlayerButton, 
      #balanceButton, 
      .add-player, 
      .balance-btn {
        color: #ead9ad !important;
        background: #2a1a10 !important;
        border: 2px solid #9d7b45 !important;
        padding: 8px 16px;
        font-family: Georgia, serif;
        font-size: 0.95rem;
        cursor: pointer;
        border-radius: 4px;
        box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.6);
        transition: background 0.2s ease, border-color 0.2s ease;
      }

      button:hover,
      #addPlayerButton:hover,
      #balanceButton:hover,
      .add-player:hover,
      .balance-btn:hover {
        background: #3e2718 !important;
        border-color: #d6b66d !important;
        color: #ffffff !important;
      }
      /* ========================================== */

      @media (max-width: 520px) { ... }
  
    `;
    

    document.head.appendChild(style);
  }

  addWinnerStyles();

  const originalEndGame = window.endGame;

  if (typeof originalEndGame === "function") {
    window.endGame = function(message) {
      originalEndGame.apply(this, arguments);
      showGameOver(message);
    };
  } else {
    const originalSetTimeout = window.setTimeout;

    window.setTimeout = function(callback, delay, ...args) {
      if (
        typeof callback === "function" &&
        callback.name === "endGame"
      ) {
        return originalSetTimeout(() => {
          callback(...args);
          showGameOver(args[0]);
        }, delay);
      }

      return originalSetTimeout(callback, delay, ...args);
    };
  }

})();