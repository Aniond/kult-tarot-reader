/**
 * Kult Tarot Reader - Core Application  v1.01
 *
 * Foundry v13 moved Application and Dialog to foundry.appv1.
 * This file uses foundry.appv1.applications.Dialog and
 * foundry.appv1.applications.Application (with _renderHTML override).
 *
 * Chat commands:
 *   /tarot                — opens the reading selector dialog
 *   /tarot individual     — draws an Individual reading immediately
 *   /tarot location
 *   /tarot cult
 *   /tarot plot
 *   /tarot creature
 *   /tarot artifact
 *   /tarot single
 */

// ── Resolve correct Application / Dialog base classes for v13 ────
const _Application = foundry?.appv1?.applications?.Application ?? Application;
const _Dialog      = foundry?.appv1?.applications?.Dialog      ?? Dialog;

// ── Fisher-Yates shuffle ─────────────────────────────────────────
function shuffleDeck(deck) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Build name→img map from the tarot compendium ─────────────────
async function buildCardImageMap() {
  if (KultTarot._imageMap) return KultTarot._imageMap;
  const map = {};

  for (const { moduleId, packName } of KultTarot.TAROT_SOURCES) {
    const packKey = `${moduleId}.${packName}`;
    const pack    = game.packs.get(packKey);
    if (!pack) continue;

    try {
      const index = await pack.getIndex();
      for (const entry of index) {
        const doc = await pack.getDocument(entry._id);
        if (!doc) continue;
        if (doc.cards?.size > 0) {
          for (const card of doc.cards) {
            const img = card.faces?.[0]?.img ?? card.img;
            if (img) map[card.name?.toLowerCase()] = img;
          }
        } else {
          const img = doc.faces?.[0]?.img ?? doc.img;
          if (img) map[doc.name?.toLowerCase()] = img;
        }
      }
    } catch (err) {
      console.warn(`Kult Tarot Reader | Could not read pack ${packKey}:`, err);
    }

    if (Object.keys(map).length > 0) break;
  }

  // Fallback: world Cards stacks
  if (Object.keys(map).length === 0) {
    const stack = game.cards?.find(c =>
      c.name?.toLowerCase().includes("kult") ||
      c.name?.toLowerCase().includes("tarot")
    );
    if (stack) {
      for (const card of stack.cards ?? []) {
        const img = card.faces?.[0]?.img ?? card.img;
        if (img) map[card.name?.toLowerCase()] = img;
      }
    }
  }

  KultTarot._imageMap = map;
  console.log(`Kult Tarot Reader | Card image map: ${Object.keys(map).length} entries found.`);
  return map;
}

async function resolveCardImage(card) {
  const map = await buildCardImageMap();
  return (
    map[card.name.toLowerCase()] ??
    Object.entries(map).find(([k]) => k.includes(card.name.toLowerCase()))?.[1] ??
    card.img
  );
}

// ─────────────────────────────────────────────────────────────────
// SELECTOR DIALOG
// ─────────────────────────────────────────────────────────────────
class KultTarotSelectorDialog extends _Dialog {
  constructor() {
    const options = Object.entries(KultTarot.TEMPLATES)
      .map(([key, tmpl]) => `
        <div class="kult-reading-option">
          <input type="radio" id="reading-${key}" name="readingType"
                 value="${key}" ${key === "individual" ? "checked" : ""}>
          <label for="reading-${key}">
            <strong>${tmpl.name}</strong>
            <span class="kult-reading-desc">${tmpl.description}</span>
          </label>
        </div>`)
      .join("");

    super({
      title: "Kult Tarot — Begin Reading",
      content: `
        <div class="kult-tarot-selector">
          <div class="kult-tarot-header">
            <h2>Kult Tarot Reading</h2>
            <p>Select the type of reading you wish to perform.</p>
          </div>
          <div class="kult-reading-options">${options}</div>
          <div class="kult-question-box">
            <label for="kult-question"><strong>Your Question (optional):</strong></label>
            <textarea id="kult-question"
              placeholder="Focus your mind. What do you seek to know?" rows="2"></textarea>
          </div>
          <div class="kult-post-to-chat">
            <input type="checkbox" id="kult-post-chat" checked>
            <label for="kult-post-chat">Post reading summary to chat</label>
          </div>
        </div>`,
      buttons: {
        draw: {
          icon:  '<i class="fas fa-hat-wizard"></i>',
          label: "Draw Cards",
          callback: (html) => {
            const type     = html.find('input[name="readingType"]:checked').val();
            const question = html.find("#kult-question").val().trim();
            const postChat = html.find("#kult-post-chat").is(":checked");
            KultTarotReader.performReading(type, question, postChat);
          }
        },
        cancel: { icon: '<i class="fas fa-times"></i>', label: "Cancel" }
      },
      default: "draw",
    });
  }
}

