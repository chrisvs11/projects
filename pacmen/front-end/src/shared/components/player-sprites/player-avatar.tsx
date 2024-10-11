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
    ghostName?:string
    ghostAvatar?:string
    state: PlayerState
    direction?:Direction,
    scale?:number
    rotation?:number
    
}

const ghostTypeHash:{[key:string]:GhostTypes} = {
    "blinky":GhostTypes.BLINKY,
    "inky":GhostTypes.INKY,
    "pinky":GhostTypes.PINKY,
    "clyde":GhostTypes.CLYDE
}


export const PlayerAvatar:FC<AvatarProps> = ({positionX, positionY, playerNum, ghost,ghostName="blinky",state,scale=1, rotation=0,direction = Direction.RIGHT}) => {
    
    return (
        <div className={styles.avatar_container} style={{left:positionX, top:positionY}}>
            <div className={styles.player_icon}>
                P{playerNum}
            </div>
            {ghost 
                ? <GhostSprite 
                state={state} 
                type={ghostTypeHash[ghostName]} 
                direction={direction} 
                scale={scale}/>
                : <PacmanSprite 
                state={state}
                scale={scale}
                rotation={rotation}
                />
            }
        </div>
    )
}