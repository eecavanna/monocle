# Monocle

## Overview

Monocle is a `Makefile` visualizer for the web.

You can use it to view a `Makefile` as a graph of its targets and their dependencies—in your web browser.

## Limitations

Monocle has the following limitations:
- It only parses a single `Makefile` (i.e. it does not follow `include` paths).

## Technologies

Monocle is built upon the following technologies:
- Node.js v20
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- TypeScript

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
