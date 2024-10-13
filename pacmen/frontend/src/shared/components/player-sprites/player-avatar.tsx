import { Direction, GhostTypes, PlayerState } from "@/shared/types";
import { FC } from "react";
import { GhostSprite } from "./ghost-sprite";
import { PacmanSprite } from "./pacman-sprite";
import styles from "./player-avatar.module.css"

interface AvatarProps {
    positionX:number,
    positionY:number,
    playerNum:number,
    ghost?:boolean,
    ghostType?:GhostTypes
    state: PlayerState
    direction:Direction,
    scale?:number
    
}



export const PlayerAvatar:FC<AvatarProps> = ({positionX, positionY, playerNum, ghost, ghostType = GhostTypes.BLINKY,state,direction,scale=1}) => {
    
    return (
        <div className={styles.avatar_container} style={{left:positionX, top:positionY}}>
            <div className={styles.player_icon}>
                P{playerNum}
            </div>
            {ghost 
                ? <GhostSprite 
                state={state} 
                type={ghostType} 
                direction={direction} 
                scale={scale}/>
                : <PacmanSprite 
                state={state}
                scale={scale}
                />
            }

        </div>
    )
}