// Test script to validate multiplayer setup
// Run with: node test-multiplayer.js

const { io } = require('socket.io-client');

// Test server connection
console.log('Testing multiplayer server connection...');

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('✅ Connected to server');

  // Test creating a game
  socket.emit('createGame', { playerName: 'TestPlayer', maxPlayers: 4 });

  socket.on('gameCreated', (data) => {
    console.log('✅ Game created:', data.gameId);

    // Test joining the game
    socket.emit('joinGame', { gameId: data.gameId, playerName: 'TestPlayer2' });

    socket.on('gameJoined', () => {
      console.log('✅ Game joined successfully');

      // Test bidding
      socket.emit('makeBid', { bid: 100 });

      socket.on('bidMade', (bidData) => {
        console.log('✅ Bid made:', bidData);
        console.log('🎉 Multiplayer setup test passed!');
        process.exit(0);
      });
    });
  });
});

socket.on('connect_error', (error) => {
  console.error('❌ Failed to connect to server:', error.message);
  console.log('Make sure the server is running with: cd server && npm start');
  process.exit(1);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Test timed out - server may not be running');
  process.exit(1);
}, 10000);