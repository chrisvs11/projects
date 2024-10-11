import { useMutation, UseMutationOptions } from "@tanstack/react-query";

import axios from "axios";

import { Direction, Game } from "../types";

const baseURL = "http://localhost:8080";

interface GameCreateOptions {
  lobbyId: string;
}

interface GameMoveCreateOptions {
  playerNumber: number;
  gameId: string;
  direction: Direction;
}

export const useGameCreateMutation = (
  options: UseMutationOptions<Game, Error, GameCreateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GameCreateOptions): Promise<Game> => {
      const response = await axios.post(`${baseURL}/games/${data.lobbyId}`);
      return response.data;
    },
  });
  return mutation;
};

export const useGameMoveQueueMutation = (
  options: UseMutationOptions<Game, Error, GameMoveCreateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GameMoveCreateOptions): Promise<Game> => {
      const response = await axios.patch(
        `${baseURL}/games/${data.gameId}/${data.playerNumber}/${data.direction}`
      );
      return response.data;
    },
  });
  return mutation;
};
