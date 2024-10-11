// interface Player {
//   x: number;
//   y: number;
// }

// interface GameState {
//   players: { [key: string]: Player };
// }

// export class Game {
//   private gameState: GameState = { players: {} };
//   private intervalId: NodeJS.Timeout;

//   constructor(private gameId: string, private server: any) {
//     this.startGameLoop();
//   }

//   addPlayer(playerId: string) {
//     this.gameState.players[playerId] = { x: 0, y: 0 };
//   }

//   removePlayer(playerId: string) {
//     delete this.gameState.players[playerId];
//   }

//   handlePlayerMovement(playerId: string, direction: string) {
//     const player = this.gameState.players[playerId];
//     this.updatePlayerPosition(player, direction);
//   }

//   private startGameLoop() {
//     this.intervalId = setInterval(() => {
//       Object.values(this.gameState.players).forEach((player) => {
//         const directions = ['up', 'down', 'left', 'right'];
//         const randomDirection = directions[Math.floor(Math.random() * directions.length)];
//         this.updatePlayerPositionByDirection(player, randomDirection);
//       });
//       this.broadcastGameState();
//     }, 1000);
//   }

//   private updatePlayerPosition(player: Player, direction: string) {
//     this.updatePlayerPositionByDirection(player, direction);
//   }

//   private updatePlayerPositionByDirection(player: Player, direction: string) {
//     switch (direction) {
//       case 'up':
//         player.y -= 1;
//         break;
//       case 'down':
//         player.y += 1;
//         break;
//       case 'left':
//         player.x -= 1;
//         break;
//       case 'right':
//         player.x += 1;
//         break;
//     }
//   }

//   private broadcastGameState() {
//     this.server.emit(game_update_${this.gameId}, this.gameState);
//   }
// }
// import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Game } from './game.class';

// @WebSocketGateway()
// export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;
//   private games: { [key: string]: Game } = {};

//   afterInit(server: Server) {}

//   handleConnection(client: Socket) {}

//   handleDisconnect(client: Socket) {
//     for (const gameId in this.games) {
//       this.games[gameId].removePlayer(client.id);
//     }
//   }

//   @SubscribeMessage('join_game')
//   handleJoinGame(client: Socket, payload: { gameId: string }) {
//     const { gameId } = payload;
//     if (!this.games[gameId]) {
//       this.games[gameId] = new Game(gameId, this.server);
//     }
//     this.games[gameId].addPlayer(client.id);
//     client.join(gameId);
//     client.emit('init', this.games[gameId]);
//   }

//   @SubscribeMessage('move')
//   handleMove(client: Socket, payload: { gameId: string; direction: string }) {
//     const { gameId, direction } = payload;
//     if (this.games[gameId]) {
//       this.games[gameId].handlePlayerMovement(client.id, direction);
//     }
//   }
// }
// const socket = io('http://localhost:3000');

// function joinGame(gameId) {
//   socket.emit('joingame', { gameId });
// }

// socket.on('init', (gameState) => {
//   renderGame(gameState);
// });

// socket.on('game_update' + gameId, (gameState) => {
//   renderGame(gameState);
// });

// function sendPlayerMove(direction) {
//   socket.emit('move', { gameId, direction });
// }

// function renderGame(gameState) {
//   const canvas = document.getElementById('gameCanvas');
//   const context = canvas.getContext('2d');

//   context.clearRect(0, 0, canvas.width, canvas.height);

//   Object.values(gameState.players).forEach((player) => {
//     context.fillRect(player.x * 10, player.y * 10, 10, 10);
//   });
// }

// document.addEventListener('keydown', (event) => {
//   switch (event.key) {
//     case 'ArrowUp':
//       sendPlayerMove('up');
//       break;
//     case 'ArrowDown':
//       sendPlayerMove('down');
//       break;
//     case 'ArrowLeft':
//       sendPlayerMove('left');
//       break;
//     case 'ArrowRight':
//       sendPlayerMove('right');
//       break;
//   }
// });

// // Join a game with a specific gameId (for demonstration purposes, we'll use a hardcoded gameId)
// const gameId = 'game1';
// joinGame(gameId);