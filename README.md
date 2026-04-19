# Rook

Rook is a React + Vite card game app with a home screen, settings screen, and playable game table. Now includes multiplayer functionality!

## Prerequisites

- Node.js (version 16 or higher) - [Download from nodejs.org](https://nodejs.org/)
- npm (comes with Node.js)

## Run locally (Single Player)

```bash
npm install
npm run dev
```

## Run Multiplayer

### Quick Start (Single Command)

**Windows Batch File:**
```bash
start-multiplayer.bat
```

**PowerShell Script:**
```powershell
.\start-multiplayer.ps1
```

This will automatically start both the server and client in separate windows.

### Manual Start

1. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Start the Server:**
   In one terminal:
   ```bash
   cd server
   npm start
   ```

3. **Start the Client:**
   In another terminal:
   ```bash
   npm run dev
   ```

### Test the Setup (Optional)

```bash
node test-multiplayer.js
```

This will test the server connection and basic multiplayer functionality.

- Create or join games with unique IDs
- Real-time bidding and card playing
- Multiple players can join the same game
- Server manages game state and synchronization

## Build for production

```bash
npm run build
```

## Deploy on Vercel

- Push this folder to a GitHub repository.
- Import the repo into Vercel.
- Use `npm run build` as the build command.
- Use `dist` as the output directory.

The app includes [vercel.json](C:/Users/thoma/OneDrive/Desktop/game%20hube/my%20simple%20games/Rook/vercel.json) so browser routes like `/settings` and `/game` work after deployment.

**Note:** Multiplayer functionality requires a separate server deployment for production use.
