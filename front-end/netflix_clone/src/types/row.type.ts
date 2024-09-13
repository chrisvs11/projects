import { Media } from "types";

export interface RowProps {
  title:string, 
  fetchURL:string, 
  isLargeRow?:boolean, 
  updateMovieDetail:(movie:Media) => void, 
  activateMovieDetail:(state:boolean) => void
}