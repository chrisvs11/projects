import { useState } from "react";

import { GameMap, LobbyType } from "../types";

const list_lobby_types: LobbyType[] = [
  LobbyType.PRIVATE,
  LobbyType.PUBLIC,
];

export const useLobbyCreation = () => {
  const [time, setTime] = useState<number>(60);
  const [lives, setLives] = useState<number>(3);
  const [players, setPlayers] = useState<number>(4);
  const [lobbyType, setLobbyType] = useState<LobbyType>(LobbyType.PRIVATE);
  const [mapIndex, setMapIndex] = useState<number>(0);
  const [gameMaps, setGameMaps] = useState<GameMap[]>();

  const settingTime = (time: number) => {
    setTime(time);
  };

  const settingLives = (lives: number) => {
    setLives(lives);
  };

  const settingPlayers = (players: number) => {
    setPlayers(players);
  };

  const settingLobbyRoomType = (index: number) => {
    setLobbyType(list_lobby_types[index]);
    const element = document.querySelector("#lobby_type") as HTMLElement;
    console.log(element)
    switch (list_lobby_types[index]) {
      case LobbyType.PRIVATE:
        element.classList.add("private");
        element.classList.remove("public")
        break;
      case LobbyType.PUBLIC:
        element.classList.add("public");
        element.classList.remove("private")
        break;
    }
  };

  return {
    lobbyType,
    players,
    time,
    lives,
    mapIndex,
    gameMaps,
    settingLobbyRoomType,
    settingPlayers,
    settingTime,
    settingLives,
    setMapIndex,
    setGameMaps,
    list_lobby_types,
  };
};
