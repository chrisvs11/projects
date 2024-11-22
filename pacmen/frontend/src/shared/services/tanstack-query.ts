import axios from "axios";

import {
  Game,
  GameCreateOptions,
  GameMoveUpdateOptions,
  GamePlayerReadyUpdate,
  GameStartOptions,
  GameStateUpdateOptions,
  Lobby,
  LobbyCreationOptions,
  LobbyMemberUpdateOptions,
  LoobyJoinOptions,
  Player,
  PlayerStateUpdateOptions,
} from "../types";

import { UseMutationOptions, useMutation } from "@tanstack/react-query";


export const BASE_URL = "https://us-central1-pacmen-e7657.cloudfunctions.net/api"; 

export const useGameCreateMutation = (
  options: UseMutationOptions<Game, Error, GameCreateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GameCreateOptions): Promise<Game> => {
      const response = await axios.post(`${BASE_URL}/games/${data.lobbyId}`);
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
      const response = await axios.post(`${BASE_URL}/lobbies`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
  });
  return mutation;
};

export const useLobbyJoinMutation = (
  options: UseMutationOptions<Lobby, Error, LoobyJoinOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LoobyJoinOptions): Promise<Lobby> => {
      const response = await axios.post(
        `${BASE_URL}/lobbies/join/${data.lobbyId}/${data.username}`,{
          headers:{
            "User-Agent":"PostmanRuntime/7.42.0",
            "Accept":"*/*"
          }
        }
      );
      return response.data;
    },
  });
  return mutation;
};

export const useAddNPCMutation =(

  options: UseMutationOptions<Lobby, Error, LoobyJoinOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LoobyJoinOptions): Promise<Lobby> => {
      const response = await axios.post(
        `${BASE_URL}/lobbies/${data.lobbyId}/addNPC/${data.username}`
      );
      return response.data;
    },
  });
  return mutation;
};

export const useLobbyLeaveMutation = (
  options: UseMutationOptions<Lobby, Error, LoobyJoinOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LoobyJoinOptions): Promise<Lobby> => {
      const response = await axios.put(
        `${BASE_URL}/lobbies/leave/${data.lobbyId}/${data.username}`
      );
      return response.data;
    },
  });
  return mutation;
};

export const useStatMoveMutation = (
  options: UseMutationOptions<Player, Error, GameMoveUpdateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GameMoveUpdateOptions): Promise<Player> => {
      const response = await axios.patch(
        `${BASE_URL}/games/${data.gameId}/stats/move/${data.playerNumber}`,
        data.move,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
  });
  return mutation;
};

export const useStatStateMutation = (
  options: UseMutationOptions<Player, Error, PlayerStateUpdateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: PlayerStateUpdateOptions): Promise<Player> => {
      const response = await axios.patch(
        `${BASE_URL}/games/${data.gameId}/stats/state/${data.playerId}/${data.state}`
      );
      return response.data;
    },
  });
  return mutation;
};

export const useGameStateMutation = (
  options: UseMutationOptions<Game, Error, GameStateUpdateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GameStateUpdateOptions): Promise<Game> => {
      const response = await axios.patch(
        `${BASE_URL}/games/${data.gameId}/state/${data.state}`
      );
      return response.data;
    },
  });
  return mutation;
};

export const useChangeGhostTypeMutation = (
  options: UseMutationOptions<Lobby, Error, LobbyMemberUpdateOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LobbyMemberUpdateOptions): Promise<Lobby> => {
      console.log(
        `${BASE_URL}/lobbies/${data.lobbyId}/${data.userIndex}/${data.ghostType}`
      );
      const response = await axios.patch(
        `${BASE_URL}/lobbies/${data.lobbyId}/${data.userIndex}/${data.ghostType}`
      );
      return response.data;
    },
  });
  return mutation;
};

export const useReadyPlayerGameMutation = (
  options: UseMutationOptions<Game, Error, GamePlayerReadyUpdate>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GamePlayerReadyUpdate): Promise<Game> => {
      const response = await axios.patch(
        `${BASE_URL}/games/${data.gameId}/${data.username}/ready`
      );
      return response.data;
    },
  });
  return mutation;
};

export const useStartGameMutation = (
  options: UseMutationOptions<Game, Error, GameStartOptions>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: GameStartOptions): Promise<Game> => {
      const response = await axios.patch(
        `${BASE_URL}/games/${data.lobbyId}/startGame/${data.gameId}`
      );
      return response.data;
    },
  });
  return mutation;
};
