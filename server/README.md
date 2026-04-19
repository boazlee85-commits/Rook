# Rook Multiplayer Server

This is the backend server for the Rook card game multiplayer functionality.

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
npm start
```

The server will run on http://localhost:3001

## Development

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

## API

The server uses Socket.io for real-time communication. Main events:

### Client -> Server
- `createGame`: Create a new game
- `joinGame`: Join an existing game
- `makeBid`: Make a bid during bidding phase
- `selectTrump`: Select trump suit
- `discardCards`: Discard cards after winning bid
- `playCard`: Play a card during the playing phase

### Server -> Client
- `gameCreated`: Game successfully created
- `gameJoined`: Successfully joined a game
- `playerJoined`: Another player joined the game
- `gameStarted`: Game has started with all players
- `bidMade`: A bid was made
- `trumpSelected`: Trump suit was selected
- `cardsDiscarded`: Cards were discarded
- `cardPlayed`: A card was played
- `playerLeft`: A player left the game

## Game Flow

1. Players create or join games
2. Once all players join, bidding starts
3. Players bid or pass
4. Winner selects trump suit
5. Winner discards cards
6. Players take turns playing cards
7. Tricks are won and scored
8. Game continues until completion