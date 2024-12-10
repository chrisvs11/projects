import { Direction } from ".";

export interface GameControllerProps {
    onClick: (direction:Direction) => void;
}