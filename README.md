# Top-up calculator for Steam Wallet

A simple application for calculating the replenishment of the Steam Wallet via
WebMoney (WMZ tokens).

Backend:

- Tauri

Frontend:

- Vue
- Vuetify

## Development

Install dependencies:

```
npm i
```

Run Vue Devtools:

```
npm run devtools
```

Build and run app (debug mode):

```
npm run tauri dev
```

## Build

Build release (standalone executable + installer):

```
npm run tauri build
```

See `src-tauri/target/release` folder.