// ─────────────────────────────────────────────────────────────────
// READING APPLICATION
// ─────────────────────────────────────────────────────────────────
class KultTarotReadingApp extends _Application {
  constructor(readingType, drawnCards, question, postToChat) {
    super({
      title:     "Kult Tarot — Reading",
      id:        "kult-tarot-reading",
      width:     920,
      height:    "auto",
      resizable: true,
      classes:   ["kult-tarot-reading-window"],
    });
    this.readingType   = readingType;
    this.drawnCards    = drawnCards;
    this.question      = question;
    this.postToChat    = postToChat;
    this.tmpl          = KultTarot.TEMPLATES[readingType];
    this.flipped       = new Set();
    this._resolvedImgs = null;
  }

  async _buildContent() {
    if (!this._resolvedImgs) {
      this._resolvedImgs = await Promise.all(
        this.drawnCards.map(({ card }) => resolveCardImage(card))
      );
    }

    const isSingle = this.readingType === "single";
    const cards = this.drawnCards.map(({ card, position }, i) => ({
      card, position,
      img:      this._resolvedImgs[i],
      revealed: this.flipped.has(position.slot),
    }));

    // ── Individual card HTML (front + back) ──────────────────────
    const cardHTML = ({ card, position, img, revealed }) => `
      <div class="kult-card-slot ${revealed ? "revealed" : "face-down"}"
           data-slot="${position.slot}"
           title="${revealed ? card.name : "Click to reveal: " + position.label}">
        <div class="kult-card-inner">
          <div class="kult-card-front">
            <img src="${img}" alt="${card.name}"
                 onerror="this.src='icons/svg/card-hand.svg'">
            <div class="kult-card-info">
              <div class="kult-card-position">${position.label}</div>
              <div class="kult-card-name">
                ${card.suit !== "Major Arcana" ? card.suit + " · " : ""}${card.name}
              </div>
              <div class="kult-card-meaning">${card.meaning}</div>
            </div>
          </div>
          <div class="kult-card-back">
            <div class="kult-back-symbol">✦</div>
            <div class="kult-card-position-label">${position.label}</div>
          </div>
        </div>
      </div>`;

    // ── Star / single layout ──────────────────────────────────────
    const layoutHTML = isSingle
      ? `<div class="kult-layout kult-layout-single">${cardHTML(cards[0])}</div>`
      : `<div class="kult-layout kult-layout-star">
           <div class="kult-star-top">${cardHTML(cards[2])}</div>
           <div class="kult-star-left">${cardHTML(cards[1])}</div>
           <div class="kult-star-center">${cardHTML(cards[0])}</div>
           <div class="kult-star-right">${cardHTML(cards[3])}</div>
           <div class="kult-star-bottom">${cardHTML(cards[4])}</div>
         </div>`;

    // ── GM Interpretation table ───────────────────────────────────
    // One row per card: slot number | position label | rule question |
    // card drawn | suit | card meaning
    const tableRows = cards.map(({ card, position, revealed }) => `
      <tr class="kult-interp-row ${revealed ? "is-revealed" : "is-hidden"}"
          data-slot="${position.slot}">
        <td class="kult-interp-num">${position.slot}</td>
        <td class="kult-interp-label">${position.label}</td>
        <td class="kult-interp-question">${position.description}</td>
        <td class="kult-interp-card">
          ${revealed
            ? `<strong>${card.name}</strong><br>
               <span class="kult-interp-suit">${card.suit}</span>`
            : `<span class="kult-interp-hidden">— face down —</span>`}
        </td>
        <td class="kult-interp-meaning">
          ${revealed ? card.meaning : ""}
        </td>
      </tr>`).join("");

    return `
      <div class="kult-tarot-reading">
        <div class="kult-reading-header">
          <h2>${this.tmpl.name} Reading</h2>
          ${this.question
            ? `<blockquote class="kult-question">"${this.question}"</blockquote>`
            : ""}
          <div class="kult-reading-controls">
            <button class="kult-btn kult-reveal-all">
              <i class="fas fa-eye"></i> Reveal All
            </button>
            <button class="kult-btn kult-post-chat-btn">
              <i class="fas fa-comment"></i> Post to Chat
            </button>
            <button class="kult-btn kult-new-reading-btn">
              <i class="fas fa-redo"></i> New Reading
            </button>
          </div>
        </div>

        ${layoutHTML}

        <div class="kult-interp-section">
          <h3 class="kult-interp-heading">
            <i class="fas fa-scroll"></i> Card Interpretations
          </h3>
          <table class="kult-interp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Position</th>
                <th>The Question (per the Rules)</th>
                <th>Card Drawn</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody class="kult-interp-tbody">
              ${tableRows}
            </tbody>
          </table>
        </div>

        <div class="kult-reading-notes">
          <label><strong>GM Notes:</strong></label>
          <textarea class="kult-notes-area"
            placeholder="Write your interpretation here..."></textarea>
        </div>
      </div>`;
  }

