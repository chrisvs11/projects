
// enum GameItem {
//   CHERRY = '🍒',
//   POWER_UP = '🔋',
//   PELLET = '🟡'
// }

// enum CellType {
//   PACMAN_INIT,
//   GHOST_INIT,
//   BLOCK,
//   PATH
// }

// // status: porgramatic value calculatedon the backend


// const game1 = {
//   // lives: 3, 
//   uuid: 'fg515fd6fg45fd51f6',
//   startAt: '01/01/24:10:00:00',
//   endAt: '01/01/24:10:05:00', // 5MIN MAX or change if someone wins earlier
//   createdAt: '',
//   deletedAt: '',
//   maxSize:2,
//   participants: [ // lobby
//     {
//       uuid: '1g5fd61g5f5fgd5',
//       userId: 1,
//       role: GameRole.PACMAN,
//       color: 'G1DFGD'
//     },
//     {
//       uuid: '1g5fd61g5f5fgd5',
//       userId: 2,
//       role: GameRole.GHOST,
//       color: 'G1DFGD'
//     },
//     {
//       uuid: '1g5fd61g5f5fgd5',
//       // userId: 3, IF NULL THEN IS NPC
//       role: GameRole.GHOST,
//       color: 'G1DFGD'
//     }
//   ],
//   map: {
//     uuid: '',
//     templateMapId: 2,
//     cells: [
//       {
//         row: 0,
//         col: 0,
//         participants: ['1g5fd61g5f5fgd5', '1252gdf1g5f15b1gd'], // USING UUIDs
//         item: GameItem.PELLET,
//         type: CellType.PACMAN_INIT
//       },
//       {
//         row: 0,
//         col: 1,
//         participants: ['1g5fd61g5f5fgd5', '1252gdf1g5f15b1gd'], // USING UUIDs
//         item: null, // PACMAN PASSED THRU
//         type: null, // NO PATH THERE DEAD_SPACE
//       },
//     ]
//   }
// }

// const lobby = {
//   games: [
//     game1,
//     // ....
//   ]
// }
