// // function eatItem(pacmanCurrentCell: MapCell): void {

// //     if(pacmanCurrentCell.item === GameItem.EMPTY) return 

// //     switch (pacmanCurrentCell.item) {
// //       case GameItem.CHERRY:
// //         console.log(`Pacman eat a ${GameItem.CHERRY}, got ${POINTS.CHERRY}`);
// //         this.score += POINTS.CHERRY;
// //         break;
// //       case GameItem.PELLET:
// //         console.log(`Pacman eat a ${GameItem.PELLET}, got ${POINTS.PELLET}`);
// //         this.score += POINTS.PELLET;
// //         this.numOfPellets--;
// //         break;
// //       case GameItem.POWER_UP:
// //         console.log(`Pacman eat a ${GameItem.PELLET}, got ${POINTS.PELLET}`);
// //         this.score += POINTS.POWER_UP;
// //         this.powerUp();
// //         break;
// //     }
    
// //     pacmanCurrentCell.item = GameItem.EMPTY;
// //   }

// // function  returnToNormal() {
// //     this.player.state = PlayerState.ALIVE;
// //   }

// // function powerUp() {
// //     console.log('PACMAN TIME!....GO GET THEM 😋👻');

// //     if (this.player.state !== PlayerState.PACMAN_POWER) {
// //       this.player.state = PlayerState.PACMAN_POWER;
// //     }

// //     this.powerUpActive = true;
// //     if (this.powerUpTimerId) {
// //       clearTimeout(this.powerUpTimerId);
// //     }

// //     this.powerUpTimerId = setTimeout(() => {
// //       console.log('Power up Time OUT...');
// //       this.powerUpActive = false;
// //     }, POWER_UP_TIME);
// //   }

// function  eatGhost(): void {
//     console.log('eating ghost...Jum!');
//     this.score += POINTS.GHOST;
//     console.log(`Pacman ate a ghost, got ${POINTS.GHOST} points`);
//   }

// function  caught() {
//     this.lives--;
//     console.log(`lives remaining: ${this.lives}`);
//     if (this.lives >= 0) {
//       this.restart();
//     } else {
//       this.killed();
//     }
//   }

// function 
// restart(): void {
//   const {start} = this.player.movement.coordinates
//   this.player.movement = generateMovement(null,start,null,start);;
// }

// killed() {
//     console.log('Pacman got killed...');
//     this.player.state = PlayerState.PACMAN_DEAD;
//   }
