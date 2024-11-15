import { AudioHandler } from ".";
export class GameAudios {

  private eatSoundToggle:number

  constructor() {
    this.eatSoundToggle = 0
  }

  startGameMusic = ():void => {
    const audio: HTMLElement | null = document.getElementById("startGame");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.play();
    }
  };

  eatPelletMusic = ():void => {
    const eatIds: string[] = ["eat0", "eat1"];
    const index = this.eatSoundToggle % eatIds.length;
    const audio: HTMLElement | null = document.getElementById(
      `${eatIds[index]}`
    );
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.play();
      this.eatSoundToggle++;
    }
  };

  ghostSirenMusicStart = ():void => {
    const audio: HTMLElement | null = document.getElementById("siren");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.setLoopState(true);
      audioHandler.play();
    }
  };

  ghostSirenMusicStop = ():void => {
    const audio: HTMLElement | null = document.getElementById("siren");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.setLoopState(true);
      audioHandler.stop();
    }
  };

  frightMovingMusicStart = ():void => {
    const audio: HTMLElement | null = document.getElementById("fright");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.setLoopState(true);
      audioHandler.play();
    }
  };

  frightMovingMusicStop = ():void => {
    const audio: HTMLElement | null = document.getElementById("fright");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.stop();
    }
  };

  eatGhostMusicStart = ():void => {
    const audio: HTMLElement | null = document.getElementById("eat_ghost");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.play();
    }
  };

  deathPacmanMusicStart = ():void => {
    const audio: HTMLElement | null = document.getElementById("death");
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement);
      audioHandler.play();
    }
  }

  introSongMusicStart = ():void => {
      const audio:HTMLElement | null = document.getElementById("introSong") 
      if (audio) {
        const audioHandler = new AudioHandler(audio as HTMLAudioElement)
        audioHandler.play()
      } 
    }

  introSongMusicStop = ():void => {
      const audio:HTMLElement | null = document.getElementById("introSong") 
      if (audio) {
        const audioHandler = new AudioHandler(audio as HTMLAudioElement)
        audioHandler.stop()
      }  
  }

  stopAllMusic = ():void => {
    const audios:HTMLCollectionOf<HTMLAudioElement> = document.getElementsByTagName("audio")
    console.log("Stopping all music")
    for(let i = 0; i < audios.length;i++){
      audios[i].pause()
    }
  }

  playPowerUpSounds = (time:number) => {
    this.frightMovingMusicStart();
    this.ghostSirenMusicStop();
    setTimeout(() => {
      this.ghostSirenMusicStart();
    }, time);
  } 

  gameOverMusicStart = () => {
    const audio:HTMLElement | null = document.getElementById("gameOver") 
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement)
      audioHandler.play()
    }  
  }

  playExtendMusic = () => {
    const audio:HTMLElement | null = document.getElementById("extend") 
    console.log("extend",audio)
    if (audio) {
      const audioHandler = new AudioHandler(audio as HTMLAudioElement)
      audioHandler.play()
    }  
  }

};
