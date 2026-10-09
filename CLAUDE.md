# React Concepts Playground

Public repo (github.com/deesha-tech/react-concepts-playground, PolyForm Noncommercial 1.0.0) of small runnable examples for Deesha Tech Academy's video series. Each `examples/NN-slug/` is a self-contained Vite + React 19 + React Router 8 + TypeScript strict project so StackBlitz can open the folder directly.

- Shared chrome (header menu, course promos, interview band, request timeline, code peek) lives in `shell/`. Edit it there, then run `npm run sync`; never edit `examples/*/src/shell/` by hand. CI fails if they drift.
- Per-episode content (summary, steps, challenge, interview Q&A) is in `src/episode.ts`.
- Write examples from scratch. Never copy code from the private ShopScope course repo.
- Promo copy rule: no "free" or pricing words.
- The matching promo kit (scripts, captions, covers) is in ../deesha-promo.
