import {
  useGameCreateMutation,
  useGameStateMutation,
  useLobbyCreateMutation,
  useLobbyJoinMutation,
  useLobbyLeaveMutation,
  useStatMoveMutation,
  useStatStateMutation,
  useChangeGhostTypeMutation,
  useAddNPCMutation
} from "../services/tanstack-query";

import { useRouter } from "next/navigation";

import { Game, Lobby } from "../types";

export const useCustomQuery = () => {
  const router = useRouter()

  const { mutate: moveYourAvatar } = useStatMoveMutation({
    onError: () => {
      console.log("error moving your avatar");
    },
  });

  const { mutate: modifyPlayerState } = useStatStateMutation({
    onSuccess:(data) => {
      console.log(`states modified`, data)
    },
    onError: () => {
      console.log("update State not send successfully");
    },
  });

  const { mutate: leaveLobby } = useLobbyLeaveMutation({
    onError: () => {
      console.error("Error exiting the lobby");
    },
  });

  const { mutate: joinLobby } = useLobbyJoinMutation({
    onSuccess: () => {
      console.log("added npc");
    },
    onError: () => {
      console.error("Error adding npc");
    },
  });

  const { mutate: createGame } = useGameCreateMutation({
    onSuccess: (data: Game,{lobbyId}) => {
      console.log("Game created");
      router.push(`${lobbyId}/game/${data.id}`);

    },
    onError: (e) => {
      console.error("Error creating the game", e.message);
    },
  });

  const { mutate:createLobby } = useLobbyCreateMutation({
    onSuccess: (data: Lobby) => {
      router.push(`${data.id}`);
      console.log("Data successfully sent to database");
      const audio = document.getElementById("audio") as HTMLAudioElement;
      audio.pause();
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      const audio = document.getElementById("audio") as HTMLAudioElement;
      audio.pause();
    },
  });

  const {mutate:updateGameState} = useGameStateMutation({
    onSuccess: () => {
      console.log("Game State Updated Successfully")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  const {mutate:updateGhostType} = useChangeGhostTypeMutation({
    onSuccess: () => {
      console.log("Game State Updated Successfully")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  const {mutate:addNPCToLobby} = useAddNPCMutation({
    onSuccess: () => {
      console.log("Game State Updated Successfully")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  return {
    moveYourAvatar,
    modifyPlayerState,
    leaveLobby,
    joinLobby,
    createGame,
    createLobby,
    updateGameState,
    updateGhostType,
    addNPCToLobby
  };
};
