/**
 * Kult Tarot Reader - Card Data
 *
 * The Kult: Divinity Lost Foundry system is "k4lt" by YanKlInnomme.
 * Tarot cards live in a Cards compendium inside the English module "k4lt-en"
 * (pack name "kult-tarot") or French module "k4lt-fr" (pack "tarot-de-kult").
 * Card images are stored in the k4lt-assets module.
 *
 * Card names below match the compendium entry names exactly so the
 * image-resolution code can find them by name lookup.
 */

// Ordered list of module+pack combos to try when looking up the tarot deck
const KULT_TAROT_SOURCES = [
  { moduleId: "k4lt-en",     packName: "kult-tarot"    },
  { moduleId: "k4lt-fr",     packName: "tarot-de-kult" },
  { moduleId: "k4lt-assets", packName: "kult-tarot"    },
];

// Fallback image path inside k4lt-assets if compendium lookup fails
function getKultCardPath(filename) {
  return `modules/k4lt-assets/assets/tarot/${filename}`;
}

// ─────────────────────────────────────────────
// MAJOR ARCANA
// ─────────────────────────────────────────────
const MAJOR_ARCANA = [
  { id: "major-00", name: "Anthropos",    number: "0",    suit: "Major Arcana", img: getKultCardPath("major-00-anthropos.webp"),    meaning: "The Awakened Man. The Path to Awakening and the true divine origin of humanity." },
  { id: "major-01", name: "Demiurge",     number: "I",    suit: "Major Arcana", img: getKultCardPath("major-01-demiurge.webp"),     meaning: "The lost ruler, Creator of Mankind's prison. Metropolis, the Endless City, Machinery of Death and Rebirth." },
  { id: "major-02", name: "Astaroth",     number: "II",   suit: "Major Arcana", img: getKultCardPath("major-02-astaroth.webp"),     meaning: "The Ruler of Inferno. The Black Sun. Cracks in the Illusion. Wills Behind the Veil." },
  { id: "major-03", name: "Kether",       number: "III",  suit: "Major Arcana", img: getKultCardPath("major-03-kether.webp"),       meaning: "Principle of Hierarchy. Masters and servants, widening class gaps, aristocracy with power." },
  { id: "major-04", name: "Chokmah",      number: "IV",   suit: "Major Arcana", img: getKultCardPath("major-04-chokmah.webp"),      meaning: "Principle of Submission. Religious leaders, martyrdom, fanaticism, theocratic rule." },
  { id: "major-05", name: "Binah",        number: "V",    suit: "Major Arcana", img: getKultCardPath("major-05-binah.webp"),        meaning: "Principle of Community. Family power over the individual, mistrust of strangers." },
  { id: "major-06", name: "Chesed",       number: "VI",   suit: "Major Arcana", img: getKultCardPath("major-06-chesed.webp"),       meaning: "Principle of Safety. Longing for protection from the unknown. Now faded." },
  { id: "major-07", name: "Geburah",      number: "VII",  suit: "Major Arcana", img: getKultCardPath("major-07-geburah.webp"),      meaning: "Principle of Law. Bureaucracy, stricter laws, increased policing and societal control." },
  { id: "major-08", name: "Tiphareth",    number: "VIII", suit: "Major Arcana", img: getKultCardPath("major-08-tiphareth.webp"),    meaning: "Principle of Allure. Manic craving for beauty. Celebrity worship, media, the Internet." },
  { id: "major-09", name: "Netzach",      number: "IX",   suit: "Major Arcana", img: getKultCardPath("major-09-netzach.webp"),      meaning: "Principle of Victory. Patriotism, nationalism, us-versus-them, military strength." },
  { id: "major-10", name: "Hod",          number: "X",    suit: "Major Arcana", img: getKultCardPath("major-10-hod.webp"),          meaning: "Principle of Honor. Honor above law, personal vendettas, ostracizing the shamed." },
  { id: "major-11", name: "Yesod",        number: "XI",   suit: "Major Arcana", img: getKultCardPath("major-11-yesod.webp"),        meaning: "Principle of Avarice. Greed, capitalism, consumer frenzy, contempt for poverty." },
  { id: "major-12", name: "Malkuth",      number: "XII",  suit: "Major Arcana", img: getKultCardPath("major-12-malkuth.webp"),      meaning: "Principle of Awakening. Shattering the Illusion, searching for lost divinity." },
  { id: "major-13", name: "Thaumiel",     number: "XIII", suit: "Major Arcana", img: getKultCardPath("major-13-thaumiel.webp"),     meaning: "Principle of Power. Corruption, dictatorship, fascism, intrigue, ruthlessness." },
  { id: "major-14", name: "Chagidiel",    number: "XIV",  suit: "Major Arcana", img: getKultCardPath("major-14-chagidiel.webp"),    meaning: "Principle of Abuse. Violation, forgotten children, degradation of family and school." },
  { id: "major-15", name: "Sathariel",    number: "XV",   suit: "Major Arcana", img: getKultCardPath("major-15-sathariel.webp"),    meaning: "Principle of Exclusion. Self-loathing, loneliness, hopelessness, outsider communities." },
  { id: "major-16", name: "Gamichicoth",  number: "XVI",  suit: "Major Arcana", img: getKultCardPath("major-16-gamichicoth.webp"),  meaning: "Principle of Fear. Fear of 'the Other', false narratives, blame of ethnic groups." },
  { id: "major-17", name: "Golab",        number: "XVII", suit: "Major Arcana", img: getKultCardPath("major-17-golab.webp"),        meaning: "Principle of Torment. Societal sadism, pleasure from inflicting pain, mutilation." },
  { id: "major-18", name: "Togarini",     number: "XVIII",suit: "Major Arcana", img: getKultCardPath("major-18-togarini.webp"),     meaning: "Principle of Compulsion. Manic creativity, insane artwork, souls binding into corpses." },
  { id: "major-19", name: "Hareb-Serap",  number: "XIX",  suit: "Major Arcana", img: getKultCardPath("major-19-hareb-serap.webp"),  meaning: "Principle of Conflict. Uncontrollable rage, bloodlust, senseless violence." },
  { id: "major-20", name: "Samael",       number: "XX",   suit: "Major Arcana", img: getKultCardPath("major-20-samael.webp"),       meaning: "Principle of Vengeance. Paranoia, vindictiveness, obsession with injustices." },
  { id: "major-21", name: "Gamaliel",     number: "XXI",  suit: "Major Arcana", img: getKultCardPath("major-21-gamaliel.webp"),     meaning: "Principle of Lust. Hypersexualization, objectification, mindless desires." },
  { id: "major-22", name: "Nahemoth",     number: "XXII", suit: "Major Arcana", img: getKultCardPath("major-22-nahemoth.webp"),     meaning: "Principle of Discord. Deforms the natural world — storms, fires, pollution, ruin." },
];

