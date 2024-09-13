import React, { FC, useEffect, useState } from "react";
import { MediaDetailBannerProps } from "types";
import { useStyle } from "./media-detail.style";
import { FaPlay } from "react-icons/fa";
import { BiDislike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/react";
import { useMediaDetailQuery, useMediaGenresQuery } from "shared/hooks";
import { ChapterDetail } from "../chapter-detail/chapter-detail";
import truncate from "shared/functions/truncate";




export const MediaDetailBanner:FC<MediaDetailBannerProps> = ({media,deactivateMediaDetailBanner,isMovie=true,numOfActors}) => {
  const classes = useStyle()
  const {data:mediaDetails,isError:mediaError} = useMediaDetailQuery(media!.id,isMovie)
  const {data:mediaGenres,isError:mediaGenreError} = useMediaGenresQuery(isMovie)

  //Query Control
  // useEffect(() => {
  //   console.log(`Media ${media?.id} detail query error state:${mediaError}`)
  //   console.log(`Media Genres ${media?.id} detail query error state:${mediaGenreError}`)
  // },[media, mediaError])


  useEffect(() => {
    moveToTheTop()
  },[media])

  function moveToTheTop() {
    window.scrollTo({
      top:0,
      behavior:"smooth"
    })
  }

  return(
     <header className={classes.movieBanner} data-testid="movieBanner" style={{
      backgroundSize:"cover",
      backgroundImage:`url("https://image.tmdb.org/t/p/original/${media?.backdrop_path}")`,
      backgroundPosition:"center center",
    }}>
      <button className={classes.closeBtn} data-testid="closeBtn" onClick={() => deactivateMediaDetailBanner(false)}>X</button>
      <div className={classes.movieContent} >
        <h1 className={classes.movieTitle} data-testid="movieTitle"> {media?.title || media?.name || media?.original_name}</h1>
        <div className={classes.banner_btn}>
          <button className={classes.btn}> <FaPlay/>Play </button>
          <button className={classes.icon_container}> 
            <Tooltip  hasArrow label="Not for me">
              <div><BiDislike className={classes.icon}/> </div>
            </Tooltip>
            <Tooltip hasArrow label="For me">
              <div><BiLike className={classes.icon}/></div>
            </Tooltip>
            <Tooltip hasArrow label="Add to Favorites">
              <div><FaRegHeart className={classes.icon}/></div>
            </Tooltip>
            </button>
        </div>
      </div>
      <h1 className={classes.buttonFader}>
          <div className={classes.buttonFaderContent}>
            <div style={{marginBottom:"15px", paddingLeft:"5px"}}>
              <span data-testid="category"> {isMovie?"Movie":"Series"} </span>
              <span data-testid="rating" style={{color:"#B6F6B2"}}>{media && Math.floor(media?.vote_average * 10)}% Match </span>
              <span data-testid="releaseDate" style={{color:"white"}}>{media?.release_date?.split("-")[0] || media?.first_air_date?.split("-")[0]} </span>
              <span data-testid="duration" style={{color:"white"}} > {isMovie && `Duration: ${Math.floor(mediaDetails?.runtime!/60)!==0?Math.floor(mediaDetails?.runtime!/60) + " h":""} ${mediaDetails?.runtime!%60} min`} </span>
            </div>
            <div data-testid="description" className={classes.movieDescription}>
              {truncate(media?.overview!,200)}
            </div>
          </div>
          <div className={classes.movieMetaData}>
            <div>
              <span  className={classes.title}>Cast: </span>
              {mediaDetails?.credits?.cast.length! > 0 
                ? mediaDetails?.credits?.cast.slice(0,numOfActors).map(castMember => <span data-testid="cast" key={`cast - ${castMember.name}`}> {castMember.name} </span>)
                : mediaDetails?.credits?.crew.slice(0,numOfActors).map(crewMember => <span data-testid="crew" key={`cast - ${crewMember.name}`}> {crewMember.name} </span>)}
            </div>
            <div>
              <span className={classes.title}>Genre:</span>
              {media?.genre_ids.map((id) => <span data-testid="genre" key={`genres - ${id}`}> {mediaGenres?.genres.find(genre => genre.id === id)?.name}</span>)}
            </div>
          </div>
      </h1>
      {!isMovie && 
      <div data-testid="chapterDetail" className={classes.chapter_row}> 
        <ChapterDetail seriesId={media?.id}/>
      </div>}
    </header>
  )
}