    // v13 appv1 render hook
  async _renderHTML(_context, _options) {
    const content = await this._buildContent();
    const div = document.createElement("div");
    div.innerHTML = content;
    return div;
  }

  // Legacy Application fallback
  async _renderInner(_data) {
    const content = await this._buildContent();
    return $(content);
  }

  // Update a single table row once its card is revealed
  _revealTableRow(html, slot) {
    const entry = this.drawnCards.find(({ position }) => position.slot === slot);
    if (!entry) return;
    const { card, position } = entry;
    const row = html.find(`.kult-interp-row[data-slot="${slot}"]`);
    row.removeClass("is-hidden").addClass("is-revealed");
    row.find(".kult-interp-card").html(
      `<strong>${card.name}</strong><br>
       <span class="kult-interp-suit">${card.suit}</span>`
    );
    row.find(".kult-interp-meaning").text(card.meaning);
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".kult-card-slot.face-down").on("click", (ev) => {
      const slot = parseInt(ev.currentTarget.dataset.slot);
      this.flipped.add(slot);
      $(ev.currentTarget).removeClass("face-down").addClass("revealed");
      this._revealTableRow(html, slot);
    });

    html.find(".kult-reveal-all").on("click", () => {
      this.drawnCards.forEach(({ position }) => {
        this.flipped.add(position.slot);
        this._revealTableRow(html, position.slot);
      });
      html.find(".kult-card-slot").removeClass("face-down").addClass("revealed");
    });

    html.find(".kult-post-chat-btn").on("click", () => this._postToChat());

    html.find(".kult-new-reading-btn").on("click", () => {
      this.close();
      new KultTarotSelectorDialog().render(true);
    });
  }

  async _postToChat() {
    const lines = this.drawnCards.map(({ card, position }) =>
      `<li><strong>${position.label}:</strong> <em>${card.name}</em>
       (${card.suit}) — ${card.meaning}</li>`
    ).join("");

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ alias: "Kult Tarot" }),
      content: `
        <div class="kult-chat-reading">
          <h3 style="color:#8B0000;border-bottom:1px solid #8B0000;">
            🃏 ${this.tmpl.name} Reading
          </h3>
          ${this.question ? `<p><em>"${this.question}"</em></p>` : ""}
          <ul style="padding-left:1.2em;line-height:1.7">${lines}</ul>
        </div>`,
      flags: { "kult-tarot-reader": { isReading: true } }
    });
  }

  async render(force, options) {
    const result = await super.render(force, options);
    if (this.postToChat) {
      this.postToChat = false; // only fire once
      await this._postToChat();
    }
    return result;
  }
}

// ─────────────────────────────────────────────────────────────────
// MAIN READER
// ─────────────────────────────────────────────────────────────────
class KultTarotReader {
  static performReading(type, question = "", postToChat = false) {
    const template = KultTarot.TEMPLATES[type];
    if (!template) {
      ui.notifications.error(`Kult Tarot: Unknown reading type "${type}"`);
      return;
    }

    // Per the rules: star readings always draw exactly 5 cards.
    // Single-card draws get exactly 1. Never more, never less.
    const expectedCount = type === "single" ? 1 : 5;
    if (template.positions.length !== expectedCount) {
      console.error(`Kult Tarot Reader | Template "${type}" has ${template.positions.length} positions, expected ${expectedCount}.`);
      return;
    }

    const shuffled = shuffleDeck(KultTarot.DECK);
    const drawn    = template.positions.map((position, i) => ({
      card: shuffled[i],
      position,
    }));

    new KultTarotReadingApp(type, drawn, question, postToChat).render(true);
  }

  static openSelector() {
    new KultTarotSelectorDialog().render(true);
  }
}

// Expose globally
globalThis.KultTarot                = globalThis.KultTarot || {};
globalThis.KultTarot.Reader         = KultTarotReader;
globalThis.KultTarot.SelectorDialog = KultTarotSelectorDialog;
globalThis.KultTarot.ReadingApp     = KultTarotReadingApp;
