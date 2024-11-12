import axios from "axios";

import {
  Game,
  GameCreateOptions,
  GameMoveUpdateOptions,
  GameStateUpdateOptions,
  Lobby,
  LobbyCreationOptions,
  LobbyMemberUpdateOptions,
  LoobyJoinOptions,
  Player,
  PlayerStateUpdateOptions,
} from "../types";

import { UseMutationOptions, useMutation } from "@tanstack/react-query";

const baseURL = "https://api-twqfs56djq-uc.a.run.app"; //Firebase Function API
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

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
        `${baseURL}/lobbies/join/${data.lobbyId}/${data.username}`
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
        `${baseURL}/lobbies/${data.lobbyId}/addNPC/${data.username}`
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
        `${baseURL}/lobbies/leave/${data.lobbyId}/${data.username}`
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
        `${baseURL}/games/${data.gameId}/stats/move/${data.playerNumber}`,
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
        `${baseURL}/games/${data.gameId}/stats/state/${data.playerId}/${data.state}`
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
        `${baseURL}/games/${data.gameId}/state/${data.state}`
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
        `${baseURL}/lobbies/${data.lobbyId}/${data.userIndex}/${data.ghostType}`
      );
      const response = await axios.patch(
        `${baseURL}/lobbies/${data.lobbyId}/${data.userIndex}/${data.ghostType}`
      );
      return response.data;
    },
  });
  return mutation;
};
