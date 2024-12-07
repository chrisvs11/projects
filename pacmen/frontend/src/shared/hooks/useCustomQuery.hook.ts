import {
  useGameCreateMutation,
  useGameStateMutation,
  useLobbyCreateMutation,
  useLobbyJoinMutation,
  useLobbyLeaveMutation,
  useStatMoveMutation,
  useStatStateMutation,
  useChangeGhostTypeMutation,
  useAddNPCMutation,
  useReadyPlayerGameMutation,
  useStartGameMutation
} from "../services/tanstack-query";

import { useRouter } from "next/navigation";

import { Game, Lobby } from "../types";

export const useCustomQuery = () => {
  const router = useRouter()

  const { mutate: moveYourAvatar } = useStatMoveMutation({
    onSuccess:() => {
      console.log("movement send successfully")
    },
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
      router.push(`${lobbyId}/gamePrep/${data.id}`);
    },
    onError: (e) => {
      console.error("Error creating the game", e.message);
    },
  });

  const { mutate:createLobby } = useLobbyCreateMutation({
    onSuccess: (data: Lobby) => {
      router.push(`${data.id}`);
      const audio = document.getElementById("audio") as HTMLAudioElement;
      audio.pause();
      return true
      
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      const audio = document.getElementById("audio") as HTMLAudioElement;
      audio.pause();
      return error
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

  const {mutate:readyPlayer} = useReadyPlayerGameMutation({
    onSuccess: () => {
      console.log("Player Ready")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  const {mutate:startGame} = useStartGameMutation({
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
    addNPCToLobby,
    readyPlayer,
    startGame,
  };
};
