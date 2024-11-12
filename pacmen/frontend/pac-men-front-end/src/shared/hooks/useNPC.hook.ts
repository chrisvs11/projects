import { Lobby } from "../types";

export const useNPC = () => {

    const getNPCName = (lobby:Lobby): string | null => {
        if (!lobby) return null;
    
        const { members, maxPlayers } = lobby;
        if (members.length >= maxPlayers) return null;
        
        const npcs: string[] = ["blinky", "pinky", "inky", "clyde"];
    
        let nameFound: boolean = false;
    
        let index: number = 0;

        while (!nameFound) {
          const currentName: string = npcs[index];
          const nameIndex = lobby!.members.findIndex(
            (member) => member.username === currentName
          );
          if (nameIndex < 0) {
            nameFound = true;
          } else {
            index++;
          }
    
          if (index >= npcs.length) {
            nameFound = true;
            console.log("No NPC left to add");
            return null;
          }
        }
    
        return npcs[index];
      };

      return ({
        getNPCName,
      })
}