// ─────────────────────────────────────────────
// SKULLS — Death / Metropolis / Inferno
// ─────────────────────────────────────────────
const SKULLS = [
  { id: "skulls-1", name: "Metropolis",   number: "1", suit: "Skulls", img: getKultCardPath("skulls-01-metropolis.webp"),   meaning: "Mankind's ancestral home. The Eternal City. Demiurge's Machinery. Ruins, Citadels." },
  { id: "skulls-2", name: "Forgetfulness",number: "2", suit: "Skulls", img: getKultCardPath("skulls-02-forgetfulness.webp"),meaning: "That which faded from memory. Rebirth cycles, memory loss, manipulated minds." },
  { id: "skulls-3", name: "Remnants",     number: "3", suit: "Skulls", img: getKultCardPath("skulls-03-remnants.webp"),     meaning: "Left behind after death or destruction. Ruins, abandoned homes, family secrets." },
  { id: "skulls-4", name: "Spirit",       number: "4", suit: "Skulls", img: getKultCardPath("skulls-04-spirit.webp"),       meaning: "The psyche. The divine soul in chains. Mediums, ghosts, possession." },
  { id: "skulls-5", name: "Transition",   number: "5", suit: "Skulls", img: getKultCardPath("skulls-05-transition.webp"),   meaning: "Crossing from life to death. Hitmen, the dying, secret gates to the dead city." },
  { id: "skulls-6", name: "Flesh",        number: "6", suit: "Skulls", img: getKultCardPath("skulls-06-flesh.webp"),        meaning: "The body as a shell or prison. Morgues, mass graves, surgeons who collect trophies." },
  { id: "skulls-7", name: "Weapon",       number: "7", suit: "Skulls", img: getKultCardPath("skulls-07-weapon.webp"),       meaning: "The tool that brings death through violence. Arms, soldiers, assassins." },
  { id: "skulls-8", name: "Suffering",    number: "8", suit: "Skulls", img: getKultCardPath("skulls-08-suffering.webp"),    meaning: "Pain with death, cleansing of the soul. Purgatory, oubliettes, torture." },
  { id: "skulls-9", name: "Inferno",      number: "9", suit: "Skulls", img: getKultCardPath("skulls-09-inferno.webp"),      meaning: "The shadow of Metropolis. The realm of Astaroth. Citadels, gates to Inferno." },
];

