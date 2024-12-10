import { FC } from "react";

export const MediaProvider: FC = () => {
  return (
    <div className="audioProvider">
      <audio id="startGame" src="/sounds/start.wav" />
      <audio id="eat0" src="/sounds/eat_dot_0.wav" />
      <audio id="eat1" src="/sounds/eat_dot_1.wav" />
      <audio id="eat_ghost" src="/sounds/eat_ghost.wav" />
      <audio id="death" src="/sounds/death.wav" />
      <audio id="siren" src="/sounds/siren0.wav" loop />
      <audio id="fright" src="/sounds/fright_sound.wav" loop />
      <audio id="introSong" src="/sounds/introSong.mp3" loop />
      <audio id="extend" src="/sounds/extend.wav" />
      <audio id="gameOver" src="/sounds/intermission.wav" />
      <audio id="select" src ="/sounds/select.mp3"/>
      <audio id="roulette" src = "/sounds/roulette.mp3"/>
      <iframe
        className={"pacmanVideo"}
        height="100vh"
        width="300vw"
        src="https://www.youtube.com/embed/fH55CJQtE9M?autoplay=1&playlist=fH55CJQtE9M&end=50&mute=1&controls=0&loop=1&rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        autoFocus
      ></iframe>
      <div className={"loginScreen_gradient"}></div>
    </div>
  );
};
