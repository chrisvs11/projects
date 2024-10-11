import React, { FC, useCallback, useEffect, useState } from "react";
import { useStyles } from "./banner.style";
import { requests } from "shared/others";
import { Media } from "types";
import { useMediaQuery } from "shared/hooks";
import truncate from "shared/functions/truncate";



export const Banner:FC = () => {
  
  const classes = useStyles()
  const [movie,setMovie] = useState<Media>()
  const {data:mediaQuery,isError} = useMediaQuery(requests.fetchTrending,"Top Trending")

  // //QueryControl 
  // useEffect(() => {
  //   console.log(`The movie banner data query error state: ${isError}`)
  // },[isError])


  useEffect(() => { 
  //  setMovie(mediaQuery?.results[Math.floor(Math.random()*mediaQuery.results?.length-1)])
   setMovie(mediaQuery?.results[2])

  },[mediaQuery])

  
  return (
    <header data-testid="header" className={classes.banner} style={{
      backgroundSize:"cover",
      backgroundImage:`url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
      backgroundPosition:"50% 50%",
    }}>
      
      <div data-testid="bannerContents" className={classes.bannerContents}>
        <h1 data-testid="bannerTitle" className={classes.bannerTitle}>{movie?.title || movie?.name || movie?.original_name}</h1>
        <div className="banner_buttons">
          <button className={classes.bannerButton}> Play </button>
          <button className={classes.bannerButton}> My List </button>
        </div>
        <h1 data-testid="bannerDescription" className={classes.bannerDescription}>{movie && truncate(movie?.overview!,300)}</h1>
      </div>
        <div className={classes.bannerFadeButton}/> 
    </header>
  )
}