// ─────────────────────────────────────────────
// ROSES — Passion / Gaia
// ─────────────────────────────────────────────
const ROSES = [
  { id: "roses-1", name: "Gaia",      number: "1", suit: "Roses", img: getKultCardPath("roses-01-gaia.webp"),      meaning: "Untamed Wilderness. Primal hunger and raw emotions. Shamans, savage instincts." },
  { id: "roses-2", name: "Birth",     number: "2", suit: "Roses", img: getKultCardPath("roses-02-birth.webp"),     meaning: "What comes out of passion. A new soul merged into flesh. Newborns, beginnings." },
  { id: "roses-3", name: "Survival",  number: "3", suit: "Roses", img: getKultCardPath("roses-03-survival.webp"),  meaning: "Will to go on against all odds. Survival of the fittest. Iron will, veterans." },
  { id: "roses-4", name: "Growth",    number: "4", suit: "Roses", img: getKultCardPath("roses-04-growth.webp"),    meaning: "Things that gain power and expand. Obsessions, mutation, cancer, nature reclaiming." },
  { id: "roses-5", name: "Predator",  number: "5", suit: "Roses", img: getKultCardPath("roses-05-predator.webp"),  meaning: "The hunter who preys on the weak. Serial killers, manipulators, stalkers." },
  { id: "roses-6", name: "Swarm",     number: "6", suit: "Roses", img: getKultCardPath("roses-06-swarm.webp"),     meaning: "Collective mind, mob swallowed by passion. Groups, cults, herd mentality." },
  { id: "roses-7", name: "Prey",      number: "7", suit: "Roses", img: getKultCardPath("roses-07-prey.webp"),      meaning: "The victim of passion. Stalked, blackmailed, trafficked, trapped." },
  { id: "roses-8", name: "Obsession", number: "8", suit: "Roses", img: getKultCardPath("roses-08-obsession.webp"), meaning: "Passion's grip. Enslaved by desire, addiction, unhealthy fixation." },
  { id: "roses-9", name: "Love",      number: "9", suit: "Roses", img: getKultCardPath("roses-09-love.webp"),      meaning: "A bond stronger than death. Gives strength and purpose, but can doom you." },
];

