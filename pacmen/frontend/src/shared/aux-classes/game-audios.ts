import { AudioHandler } from ".";
class GameAudios {
  
  private vol: number = 0.2;
  private eatSoundToggle: number;

  constructor() {
    this.eatSoundToggle = 0;
  }

  private musicController = (
    play: boolean,
    audioElement: HTMLAudioElement,
    volume: number = this.vol
  ) => {
    const audioHandler = new AudioHandler(audioElement);
    if (play) {
      audioHandler.play(volume);
    } else {
      audioHandler.stop();
    }
  };

  setVolumeAll = (vol:number): void => {
    const audios: HTMLCollectionOf<HTMLAudioElement> =
      document.getElementsByTagName("audio");
      this.vol = vol
    for (let i = 0; i < audios.length; i++) {
      audios[i].volume = vol;
    }
  };

  playStartGameMusic = (play: boolean): void => {
    const audio: HTMLElement | null = document.getElementById("startGame");
    if (!audio) return;
    this.musicController(play, audio as HTMLAudioElement);
  };

  playEatPelletSound = (): void => {
    const eatIds: string[] = ["eat0", "eat1"];
    const index = this.eatSoundToggle % eatIds.length;
    const audio: HTMLElement | null = document.getElementById(
      `${eatIds[index]}`
    );
    this.musicController(true, audio as HTMLAudioElement);
    this.eatSoundToggle++;
  };

  playGhostSirenSound = (play: boolean): void => {
    const audio: HTMLElement | null = document.getElementById("siren");
    if (!audio) return;
    this.musicController(play, audio as HTMLAudioElement);
  };

  playFrightSound = (play: boolean): void => {
    const audio: HTMLElement | null = document.getElementById("fright");
    if (!audio) return;
    this.musicController(play, audio as HTMLAudioElement);
  };

  playEatGhostSound = (): void => {
    const audio: HTMLElement | null = document.getElementById("eat_ghost");
    if (!audio) return;
    this.musicController(true, audio as HTMLAudioElement);
  };

  playDeathPacmanMusic = (): void => {
    const audio: HTMLElement | null = document.getElementById("death");
    if (!audio) return;
    this.musicController(true, audio as HTMLAudioElement);
  };

  playIntroSongMusic = (play: boolean): void => {
    const audio: HTMLElement | null = document.getElementById("introSong");
    if (!audio) return;
    this.musicController(play, audio as HTMLAudioElement);
  };

  playPowerUpSounds = (time: number) => {
    this.playFrightSound(true);
    this.playGhostSirenSound(false);
    setTimeout(() => {
      this.playGhostSirenSound(false);
    }, time);
  };

  stopAllMusic = (): void => {
    const audios: HTMLCollectionOf<HTMLAudioElement> =
      document.getElementsByTagName("audio");
    for (let i = 0; i < audios.length; i++) {
      audios[i].pause();
    }
  };

  playGameOverMusic = () => {
    const audio: HTMLElement | null = document.getElementById("gameOver");
    if (!audio) return;
    this.musicController(true,audio as HTMLAudioElement)
  };

  playExtendMusic = () => {
    const audio: HTMLElement | null = document.getElementById("extend");
    if(!audio) return
    this.musicController(true,audio as HTMLAudioElement)
  };

  playSelectMusic = () => {
    const audio: HTMLElement | null = document.getElementById("select");
    if(!audio) return
    this.musicController(true,audio as HTMLAudioElement)
  }

  playRouletteMusic = () => {
    const audio: HTMLElement | null = document.getElementById("roulette");
    if(!audio) return
    this.musicController(true,audio as HTMLAudioElement)
  }

}


export const myAudioProvider = new GameAudios()