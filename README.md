# Prismbound

A tiny turn-based spirit-taming RPG made for **js13kGames 2026** and the **Unicorns and Rainbows** theme.

Tame elemental spirits, evolve them into unicorn forms, collect six Prism Echoes, master all 12 forms, break the Prism Seal, and deal with the Spectrum Warden. Apparently 13 KiB was enough room for an RPG. Sensible decisions were made elsewhere.

## Controls

- **WASD / Arrow keys** — move
- **Enter / Space** — interact / confirm
- **1–4** — battle moves
- **S** — Shift / cancel Shift
- **H** — Prism / Harmonize
- **R** — run / continue from battle results
- **Esc** — menu / save / back
- **?** — help
- **M** — mute from the menu

Mouse/touch works for menus and the battle UI too.

## Run it

`index.html` is the readable game build. No framework, no mystery launcher, no 900 MB `node_modules` folder committed for emotional support.

## Make the release ZIP

Windows:

```text
PACK_RELEASE.bat
```

Linux/macOS:

```text
sh PACK_RELEASE.sh
```

The packer uses the pinned Terser + Roadroller versions in `tools/` and writes:

```text
dist/index.html
dist/Prismbound.zip
```

`dist/` is deliberately ignored by Git. Build the submission locally instead of committing generated sludge.

For the smallest/reproducible release, use Python 3, Node/npm, and the Python `zopfli` package. The scripts will install the pinned npm tools when needed.

## What's actually in here

```text
index.html              readable entry point
src/                    game source
PACK_RELEASE.bat        Windows release builder
PACK_RELEASE.sh         Linux/macOS release builder
tools/pack_release.py   13 KiB packer + size check
tools/package*.json     pinned Terser/Roadroller versions
```

That's it. The repo is the source and the packer, not a landfill of screenshots, test dumps, old builds, and files named `final_FINAL_reallyfinal2.zip`.