// ─────────────────────────────────────────────
// HOURGLASSES — Time / Space / Underworld
// ─────────────────────────────────────────────
const HOURGLASSES = [
  { id: "hourglasses-1", name: "Achlys",     number: "1", suit: "Hourglasses", img: getKultCardPath("hourglasses-01-achlys.webp"),     meaning: "Nothingness, infinity, the void. Soul obliteration. Deep isolation, the abyss." },
  { id: "hourglasses-2", name: "Future",     number: "2", suit: "Hourglasses", img: getKultCardPath("hourglasses-02-future.webp"),     meaning: "Things yet to come. Unreleased potential. Gamblers, prophets, unplanted seeds." },
  { id: "hourglasses-3", name: "Past",       number: "3", suit: "Hourglasses", img: getKultCardPath("hourglasses-03-past.webp"),       meaning: "Things already occurred, now returning. Ruins, old secrets, forgotten histories." },
  { id: "hourglasses-4", name: "Space",      number: "4", suit: "Hourglasses", img: getKultCardPath("hourglasses-04-space.webp"),      meaning: "Always in motion toward a goal. Drifters, escaped convicts, information flow." },
  { id: "hourglasses-5", name: "Borderland", number: "5", suit: "Hourglasses", img: getKultCardPath("hourglasses-05-borderland.webp"), meaning: "Between two worlds. Uncertain loyalties, deals between powers, standoffs." },
  { id: "hourglasses-6", name: "Hidden",     number: "6", suit: "Hourglasses", img: getKultCardPath("hourglasses-06-hidden.webp"),     meaning: "Obscured from view. Undercover agents, safehouses, secret passages." },
  { id: "hourglasses-7", name: "Labyrinth",  number: "7", suit: "Hourglasses", img: getKultCardPath("hourglasses-07-labyrinth.webp"),  meaning: "A maze of dangers and confusion. Sewers, cave networks, walking in circles." },
  { id: "hourglasses-8", name: "Crossroad",  number: "8", suit: "Hourglasses", img: getKultCardPath("hourglasses-08-crossroad.webp"),  meaning: "Two paths, a choice with very different outcomes. Dilemmas, pact-weavers." },
  { id: "hourglasses-9", name: "Gate",       number: "9", suit: "Hourglasses", img: getKultCardPath("hourglasses-09-gate.webp"),       meaning: "A threshold that must be crossed or protected. Portals, vaults, guardians." },
];

// ─────────────────────────────────────────────
// CRESCENTS — Dreams / Limbo / Creation
// ─────────────────────────────────────────────
const CRESCENTS = [
  { id: "crescents-1", name: "Vortex",         number: "1", suit: "Crescents", img: getKultCardPath("crescents-01-vortex.webp"),         meaning: "Source of creation, dreams, ever-transforming chaos from Limbo. Maelstroms." },
  { id: "crescents-2", name: "Creation",       number: "2", suit: "Crescents", img: getKultCardPath("crescents-02-creation.webp"),       meaning: "Raw godly power to shape the world. Artists, architects, mad scientists." },
  { id: "crescents-3", name: "Undoing",        number: "3", suit: "Crescents", img: getKultCardPath("crescents-03-undoing.webp"),        meaning: "Collapse and obliteration. Cover-ups, destroyed structures, burning papers." },
  { id: "crescents-4", name: "Transformation", number: "4", suit: "Crescents", img: getKultCardPath("crescents-04-transformation.webp"), meaning: "Extreme change and metamorphosis. Body modification, false identity, makeovers." },
  { id: "crescents-5", name: "Connection",     number: "5", suit: "Crescents", img: getKultCardPath("crescents-05-connection.webp"),     meaning: "Intertwined structures and wills. Conspiracies, networks, hacker groups." },
  { id: "crescents-6", name: "Merging",        number: "6", suit: "Crescents", img: getKultCardPath("crescents-06-merging.webp"),        meaning: "Two things become one. Acts of love, cults, assimilation, myth and reality blending." },
  { id: "crescents-7", name: "Reflection",     number: "7", suit: "Crescents", img: getKultCardPath("crescents-07-reflection.webp"),     meaning: "Reveals truth or deceives. Doppelgängers, mirrors, hallucinations, double identity." },
  { id: "crescents-8", name: "Repetition",     number: "8", suit: "Crescents", img: getKultCardPath("crescents-08-repetition.webp"),     meaning: "Endless loop or recurring theme. Déjà vu, trapped cycles, same routines." },
  { id: "crescents-9", name: "Stillness",      number: "9", suit: "Crescents", img: getKultCardPath("crescents-09-stillness.webp"),      meaning: "Apathy, tranquility, an unchanging situation. Ghost towns, catatonia." },
];

