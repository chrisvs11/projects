import { useQuery } from "@tanstack/react-query";
import { movieService } from "shared/services";
import { MediaDetail, MediaGenresQuery, MediaQueryResponse, TVSeasonChapterDetail, TVSeasonsQueryFormat } from "types";
 

const baseUrl:string = "https://api.themoviedb.org/3"

export const useMediaQuery = (url:string,title:string) => {

  const query = useQuery<MediaQueryResponse>({
    queryKey:["trending",title],
    networkMode:"online",
    queryFn: async() => {
      const response = await fetch(baseUrl + url )
      const movieResponse = await response.json()
      return movieResponse
    }
  })

  return query
}

export const useMediaDetailQuery = (mediaId:number,isMovie:boolean) => {

  const query = useQuery<MediaDetail>({
    queryKey:[isMovie?"Movie":"Series", mediaId],
    networkMode:"online",
    queryFn: async() => {
      const response = await fetch(baseUrl+ `/${isMovie?"movie":"tv"}/${mediaId}?api_key=${movieService.keyApi}&append_to_response=credits&language=en-US`)
      const movieDetail = await response.json()
      return movieDetail
    }
  })
  
  return query
}

export const useMediaGenresQuery = (isMovie:boolean) => {

  const query = useQuery<MediaGenresQuery>({
    queryKey:[isMovie?"movieGenres":"tvGenres"],
    networkMode:"online",
    queryFn: async() => {
      const response = await fetch( baseUrl + `/genre/${isMovie?"movie":"tv"}/list?api_key=${movieService.keyApi}`)
      const mediaGenre = await response.json()
      return mediaGenre
    }
  })
  return query
}

export const useTVSeasonsQuery = (seriesId:number) => {
  
  const query = useQuery<TVSeasonsQueryFormat>({
    queryKey:["seasons", seriesId],
    networkMode:"online",
    queryFn: async() => {
      const response = await fetch ( baseUrl + `/tv/${seriesId}?api_key=${movieService.keyApi}` )
      const data = await response.json()
      return data
    }
  })

  return query
}

export const useTVSeasonChaptersDetail = (seasonNumber:number,seriesId:number) => {

  const query = useQuery<TVSeasonChapterDetail>({
    queryKey:[seasonNumber,seriesId],
    networkMode:"online",
    queryFn: async() => {
      const response = await fetch(baseUrl + `/tv/${seriesId}/season/${seasonNumber}?api_key=${movieService.keyApi}`)
      const data = await response.json()
      return data
    }
  })

  return query

}