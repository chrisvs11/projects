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

import { Lobby } from "../types";



export const useCustomQuery = () => {
  
  const { mutateAsync: sendMove } = useStatMoveMutation({
    onSuccess:() => {
      console.log("movement send successfully")
    },
    onError: () => {
      console.log("error moving your avatar");
    },
  });

  const { mutateAsync: modifyPlayerState } = useStatStateMutation({
    onSuccess:(data) => {
      console.log(`states modified`, data)
    },
    onError: () => {
      console.log("update State not send successfully");
    },
  });

  const { mutateAsync: leaveLobby } = useLobbyLeaveMutation({
    onSuccess:() => {
      console.log("Success Leaving the lobby")
    },
    onError: () => {
      console.error("Error exiting the lobby");
    },
  });

  const { mutateAsync: joinLobby } = useLobbyJoinMutation({
    onSuccess: (data) => {
      console.log("added npc");
      return data
    },
    onError: (error) => {
      console.error("Error adding npc", error.message);
    },
  });

  const { mutateAsync: createGame } = useGameCreateMutation({
    onSuccess: () => {
    },
    onError: (e) => {
      console.error("Error creating the game", e.message);
    },
  });

  const { mutateAsync:createLobby } = useLobbyCreateMutation({
    onSuccess: (data: Lobby) => {
      return data
    },
    onError: (error) => {
      console.error("Mutation error:", error);
 
    },
  });

  const {mutateAsync:updateGameState} = useGameStateMutation({
    onSuccess: () => {
      console.log("Game State Updated Successfully")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  const {mutateAsync:updateGhostType} = useChangeGhostTypeMutation({
    onSuccess: () => {
      console.log("Game State Updated Successfully")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  const {mutateAsync:addNPCToLobby} = useAddNPCMutation({
    onSuccess: () => {
      console.log("Game State Updated Successfully")
    },
    onError:(error) => {
      console.error(error)
    }
  })

  const {mutateAsync:readyPlayer} = useReadyPlayerGameMutation({
    onSuccess: () => {
      return true
    },
    onError:(error) => {
      console.error(error)
      return false
    }
  })

  const {mutateAsync:startGame} = useStartGameMutation({
  })

  return {
    sendMove,
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
