import {
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";

import axios from "axios";

import { Lobby, LobbyType } from "../types";

const baseURL = "http://localhost:8080";

export interface LobbyCreationProps {
  maxPlayers: number;
  type: LobbyType;
  hostUsername: string;
  mapId: string;
  playtime: number;
  lives: number;
}

export interface LoobyJoinProps {
  username:string,
  lobbyId:string
}

export const useLobbyCreateMutation = (
  options: UseMutationOptions<Lobby, Error, LobbyCreationProps>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LobbyCreationProps): Promise<Lobby> => {
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
  options: UseMutationOptions<Lobby, Error, LoobyJoinProps>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LoobyJoinProps): Promise<Lobby> => {
      const response = await axios.post(`${baseURL}/lobbies/join/${data.lobbyId}/${data.username}`);
      return response.data
    },
  });
  return mutation
};

export const useLobbyLeaveMutation = (
  options: UseMutationOptions<Lobby, Error, LoobyJoinProps>
) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async (data: LoobyJoinProps): Promise<Lobby> => {
      const response = await axios.put(`${baseURL}/lobbies/leave/${data.lobbyId}/${data.username}`);
      return response.data
    },
  });
  return mutation
};