// ─────────────────────────────────────────────
// EYES — Elysium / Madness / Insight
// ─────────────────────────────────────────────
const EYES = [
  { id: "eyes-1", name: "Elysium",      number: "1", suit: "Eyes", img: getKultCardPath("eyes-01-elysium.webp"),      meaning: "The core of the Illusion. The machinery that keeps you in chains." },
  { id: "eyes-2", name: "Imprisonment", number: "2", suit: "Eyes", img: getKultCardPath("eyes-02-imprisonment.webp"), meaning: "Body, soul, and mind imprisoned. Police, wardens, legal systems, debt." },
  { id: "eyes-3", name: "Faith",        number: "3", suit: "Eyes", img: getKultCardPath("eyes-03-faith.webp"),        meaning: "Faith that gives purpose but makes you blind. Preachers, fanatics, ceremonies." },
  { id: "eyes-4", name: "Distractions", number: "4", suit: "Eyes", img: getKultCardPath("eyes-04-distractions.webp"), meaning: "Everyday blindness to the Truth. Social media, TV, celebrities, advertising." },
  { id: "eyes-5", name: "Division",     number: "5", suit: "Eyes", img: getKultCardPath("eyes-05-division.webp"),     meaning: "Endless struggles keeping us occupied. Agitators, hate groups, heated debates." },
  { id: "eyes-6", name: "Rebellion",    number: "6", suit: "Eyes", img: getKultCardPath("eyes-06-rebellion.webp"),    meaning: "Struggle against the ruling order. Hackers, anarchists, revolutionaries, riots." },
  { id: "eyes-7", name: "Madness",      number: "7", suit: "Eyes", img: getKultCardPath("eyes-07-madness.webp"),      meaning: "Overwhelms and tears apart, but may grant insight. Psychosis, PTSD, mass delusion." },
  { id: "eyes-8", name: "Visions",      number: "8", suit: "Eyes", img: getKultCardPath("eyes-08-visions.webp"),      meaning: "Insight or led astray. Oracles, prophets, nightmarish visions, rumors of Truth." },
  { id: "eyes-9", name: "Enlightenment",number: "9", suit: "Eyes", img: getKultCardPath("eyes-09-enlightenment.webp"),meaning: "The road toward Awakening. Magicians, scientists on the verge, initiation rituals." },
];

// ─────────────────────────────────────────────
// FULL DECK
// ─────────────────────────────────────────────
const KULT_TAROT_DECK = [
  ...MAJOR_ARCANA,
  ...SKULLS,
  ...ROSES,
  ...HOURGLASSES,
  ...CRESCENTS,
  ...EYES,
];

