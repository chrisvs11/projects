import { movieService } from "shared/services";

// console.log(movieService.keyApi)

export const requests = {
  fetchTrending:`/trending/all/week?api_key=${movieService.keyApi}&language=en-US`,
  fetchNetflixOriginals:`/discover/tv?api_key=${movieService.keyApi}&with_networks=213&`,
  fetchTopRated:`/movie/top_rated?api_key=${movieService.keyApi}&language=en-US`,
  fetchActionMovies:`/discover/movie?api_key=${movieService.keyApi}&with_genres=28`,
  fetchComedyMovies:`/discover/movie?api_key=${movieService.keyApi}&with_genres=35`,
  fetchHorrorMovies:`/discover/movie?api_key=${movieService.keyApi}&with_genres=27`,
  fetchRomanceMovies:`/discover/movie?api_key=${movieService.keyApi}&with_genres=10749`,
  fetchDocumentaries:`/discover/movie?api_key=${movieService.keyApi}&with_genres=99`,
  fetchMovieGenres:`/genre/movie/list?api_key=${movieService.keyApi}`,  
  fetchTVGenres:`/genre/movie/list?api_key=${movieService.keyApi}`,
}

