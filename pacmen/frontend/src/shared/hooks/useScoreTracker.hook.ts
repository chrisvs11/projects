"use client";
import { GameScoresState } from './../states/scores.state';

import { useRecoilState } from "recoil";

export const useScoreTracker = () => {

    const [scores, setScores] = useRecoilState(GameScoresState)

   const addPointsToPacman = (points:number) => {
    const currentPacmanScore = scores.pacmanScore
    const finalPacmanScore = currentPacmanScore + points
    setScores(prev => ({...prev,pacmanScore: finalPacmanScore}))
  }

  const addPointsToGhosts = (points:number) => {
    const currentGhostScore = scores.ghostScore
    const finalPacmanScore = currentGhostScore + points
    setScores(prev => ({...prev,ghostScore: finalPacmanScore}))
  }

  const clearAll = () => {
    setScores({pacmanScore:0,ghostScore:0})
  }

  return {
    scores,
    addPointsToPacman,
    addPointsToGhosts,
    clearAll
  };
};
