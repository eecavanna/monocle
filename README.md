# Monocle

## Overview

Monocle is a `Makefile` visualizer for the web.

You can use it to view a `Makefile` as a graph of its targets and their dependencies—in your web browser.

## Limitations

Monocle has the following limitations:
- It only parses a single `Makefile` (i.e. it does not follow `include` paths).

## Technologies

Monocle is built upon the following technologies:
- Node 20
- [Vite](https://vitejs.dev/) 4
- [React](https://react.dev/) 18
- TypeScript 5
- Codemirror 6 (via [`@uiw/react-codemirror`](https://uiwjs.github.io/react-codemirror/))
- Mermaid (via [`mdx-mermaid`](https://sjwall.github.io/mdx-mermaid/))
- [Vitest](https://vitest.dev/)

This code base was bootstrapped by running:
```shell
npx --yes create-vite monacle --template react-ts
```
> The originally-generated `README.md` file has been archived to `README.bak.md`.

## Development

### Quick start

1. Install NPM dependencies
   ```shell
   npm install
   ```
2. Start development server
   ```shell
   npm run dev
   ```
3. Visit: http://localhost:5173

### Testing

```shell
npm test
```
> Tests are written using [Vitest](https://vitest.dev/).

## Roadmap

1. Apply syntax highlighting to `Makefile` content ([non-React example](https://github.com/V-Lor/codemirror-mode-makefile/blob/master/example/index.html))