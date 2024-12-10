import { useState } from "react";

import { GameRole, Player } from "../types";
import { myAudioProvider } from "../aux-classes";

export const useRoulette = (pacmanName: string) => {
  const [participants, setParticipants] = useState<Player[]>();
  const [, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [rouletteEnded, setRouletteEnded] = useState<boolean>(false);
  
  const randomizePacman = () => {
    setParticipants((prev) => {
      if (!prev || prev.length === 0) return;
      if (prev.length === 1) return prev;
      const length: number = prev.length;
      const pacmanIndex: number = prev.findIndex(
        (participant) => participant.role === GameRole.PACMAN
      );
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * length);
      } while (nextIndex === pacmanIndex);

      const newParticipants: Player[] = prev.map((participant, index) => {
        if (index === pacmanIndex) {
          return { ...participant, role: GameRole.GHOST };
        }
        if (index === nextIndex) {
          return { ...participant, role: GameRole.PACMAN };
        }
        return participant;
      });

      return newParticipants;
    });
  };

  // const startRoulette = (intervalTime: number, stop: number) => {
  //   const startTime = Date.now();
  //   if (timer) return;

  //   const intervalId = setInterval(() => {
  //     const elapseTime = Date.now() - startTime;
  //     randomizePacman();
  //     if (elapseTime >= stop) {
  //       clearInterval(intervalId);
  //       setTimer(null);
  //       selectFinalPacman();
  //       setRouletteEnded(true);
  //     }
  //   }, intervalTime);

  //   if (!timer) setTimer(intervalId);
  // };

  const startRoulette = (initialInterval: number, duration: number) => {
    const startTime = Date.now();
    let currentInterval = initialInterval;
    let intervalId: NodeJS.Timeout;
  
    const stepRoulette = () => {
      const elapsedTime = Date.now() - startTime;
      
      myAudioProvider.playSelectMusic()

      if (elapsedTime >= duration) {
        clearInterval(intervalId);
        selectFinalPacman(); // Select the final result
        setTimer(null);
        setRouletteEnded(true);
        return;
      }
  
      randomizePacman(); // Perform the roulette action
      // Gradually increase the interval time for the slowing effect
      currentInterval += 20; // Adjust the increment for smoother/slower deceleration
      clearInterval(intervalId);
  
      // Start a new interval with the updated time
      intervalId = setInterval(stepRoulette, currentInterval);
    };
  
    // Start the roulette
    intervalId = setInterval(stepRoulette, currentInterval);
    setTimer(intervalId);
  };

  const selectFinalPacman = () => {
    setParticipants((prev) => {
      if (!prev) return;
      return prev.map((participant) => {
        if (participant.username === pacmanName) {
          return { ...participant, role: GameRole.PACMAN };
        } else {
          return { ...participant, role: GameRole.GHOST };
        }
      });
    });
  };

  return {
    startRoulette,
    rouletteEnded,
    participants,
    setParticipants,
  };
};
