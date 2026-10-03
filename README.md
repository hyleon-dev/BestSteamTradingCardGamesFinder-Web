# Best Steam Trading Card Games Finder - Web Version

Web version of [Best Steam Trading Card Games Finder](https://github.com/hyleon-dev/BestSteamTradingCardGamesFinder) using Vite + React + Bootstrap.

Small project for learning purposes.

**Live:** [bstcgf.hyleon.dev](https://bstcgf.hyleon.dev/)

## What it does

Some Steam games drop trading cards. You can sell these cards on the Steam Community Market.
This tool finds games that give you many cards for a low store price.

1. It loads the list of all games with trading cards from [SteamCardExchange](https://www.steamcardexchange.net/).
2. It loads the current store price for each game from the Steam Store API, in batches of 100 games.
3. It calculates a score for each game and sorts the list. The best games are at the top.

### Score

```
score = current price in cents / number of cards in the set
```

A lower score is better. Example: a game for 0,49 € with 15 cards has a score of 49 / 15 = 3.27.

The tool skips free games, games without a price and games without card data.

## Features

- Loads all games with trading cards (approx. 14,000) and shows the progress
- Sorts the games by score
- Search by game name
- Links to the Steam Store and SteamDB page of each game
- Renders the list in pages while you scroll, so the page stays fast

### Planned

- Ignore games
- Profiles with status filters (purchased, wishlisted, ignored)
- Shop region selection (prices are in EUR at the moment)

## Tech stack

- [Vite](https://vite.dev/) + [React](https://react.dev/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [react-infinite-scroll-component](https://github.com/ankeetmaini/react-infinite-scroll-component)
- [Cloudflare Pages](https://pages.cloudflare.com/) for hosting and [Pages Functions](https://developers.cloudflare.com/pages/functions/) as API proxy

## How it works

The browser cannot call the SteamCardExchange and Steam APIs directly because of CORS. A small proxy
handles these requests:

| Route                | Target                                                       | Local dev (`vite.local.config.js`) | Production (`functions/`)   |
|----------------------|--------------------------------------------------------------|------------------------------------|-----------------------------|
| `/steamcardexchange` | `steamcardexchange.net/api/request.php?GetBadgePrices_Guest` | Vite dev server proxy              | `steamcardexchange.js`      |
| `/steam?appids=...`  | `store.steampowered.com/api/appdetails` (`cc=DE`)            | Vite dev server proxy              | `steam.js`                  |

## Project structure

```
functions/          Cloudflare Pages Functions (API proxy for production)
public/             Static files (favicon, CNAME)
src/
  App.jsx           Data loading, scoring, search and list
  Game.jsx          Game card
  *.css             Styles
vite.config.js        Build config (production)
vite.local.config.js  Dev config with API proxy
```

## Development

Requirements: [Node.js](https://nodejs.org/) (current LTS or newer)

```bash
npm install
npm run dev       # Start dev server with API proxy
npm run lint      # Run ESLint
npm run build     # Build for production into dist/
npm run preview   # Preview the production build
```

Note: `npm run preview` has no API proxy. The data loading works only with `npm run dev` or on Cloudflare Pages.

## Deployment

The site runs on Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`
- The `functions/` directory is deployed automatically as Pages Functions.

## Credits

- Card data: [SteamCardExchange](https://www.steamcardexchange.net/)
- Prices and images: [Steam](https://store.steampowered.com/)

This project is not affiliated with Valve or Steam.
