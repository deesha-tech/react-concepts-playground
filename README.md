<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="shell/logo-light.png">
    <img src="shell/logo-dark.png" alt="Deesha Tech Academy" width="320">
  </picture>
</p>

<h1 align="center">React Concepts Playground</h1>

<p align="center">
  Small, runnable React examples from our video series <b>React Important Concepts, Questions &amp; Patterns</b>.<br>
  Open one in your browser, break it, fix it, and see the concept for yourself.
</p>

<p align="center">
  <a href="https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=readme-top"><b>Learn React live with an expert →</b></a>
</p>

---

## Examples

| Ep | Concept | What you'll see | Try it |
|---|---|---|---|
| 01 | [Race Conditions](examples/01-race-conditions) | Type "phone", get results for "ph". Fix it with AbortController and debounce. | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/01-race-conditions?file=src/FixedSearch.tsx) |
| 19 | [Loaders vs useEffect](examples/19-loaders-vs-useeffect) | The request waterfall that useEffect fetching causes, and how loaders remove it. | [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz_small.svg)](https://stackblitz.com/github/deesha-tech/react-concepts-playground/tree/main/examples/19-loaders-vs-useeffect?file=src/senior/routes.tsx) |

More examples arrive with each new episode.

Every example shows:
- a **live demo** you can click through, with a toggle between the problem and the fix
- a **network and render timeline**, so you can see what the code does, not just read about it
- the **key lines of code**, highlighted
- the **interview question** with a model answer, a 30-second version and follow-ups
- a small **challenge** to try on your own

## Run an example locally

```bash
git clone https://github.com/deesha-tech/react-concepts-playground.git
cd react-concepts-playground/examples/19-loaders-vs-useeffect
npm install
npm run dev
```

Each example is a self-contained Vite + React + TypeScript project. There is no backend: a small fake API with realistic delays stands in for the server.

## Built from the same stack as the course

React 19 · React Router 8 · TypeScript strict · Vite. These examples teach one concept each. In our **React Application Development** course you build a complete production-ready app around all of them, live: routing, data loading, auth, state management, testing, CI and deployment.

- 🚀 **React Application Development**: [deeshatechacademy.com/academy/courses/react-application-development](https://www.deeshatechacademy.com/academy/courses/react-application-development?utm_source=github&utm_medium=readme&utm_campaign=react-series&utm_content=readme)
- 🌐 **Everything else we teach**: [deeshatechacademy.com](https://www.deeshatechacademy.com/?utm_source=github&utm_medium=readme&utm_campaign=react-series)

## For contributors

The Deesha header, menu, course cards and timeline live in [`shell/`](shell). Every example has its own copy so StackBlitz can open each folder on its own. After editing `shell/`, run:

```bash
npm run sync
```

To add an example, copy an existing folder in `examples/`, change `src/episode.ts`, `package.json` and `index.html`, and replace the demo.

---

## Licence

These examples are for **learning and teaching**. You can read, run, change and share them for personal study, in classrooms and for any other non-commercial purpose. Using them in a paid course, product or service needs our written permission: contact@deeshatechacademy.com.

Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE).

---

<p align="center">© 2026 <a href="https://www.deeshatechacademy.com/?utm_source=github&utm_medium=readme&utm_campaign=react-series">Deesha Tech Academy</a> · Talent needs direction.</p>
