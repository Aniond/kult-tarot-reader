# Kult Tarot Reader

A **Foundry VTT v13** module for *KULT: Divinity Lost* that performs tarot readings using the official card images already in your `k4lt-en` module. Supports all 6 reading templates from the Kult Tarot supplement plus single-card draws.

![Foundry v13.351](https://img.shields.io/badge/Foundry-v13.351-informational)
![System: k4lt](https://img.shields.io/badge/System-k4lt-red)

---

## Requirements

| Package | ID | Where to get it |
|---|---|---|
| KULT: Divinity Lost system | `k4lt` | Foundry package installer |
| KULT: Divinity Lost · Extra EN | `k4lt-en` | Foundry package installer |
| KULT: Divinity Lost · Assets | `k4lt-assets` | Foundry package installer |

> The tarot compendium lives at `/Data/modules/k4lt-en/packs/kult-tarot` (LevelDB).  
> Card images live inside `k4lt-assets`. Both must be **installed and enabled** in your world.

---

## Installation

### Method A — Manifest URL (easiest, works on all platforms)

1. Open your Foundry setup screen
2. Go to **Add-on Modules → Install Module**
3. Paste the manifest URL into the field at the bottom:
   ```
   https://raw.githubusercontent.com/Aniond/kult-tarot-reader/main/module.json
   ```
4. Click **Install**
5. Launch your world, go to **Settings → Manage Modules**, and enable **Kult Tarot Reader**

---

### Method B — Manual installation (local self-hosted)

Use this if the manifest URL doesn't work or you want to install from a ZIP.

**Windows (local Foundry install):**
1. Download the ZIP from the [Releases page](https://github.com/Aniond/kult-tarot-reader/releases)
2. Extract it so you have a folder called `kult-tarot-reader`
3. Move the folder to:
   ```
   C:\Users\<YourName>\AppData\Local\FoundryVTT\Data\modules\kult-tarot-reader\
   ```
   > **Tip:** Paste `%localappdata%\FoundryVTT\Data\modules\` into the Windows Explorer address bar to jump straight there
4. Restart Foundry if it's running
5. Enable the module in your world under **Settings → Manage Modules**

**macOS (local Foundry install):**
1. Download and extract the ZIP
2. Move the `kult-tarot-reader` folder to:
   ```
   ~/Library/Application Support/FoundryVTT/Data/modules/
   ```
3. Restart Foundry and enable the module in your world

**Linux (local Foundry install):**
1. Download and extract the ZIP
2. Move the folder to:
   ```
   ~/.local/share/FoundryVTT/Data/modules/kult-tarot-reader/
   ```
   > Your path may differ if you set a custom `dataPath` in Foundry's config
3. Restart Foundry and enable the module in your world

---

### Method C — FTP / SFTP (hosted server, e.g. Molten Hosting)

This is the method for servers you access via FTP/SFTP, like the setup at `kult.moltenhosting.com`.

**What you need:** An FTP client such as [FileZilla](https://filezilla-project.org/) (free)

1. Download the ZIP from the [Releases page](https://github.com/Aniond/kult-tarot-reader/releases) and extract it locally — you should have a folder called `kult-tarot-reader`

2. Open your FTP client and connect to your server using the credentials your host provided

3. In the remote panel, navigate to:
   ```
   /Data/modules/
   ```
   > This is the same place you can see `k4lt-en/`, `k4lt-assets/`, etc.

4. Upload the entire `kult-tarot-reader/` folder into `/Data/modules/`  
   In FileZilla: drag the local folder into the remote `/Data/modules/` panel

5. The result should look like this on your server:
   ```
   /Data/modules/kult-tarot-reader/
   ├── module.json
   ├── README.md
   ├── scripts/
   │   ├── tarot-data.js
   │   ├── tarot-reader.js
   │   └── main.js
   └── styles/
       └── kult-tarot.css
   ```

6. In Foundry, go to **Settings → Manage Modules** and enable **Kult Tarot Reader**

> **Note for Molten Hosting users:** You do not need to restart the server after uploading. Foundry picks up new modules from disk automatically when you refresh the module list.

---

### Method D — The Forge (forge-vtt.com)

1. Go to your Forge account → **My Bazaar**
2. Search for `kult-tarot-reader` (if published to the Foundry package list)  
   *Or* use **Install from Manifest URL** and paste:
   ```
   https://raw.githubusercontent.com/Aniond/kult-tarot-reader/main/module.json
   ```
3. Enable the module in your game under **Settings → Manage Modules**

---

## Verifying the Installation

After enabling the module, open the browser console (**F12 → Console tab**) and look for:

```
Kult Tarot Reader | Ready. Preferred source: k4lt-en. Use KultTarot.Reader.openSelector() or press Alt+T.
Kult Tarot Reader | Card image map built with 68 entries.
```

- **68 entries** = all cards found, images will work ✓  
- **0 entries** = the compendium wasn't found (see Troubleshooting below)

---

## Usage

### Opening a Reading

| Method | Instructions |
|---|---|
| **Keyboard** | Press `Alt + T` |
| **Cards Sidebar** | Open the Cards tab (playing card icon) → click **Kult Tarot Reading** button |
| **Chat** | Type `/tarot` or `/tarot individual` in the chat box |
| **Macro** | Create a Script macro with `KultTarot.Reader.openSelector();` |

### Reading Types

The dialog shows all reading types with radio buttons — select one and optionally type your question:

| Reading | Cards | What it reveals |
|---|---|---|
| **Individual** | 5 | Core trait · Past · Ambition · Weakness · Strength |
| **Location** | 5 | Type · Past · Quirky trait · Weakness · Exceptional quality |
| **Cult** | 5 | Power/Ambition · History · Goal · Weakness · Unexpected resource |
| **Plot** | 5 | Power behind it · Cause · Next move · Opposition · Support |
| **Creature** | 5 | Origin · Info sources · Drive · Weakness · Strength |
| **Artifact** | 5 | Origin · Who seeks it · Dangers · Primary power · Secondary power |
| **Single Draw** | 1 | One card answer to a specific question |

### The Reading Window

- Cards appear **face-down** in a star pattern (card 1 centre, 2 left, 3 top, 4 right, 5 bottom)
- **Click any card** to flip it and reveal the image, position label, and meaning
- **Reveal All** — flips all cards at once
- **Post to Chat** — sends a text summary of the reading to the chat log
- **New Reading** — closes this window and opens the selector again
- **GM Notes** — a text area at the bottom to write your interpretation

### Macro API

For advanced use in macros or the console:

```js
// Open the selection dialog
KultTarot.Reader.openSelector();

// Perform a specific reading directly (type, question, postToChat)
KultTarot.Reader.performReading("individual", "Who is this stranger?", true);
KultTarot.Reader.performReading("plot", "", false);
KultTarot.Reader.performReading("single", "What is hidden here?", true);
```

Valid type strings: `individual` · `location` · `cult` · `plot` · `creature` · `artifact` · `single`

---

## Settings

Found under **Settings → Module Settings → Kult Tarot Reader**:

| Setting | Description | Default |
|---|---|---|
| Preferred Tarot Module | Which k4lt module to search first for card images | `k4lt-en` |
| Allow Players to Draw | Let non-GM players open the reader | Off |

---

## How Card Images Are Found

The module searches in this order and stops at the first success:

1. **`k4lt-en.kult-tarot`** compendium pack → reads card faces from the LevelDB at `/Data/modules/k4lt-en/packs/kult-tarot/`
2. **`k4lt-fr.tarot-de-kult`** compendium pack (French module fallback)
3. **`k4lt-assets.kult-tarot`** compendium pack
4. **Any `game.cards` stack** in the world whose name contains "kult" or "tarot"
5. **Static path fallback** → `modules/k4lt-assets/assets/tarot/[filename].webp`

---

## Troubleshooting

### Cards show broken images / "0 entries" in console

Run this in the browser console (F12):
```js
game.packs.contents
  .filter(p => p.metadata.type === "Cards")
  .map(p => p.collection)
```
This lists every Cards compendium available. Share the output and the correct pack key can be patched in.

Also confirm that both `k4lt-en` and `k4lt-assets` are **enabled** in your world — disabled modules won't have their packs available.

### Alt+T doesn't open the dialog

Another module may be using the same keybinding. Change it under **Settings → Configure Controls → Kult Tarot Reader**.

### `/tarot` chat command does nothing

Make sure **Allow Players to Draw** is enabled if you're not the GM, or type the command while logged in as GM.

### Module not appearing in the module list

Check that the folder was uploaded to the correct location and contains a valid `module.json`. In Foundry, click the refresh button in the module installer to re-scan the disk.

---

## License

Fan-made, unofficial. *KULT: Divinity Lost* is published by **Helmgast AB**. This module contains no copyrighted card art — it only references images from the official `k4lt-en` / `k4lt-assets` modules you already have installed. Source code: GNU GPL v3.0.

## Credits

Module author: **Aniond** · Tarot supplement text: **Petter Nallo** · Card art: **Axel Torvenius** · k4lt Foundry system: **YanKlInnomme**
