import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Game events
    newSocket.on('gameCreated', (data) => {
      setGameState(data.gameState);
      setCurrentPlayer(data.gameState.players[0]);
    });

    newSocket.on('gameJoined', (data) => {
      setGameState(data.gameState);
      setCurrentPlayer(data.playerName);
    });

    newSocket.on('playerJoined', (data) => {
      setGameState(data.gameState);
    });

    newSocket.on('gameStarted', (data) => {
      setGameState(data);
    });

    newSocket.on('bidMade', (data) => {
      setGameState(data);
    });

    newSocket.on('trumpSelected', (data) => {
      setGameState(data);
    });

    newSocket.on('cardsDiscarded', (data) => {
      setGameState(data);
    });

    newSocket.on('cardPlayed', (data) => {
      setGameState(data);
    });

    newSocket.on('playerLeft', (data) => {
      setGameState(data.gameState);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const createGame = (playerName, numPlayers) => {
    socket?.emit('createGame', { playerName, numPlayers });
  };

  const joinGame = (gameId, playerName) => {
    socket?.emit('joinGame', { gameId, playerName });
  };

  const makeBid = (bid) => {
    socket?.emit('makeBid', { bid });
  };

  const selectTrump = (trumpColor) => {
    socket?.emit('selectTrump', { trumpColor });
  };

  const discardCards = (cardsToDiscard) => {
    socket?.emit('discardCards', { cardsToDiscard });
  };

  const playCard = (card) => {
    socket?.emit('playCard', { card });
  };

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      gameState,
      currentPlayer,
      createGame,
      joinGame,
      makeBid,
      selectTrump,
      discardCards,
      playCard
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};