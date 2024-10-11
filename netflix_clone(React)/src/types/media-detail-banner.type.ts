import { Genre } from "./genre.type";
import { Media } from "./media.type";

export interface MediaDetailBannerProps {
  media?:Media
  movieDetailState:boolean
  deactivateMediaDetailBanner:(state:boolean) => void
  isMovie?:boolean
  numOfActors:number,
}