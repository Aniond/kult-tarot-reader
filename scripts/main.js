/**
 * Kult Tarot Reader — Module Initialization  v1.01
 * System: k4lt (KULT: Divinity Lost 4th Edition by YanKlInnomme)
 * Foundry v13 build 351
 *
 * ── CHAT COMMANDS ──────────────────────────────────────────────
 *  /tarot                open the reading selector dialog
 *  /tarot individual     draw an Individual reading (posts to chat)
 *  /tarot location       draw a Location reading
 *  /tarot cult           draw a Cult reading
 *  /tarot plot           draw a Plot reading
 *  /tarot creature       draw a Creature reading
 *  /tarot artifact       draw an Artifact reading
 *  /tarot single         draw a Single Card reading
 *  /tarot help           show this command list in chat
 * ───────────────────────────────────────────────────────────────
 */

// ── INIT hook: settings + keybindings ONLY ────────────────────
// Keybindings MUST be registered here, not in ready.
Hooks.once("init", () => {
  console.log("Kult Tarot Reader | v1.01 Initializing...");

  // Settings
  game.settings.register("kult-tarot-reader", "preferredModule", {
    name: "Preferred Tarot Module",
    hint: "Which k4lt module holds the Tarot card compendium. k4lt-en is standard for English installs.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      "k4lt-en":     "k4lt-en (English)",
      "k4lt-fr":     "k4lt-fr (French)",
      "k4lt-assets": "k4lt-assets",
    },
    default: "k4lt-en",
  });

  game.settings.register("kult-tarot-reader", "allowPlayerDraw", {
    name: "Allow Players to Use /tarot",
    hint: "If enabled, players (not just GMs) can use the /tarot chat command.",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
  });

  // Keybinding — MUST be registered in init, never in ready
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

  console.log("Kult Tarot Reader | Settings and keybindings registered.");
});

// ── READY hook: UI setup only, no keybindings ─────────────────
Hooks.once("ready", () => {
  // Move preferred source to front of the lookup list
  const preferred = game.settings.get("kult-tarot-reader", "preferredModule");
  const sources   = KultTarot.TAROT_SOURCES;
  const idx       = sources.findIndex(s => s.moduleId === preferred);
  if (idx > 0) {
    const [entry] = sources.splice(idx, 1);
    sources.unshift(entry);
  }

  console.log(
    `Kult Tarot Reader | v1.01 Ready. ` +
    `Preferred source: ${preferred}. ` +
    `Type /tarot in chat, press Alt+T, or call KultTarot.Reader.openSelector().`
  );

  if (game.user.isGM) {
    ui.notifications.info("Kult Tarot Reader ready — type /tarot in chat to begin.");
  }

  // Sidebar button in Cards tab (GM only)
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

// ─────────────────────────────────────────────────────────────────
// CHAT COMMAND HANDLER  — /tarot [type]
// ─────────────────────────────────────────────────────────────────
Hooks.on("chatMessage", (_chatLog, message, _chatData) => {
  const trimmed = message.trim();
  if (!trimmed.toLowerCase().startsWith("/tarot")) return true;

  const allowed = game.user.isGM ||
    game.settings.get("kult-tarot-reader", "allowPlayerDraw");

  if (!allowed) {
    ui.notifications.warn("The Kult Tarot is reserved for the Gamemaster.");
    return false;
  }

  const parts    = trimmed.split(/\s+/);
  const subCmd   = (parts[1] ?? "").toLowerCase();
  const validTypes = Object.keys(KultTarot.TEMPLATES);

  // /tarot help
  if (subCmd === "help") {
    const helpLines = validTypes.map(t =>
      `<li><code>/tarot ${t}</code> — ${KultTarot.TEMPLATES[t].description}</li>`
    ).join("");
    ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ alias: "Kult Tarot" }),
      content: `
        <div class="kult-chat-reading">
          <h3 style="color:#8B0000;border-bottom:1px solid #8B0000;">
            🃏 Kult Tarot — Chat Commands
          </h3>
          <ul style="padding-left:1.2em;line-height:1.8;font-family:monospace;font-size:0.9em;">
            <li><code>/tarot</code> — open the reading selector dialog</li>
            ${helpLines}
            <li><code>/tarot help</code> — show this message</li>
          </ul>
        </div>`,
    });
    return false;
  }

  // /tarot [type]
  if (subCmd && validTypes.includes(subCmd)) {
    KultTarot.Reader.performReading(subCmd, "", true);
    return false;
  }

  // /tarot — open selector
  KultTarot.Reader.openSelector();
  return false;
});

/**
 * ── MACRO API ───────────────────────────────────────────────────
 *   KultTarot.Reader.openSelector();
 *   KultTarot.Reader.performReading("individual", "Who is this stranger?", true);
 *   KultTarot.Reader.performReading("plot", "", false);
 *   KultTarot.Reader.performReading("single", "What is hidden here?", true);
 *
 * Valid types:
 *   individual | location | cult | plot | creature | artifact | single
 */
