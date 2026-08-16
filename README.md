# Prismbound

A tiny turn-based spirit-taming RPG built for **js13kGames 2026** around the theme **Unicorns and Rainbows**.

You play a unicorn, tame elemental spirits, evolve them into unicorn forms, hunt down six Prism Echoes, master all 12 forms, break the Prism Seal, and deal with the Spectrum Warden. Because apparently 13 KiB was plenty of room for all that.

## Controls

- **WASD / Arrow keys** — move
- **Enter / Space** — interact / confirm
- **1–4** — choose battle move
- **S** — Shift / cancel Shift
- **H** — Prism / Harmonize action
- **R** — run / leave battle result
- **Esc** — menu / save / back
- **?** — how-to-play screen
- **M** — mute from the menu

Mouse/touch also works for the menus and battle UI.

## Run it

Open `index.html` for the readable source build, or `dist/index.html` for the packed single-file build.

## Build the submission ZIP

### Windows

```text
PACK_RELEASE.bat
```

### Linux / macOS

```text
sh PACK_RELEASE.sh
```

The packager installs the pinned Terser/Roadroller tools when npm is available, builds the single-file release, checks the js13k 13 KiB limit, and writes:

```text
dist/index.html
dist/Prismbound.zip
```

The readable files in `src/` are the actual game source. `dist/` is just the result of making them small enough to fit through a keyhole.

## Repository layout

```text
index.html              readable entry point
src/                    game source
dist/index.html         current packed playable build
tools/pack_release.py   release packager
tools/package*.json     pinned compression tools
PACK_RELEASE.*          one-command pack scripts
```

No framework, no asset folder the size of a small moon, and no mysterious build service required.
