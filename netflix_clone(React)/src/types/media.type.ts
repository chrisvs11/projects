export interface Media {
  poster_path?:string,
  overview:string,
  id:number,
  name?:string,
  title?:string,
  original_language?:string
  backdrop_path?:string
  original_name?:string
  original_title?:string
  popularity?:number
  release_date?:string
  genre_ids:number[]
  first_air_date?:string
  vote_average:number


}

export interface MediaQueryResponse {
  page:number,
  results:Media[]
}