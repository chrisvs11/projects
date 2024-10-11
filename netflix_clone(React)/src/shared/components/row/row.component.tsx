import React, { FC, useCallback, useEffect} from "react";
import { useStyle } from "./row.style";
import { Media, RowProps } from "types";
import { useFilter, useMediaQuery } from "shared/hooks";
import {SearchFunction} from "shared/functions/search-function";



export const Row:FC<RowProps> = ({title,fetchURL,isLargeRow = false,updateMovieDetail, activateMovieDetail}) => {
  const classes = useStyle()
  const baseImageURL = "https://image.tmdb.org/t/p/original"
  const {activeFilter} = useFilter()
  const {data:mediaQuery,isError} = useMediaQuery(fetchURL,title)
  
  // //Query Control
  // useEffect(() => {
  //   console.log(`row ${title} query error: ${isError}`)},[title,isError])
    
  const clickHandler = useCallback((media:Media) => {
    updateMovieDetail(media)
    activateMovieDetail(true)
  },[updateMovieDetail,activateMovieDetail])

  return(
    <div data-testid="row" className={classes.row}>
      <h2>{title}</h2>
      <div className={classes.rowPosters}>
        {SearchFunction(mediaQuery?.results!,activeFilter).length > 0 ? SearchFunction(mediaQuery?.results!,activeFilter).map((media:Media) => (
          ((isLargeRow && media.poster_path) ||
          (!isLargeRow && media.backdrop_path)) && (
          <img data-testid = "poster" className={`${classes.rowPoster} ${isLargeRow && classes.rowPosterLarge}`}
            src={baseImageURL + `${isLargeRow? media.poster_path : media.backdrop_path}`} 
            alt={media.name}
            key={media.id}
            onClick={() => clickHandler(media)}
            />)
        )):<p>Not found in this category</p>}
      </div>
    </div>
  )
}