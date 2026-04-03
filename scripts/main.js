/**
 * Kult Tarot Reader — Module Initialization
 * System: k4lt (KULT: Divinity Lost 4th Edition by YanKlInnomme)
 * Hosted at: kult.moltenhosting.com (Foundry v13 build 351)
 */

Hooks.once("init", () => {
  console.log("Kult Tarot Reader | Initializing...");

  // ── Settings ───────────────────────────────────────────────────
  game.settings.register("kult-tarot-reader", "preferredModule", {
    name: "Preferred Tarot Module",
    hint: "Which k4lt module holds the Tarot card compendium. Usually k4lt-en (English) or k4lt-fr (French). The module will try all known options automatically.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "k4lt-en": "k4lt-en (English)",
      "k4lt-fr": "k4lt-fr (French)",
      "k4lt-assets": "k4lt-assets",
    },
    default: "k4lt-en",
  });

  game.settings.register("kult-tarot-reader", "allowPlayerDraw", {
    name: "Allow Players to Draw Cards",
    hint: "If enabled, players (not just GMs) can open the Tarot reading dialog.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  // ── Keybinding: Alt+T ──────────────────────────────────────────
  game.keybindings.register("kult-tarot-reader", "openTarot", {
    name: "Open Kult Tarot Reader",
    hint: "Opens the Kult Tarot reading selection dialog.",
    editable: [{ key: "KeyT", modifiers: ["Alt"] }],
    onDown: () => {
      const allowed = game.user.isGM ||
        game.settings.get("kult-tarot-reader", "allowPlayerDraw");
      if (allowed) KultTarot.Reader.openSelector();
    },
    restricted: false,
    precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
  });
});

Hooks.once("ready", () => {
  // Bump preferred source to the front of the search list
  const preferred = game.settings.get("kult-tarot-reader", "preferredModule");
  const sources   = KultTarot.TAROT_SOURCES;
  const idx       = sources.findIndex(s => s.moduleId === preferred);
  if (idx > 0) {
    const [entry] = sources.splice(idx, 1);
    sources.unshift(entry);
  }

  console.log(
    `Kult Tarot Reader | Ready. ` +
    `Preferred source: ${preferred}. ` +
    `Use KultTarot.Reader.openSelector() or press Alt+T.`
  );

  // ── Sidebar button in Cards tab (GM only) ──────────────────────
  if (game.user.isGM) {
    Hooks.on("renderSidebarTab", (app, html) => {
      if (app.tabName !== "cards") return;
      if (html.find(".kult-tarot-sidebar-btn").length) return;
      const btn = $(
        `<button class="kult-tarot-sidebar-btn" title="Open Kult Tarot Reader">
           <i class="fas fa-book-dead"></i> Kult Tarot Reading
         </button>`
      );
      btn.on("click", () => KultTarot.Reader.openSelector());
      html.find(".directory-header .action-buttons").append(btn);
    });
  }
});

// ── Chat command: /tarot [type] ────────────────────────────────────
Hooks.on("chatMessage", (_chatLog, message) => {
  const cmd = message.trim().toLowerCase();
  if (!cmd.startsWith("/tarot")) return true; // let other handlers run

  const allowed = game.user.isGM ||
    game.settings.get("kult-tarot-reader", "allowPlayerDraw");
  if (!allowed) {
    ui.notifications.warn("The Kult Tarot is reserved for the Gamemaster.");
    return false;
  }

  const parts = message.trim().split(/\s+/);
  const type  = parts[1]?.toLowerCase();
  if (type && KultTarot.TEMPLATES[type]) {
    KultTarot.Reader.performReading(type, "", true);
  } else {
    KultTarot.Reader.openSelector();
  }
  return false; // suppress the raw message
});

/**
 * Public macro API:
 *   KultTarot.Reader.openSelector();
 *   KultTarot.Reader.performReading("individual", "Who is this stranger?", true);
 *
 * Valid types: individual | location | cult | plot | creature | artifact | single
 */
