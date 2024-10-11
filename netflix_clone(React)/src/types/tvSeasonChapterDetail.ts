export interface TVSeasonChapterDetail {
  episodes:{
    id:number
    name:string,
    overview:string,
    still_path:string,
    episode_number:number,
    runtime:number
  }[]
}