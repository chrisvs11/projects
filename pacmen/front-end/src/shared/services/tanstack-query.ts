import axios from "axios";

import { Game, GameCreateOptions, GameMoveCreateOptions, Lobby, LobbyCreationOptions, LoobyJoinOptions } from "../types";

import { UseMutationOptions, useMutation } from "@tanstack/react-query";

const baseURL = "http://localhost:8080";

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

  export const useLobbyCreateMutation = (
    options: UseMutationOptions<Lobby, Error, LobbyCreationOptions>
  ) => {
    const mutation = useMutation({
      ...options,
      mutationFn: async (data: LobbyCreationOptions): Promise<Lobby> => {
        const response = await axios.post(`${baseURL}/lobbies`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response.data
      },
    });
    return mutation
  };
  
  export const useLobbyJoinMutation = (
    options: UseMutationOptions<Lobby, Error, LoobyJoinOptions>
  ) => {
    const mutation = useMutation({
      ...options,
      mutationFn: async (data: LoobyJoinOptions): Promise<Lobby> => {
        const response = await axios.post(`${baseURL}/lobbies/join/${data.lobbyId}/${data.username}`);
        return response.data
      },
    });
    return mutation
  };
  
  export const useLobbyLeaveMutation = (
    options: UseMutationOptions<Lobby, Error, LoobyJoinOptions>
  ) => {
    const mutation = useMutation({
      ...options,
      mutationFn: async (data: LoobyJoinOptions): Promise<Lobby> => {
        const response = await axios.put(`${baseURL}/lobbies/leave/${data.lobbyId}/${data.username}`);
        return response.data
      },
    });
    return mutation
  };
  
  
  