/**
 * Kult Tarot Reader - Core Application
 *
 * Image resolution order:
 *  1. Search each KULT_TAROT_SOURCES compendium pack for a Cards stack,
 *     then match card faces by name.
 *  2. Search game.cards for any stack whose name contains "kult" or "tarot".
 *  3. Fall back to the static k4lt-assets path from tarot-data.js.
 */

// ── Utility: shuffle a copy of the deck ──────────────────────────
function shuffleDeck(deck) {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Utility: resolve real card image from Foundry data ───────────
// Builds a name→img map once from whatever tarot pack is available,
// then caches it on KultTarot for subsequent calls.
async function buildCardImageMap() {
  if (KultTarot._imageMap) return KultTarot._imageMap;

  const map = {};

  // 1. Try each known compendium source
  for (const { moduleId, packName } of KultTarot.TAROT_SOURCES) {
    const packKey = `${moduleId}.${packName}`;
    const pack = game.packs.get(packKey);
    if (!pack) continue;

    try {
      const index = await pack.getIndex();
      // A Cards compendium may have a single entry (the deck) or individual cards
      for (const entry of index) {
        const doc = await pack.getDocument(entry._id);
        if (!doc) continue;

        // If it's a Cards stack (deck), iterate its individual cards
        if (doc.cards) {
          for (const card of doc.cards) {
            const img = card.faces?.[0]?.img ?? card.img;
            if (img) map[card.name?.toLowerCase()] = img;
          }
        } else {
          // It's an individual card document
          const img = doc.faces?.[0]?.img ?? doc.img;
          if (img) map[doc.name?.toLowerCase()] = img;
        }
      }
    } catch (err) {
      console.warn(`Kult Tarot Reader | Could not read pack ${packKey}:`, err);
    }

    if (Object.keys(map).length > 0) break; // found images, stop searching
  }

  // 2. Fall back to any Cards stack in the world named "kult" or "tarot"
  if (Object.keys(map).length === 0) {
    const stack = game.cards?.find(c =>
      c.name?.toLowerCase().includes("kult") || c.name?.toLowerCase().includes("tarot")
    );
    if (stack) {
      for (const card of stack.cards ?? []) {
        const img = card.faces?.[0]?.img ?? card.img;
        if (img) map[card.name?.toLowerCase()] = img;
      }
    }
  }

  KultTarot._imageMap = map;
  console.log(`Kult Tarot Reader | Card image map built with ${Object.keys(map).length} entries.`);
  return map;
}

async function resolveCardImage(card) {
  const map = await buildCardImageMap();
  // Try exact name match first, then partial match
  return (
    map[card.name.toLowerCase()] ??
    Object.entries(map).find(([k]) => k.includes(card.name.toLowerCase()))?.[1] ??
    card.img // static fallback from tarot-data.js
  );
}

// ── Dialog: reading type selector ────────────────────────────────
class KultTarotSelectorDialog extends Dialog {
  constructor() {
    const templates = KultTarot.TEMPLATES;

    const options = Object.entries(templates).map(([key, tmpl]) => `
      <div class="kult-reading-option">
        <input type="radio" id="reading-${key}" name="readingType" value="${key}"
               ${key === "individual" ? "checked" : ""}>
        <label for="reading-${key}">
          <strong>${tmpl.name}</strong>
          <span class="kult-reading-desc">${tmpl.description}</span>
        </label>
      </div>
    `).join("");

    const content = `
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
      </div>
    `;

    super({
      title: "Kult Tarot — Begin Reading",
      content,
      buttons: {
        draw: {
          icon: '<i class="fas fa-hat-wizard"></i>',
          label: "Draw Cards",
          callback: (html) => {
            const type      = html.find('input[name="readingType"]:checked').val();
            const question  = html.find("#kult-question").val().trim();
            const postChat  = html.find("#kult-post-chat").is(":checked");
            KultTarotReader.performReading(type, question, postChat);
          }
        },
        cancel: { icon: '<i class="fas fa-times"></i>', label: "Cancel" }
      },
      default: "draw",
    });
  }
}

// ── Application: reading result window ───────────────────────────
class KultTarotReadingApp extends Application {
  constructor(readingType, drawnCards, question, postToChat) {
    super();
    this.readingType   = readingType;
    this.drawnCards    = drawnCards;   // [{ card, position }]
    this.question      = question;
    this.postToChat    = postToChat;
    this.tmpl          = KultTarot.TEMPLATES[readingType];
    this.flipped       = new Set();
    this._resolvedImgs = null;         // cached after first render
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id:        "kult-tarot-reading",
      title:     "Kult Tarot — Reading",
      width:     920,
      height:    "auto",
      resizable: true,
      classes:   ["kult-tarot-reading-window"],
    });
  }

  async getData() {
    // Resolve images once and cache
    if (!this._resolvedImgs) {
      this._resolvedImgs = await Promise.all(
        this.drawnCards.map(({ card }) => resolveCardImage(card))
      );
    }
    return {
      readingName: this.tmpl.name,
      question:    this.question,
      isSingle:    this.readingType === "single",
      cards: this.drawnCards.map(({ card, position }, i) => ({
        card, position,
        img:      this._resolvedImgs[i],
        revealed: this.flipped.has(position.slot),
      })),
    };
  }

  async _renderInner(data) {
    const { readingName, question, cards, isSingle } = data;

    const cardHTML = ({ card, position, img, revealed }) => `
      <div class="kult-card-slot ${revealed ? "revealed" : "face-down"}"
           data-slot="${position.slot}" title="Click to reveal: ${position.label}">
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
      </div>
    `;

    // Star layout: centre, left, top, right, bottom
    // drawnCards order: [0]=centre, [1]=left, [2]=top, [3]=right, [4]=bottom
    const layoutHTML = isSingle
      ? `<div class="kult-layout kult-layout-single">${cardHTML(cards[0])}</div>`
      : `<div class="kult-layout kult-layout-star">
           <div class="kult-star-slot kult-star-top">    ${cardHTML(cards[2])}</div>
           <div class="kult-star-row">
             <div class="kult-star-slot kult-star-left">  ${cardHTML(cards[1])}</div>
             <div class="kult-star-slot kult-star-center">${cardHTML(cards[0])}</div>
             <div class="kult-star-slot kult-star-right"> ${cardHTML(cards[3])}</div>
           </div>
           <div class="kult-star-slot kult-star-bottom">  ${cardHTML(cards[4])}</div>
         </div>`;

    const html = `
      <div class="kult-tarot-reading">
        <div class="kult-reading-header">
          <h2>${readingName} Reading</h2>
          ${question ? `<blockquote class="kult-question">"${question}"</blockquote>` : ""}
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
        <div class="kult-reading-notes">
          <label><strong>GM Notes:</strong></label>
          <textarea class="kult-notes-area"
            placeholder="Write your interpretation here..."></textarea>
        </div>
      </div>
    `;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    return $(wrapper);
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Click face-down card to reveal
    html.find(".kult-card-slot.face-down").on("click", (ev) => {
      const slot = parseInt(ev.currentTarget.dataset.slot);
      this.flipped.add(slot);
      $(ev.currentTarget).removeClass("face-down").addClass("revealed");
    });

    html.find(".kult-reveal-all").on("click", () => {
      this.drawnCards.forEach(({ position }) => this.flipped.add(position.slot));
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
    if (this.postToChat) await this._postToChat();
    return result;
  }
}

// ── Main reader ───────────────────────────────────────────────────
class KultTarotReader {
  static performReading(type, question = "", postToChat = false) {
    const template = KultTarot.TEMPLATES[type];
    if (!template) {
      ui.notifications.error(`Kult Tarot: Unknown reading type "${type}"`);
      return;
    }
    const shuffled = shuffleDeck(KultTarot.DECK);
    const drawn = template.positions.map((position, i) => ({
      card: shuffled[i],
      position,
    }));
    new KultTarotReadingApp(type, drawn, question, postToChat).render(true);
  }

  static openSelector() {
    new KultTarotSelectorDialog().render(true);
  }
}

// Expose
globalThis.KultTarot = globalThis.KultTarot || {};
globalThis.KultTarot.Reader       = KultTarotReader;
globalThis.KultTarot.SelectorDialog = KultTarotSelectorDialog;
globalThis.KultTarot.ReadingApp   = KultTarotReadingApp;