// ─────────────────────────────────────────────
// READING TEMPLATES
// ─────────────────────────────────────────────
const READING_TEMPLATES = {
  individual: {
    name: "Individual",
    description: "Reveal the nature of a person, NPC, or antagonist.",
    positions: [
      { slot: 1, label: "Core Characteristic",     description: "A defining trait of the individual." },
      { slot: 2, label: "Something from the Past",  description: "An event that shaped who they are." },
      { slot: 3, label: "Ambition",                 description: "A drive that motivates the individual." },
      { slot: 4, label: "Greatest Weakness",        description: "Their most exploitable flaw." },
      { slot: 5, label: "Greatest Strength",        description: "Their most powerful asset." },
    ]
  },
  location: {
    name: "Location",
    description: "Uncover the nature and secrets of a place.",
    positions: [
      { slot: 1, label: "Type of Location",         description: "What kind of place is this?" },
      { slot: 2, label: "The Location's Past",       description: "What happened here before?" },
      { slot: 3, label: "Unexpected Trait",          description: "A quirky or surprising element." },
      { slot: 4, label: "Weakness",                  description: "A vulnerability that could be exploited." },
      { slot: 5, label: "Exceptional Quality",       description: "What makes this place stand out?" },
    ]
  },
  cult: {
    name: "Cult",
    description: "Reveal the inner workings of a cult or organization.",
    positions: [
      { slot: 1, label: "Power / Ambition",          description: "What drives the cult?" },
      { slot: 2, label: "History",                   description: "An important fact about their past." },
      { slot: 3, label: "Goal",                      description: "What does the cult wish to accomplish?" },
      { slot: 4, label: "Weakness",                  description: "Enemies or vulnerabilities." },
      { slot: 5, label: "Unexpected Resource",       description: "A hidden advantage the cult possesses." },
    ]
  },
  plot: {
    name: "Plot",
    description: "Illuminate the forces shaping a story arc.",
    positions: [
      { slot: 1, label: "Power Behind the Plot",     description: "Who or what is pulling the strings?" },
      { slot: 2, label: "Cause",                     description: "What set this plot in motion?" },
      { slot: 3, label: "Next Move",                 description: "What happens next?" },
      { slot: 4, label: "Opposing Power",            description: "What force stands against the plot?" },
      { slot: 5, label: "Supporting Power",          description: "What force aids the plot?" },
    ]
  },
  creature: {
    name: "Creature",
    description: "Define a monster, entity, or supernatural being.",
    positions: [
      { slot: 1, label: "Origin",                    description: "Where does this creature come from?" },
      { slot: 2, label: "Sources of Information",    description: "Where can clues about it be found?" },
      { slot: 3, label: "Drive",                     description: "What motivates the creature?" },
      { slot: 4, label: "Weakness",                  description: "How can it be harmed or stopped?" },
      { slot: 5, label: "Strength",                  description: "What makes it dangerous?" },
    ]
  },
  artifact: {
    name: "Artifact",
    description: "Reveal the nature and dangers of a supernatural object.",
    positions: [
      { slot: 1, label: "Origin",                    description: "Where does the artifact come from?" },
      { slot: 2, label: "Who Else Seeks It",         description: "Other factions hunting for the artifact." },
      { slot: 3, label: "Dangers of Use",            description: "What risks come with wielding it?" },
      { slot: 4, label: "Primary Power",             description: "Its main supernatural ability." },
      { slot: 5, label: "Secondary Power",           description: "A hidden or secondary ability." },
    ]
  },
  single: {
    name: "Single Card Draw",
    description: "Draw one card to answer a specific question.",
    positions: [
      { slot: 1, label: "The Answer",                description: "What does the card reveal?" },
    ]
  }
};

// Export to global scope
globalThis.KultTarot = globalThis.KultTarot || {};
globalThis.KultTarot.DECK            = KULT_TAROT_DECK;
globalThis.KultTarot.MAJOR_ARCANA    = MAJOR_ARCANA;
globalThis.KultTarot.SKULLS          = SKULLS;
globalThis.KultTarot.ROSES           = ROSES;
globalThis.KultTarot.HOURGLASSES     = HOURGLASSES;
globalThis.KultTarot.CRESCENTS       = CRESCENTS;
globalThis.KultTarot.EYES            = EYES;
globalThis.KultTarot.TEMPLATES       = READING_TEMPLATES;
globalThis.KultTarot.TAROT_SOURCES   = KULT_TAROT_SOURCES;
