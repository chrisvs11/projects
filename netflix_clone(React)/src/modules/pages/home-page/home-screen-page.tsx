import React, { FC, useCallback, useEffect, useState } from "react";
import { useStyles } from "./home-screen.style";
import { MediaDetailBanner, Navigation, Row } from "shared/components";
import { Banner } from "modules/banner";
import { requests } from "shared/others";
import { HomeProps, Media } from "types";
import { useFilter } from "shared/hooks";

export const HomeScreen: FC<HomeProps> = ({mediaDetailInitialState=false}) => {
  const classes = useStyles();
  const [movieDetail, setMovieDetail] = useState<Media>();
  const [movieDetailState, setMovieDetailState] = useState(mediaDetailInitialState);
  const [screenSize,setScreenSize] = useState(window.innerWidth)
  const { activeFilter } = useFilter();

  const updateMovieDetail = useCallback((movie: Media) => {
    setMovieDetail(movie);
    // console.log(movieDetail)
  }, []);

  const ToggleMovieDetailState = useCallback((state: boolean) => {
    setMovieDetailState(state);
  }, []);

  useEffect(() => {

    const handleResize = () => {
      setScreenSize(window.innerWidth)
    }

    window.addEventListener("resize",handleResize)
    return(() => {
      window.removeEventListener("resize",handleResize)
    })
  },[])


  return (
    <div className={classes.homeScreen}>
      <Navigation />
      {!activeFilter.trim() && <Banner />}
      <Row
        title="NETFLIX ORIGINALS"
        fetchURL={requests.fetchNetflixOriginals}
        isLargeRow
        updateMovieDetail={updateMovieDetail}
        activateMovieDetail={ToggleMovieDetailState}
      />
      <Row
        title="TOP TRENDING"
        fetchURL={requests.fetchTrending}
        isLargeRow
        updateMovieDetail={updateMovieDetail}
        activateMovieDetail={ToggleMovieDetailState}
      />
      <Row
        title="ACTIONS MOVIES"
        fetchURL={requests.fetchActionMovies}
        updateMovieDetail={updateMovieDetail}
        activateMovieDetail={ToggleMovieDetailState}
      />
      <Row
        title="COMEDY MOVIES"
        fetchURL={requests.fetchComedyMovies}
        updateMovieDetail={updateMovieDetail}
        activateMovieDetail={ToggleMovieDetailState}
      />
      <Row
        title="HORROR MOVIES"
        fetchURL={requests.fetchHorrorMovies}
        updateMovieDetail={updateMovieDetail}
        activateMovieDetail={ToggleMovieDetailState}
      />
      <Row
        title="ROMANCE MOVIES"
        fetchURL={requests.fetchRomanceMovies}
        updateMovieDetail={updateMovieDetail}
        activateMovieDetail={ToggleMovieDetailState}
      />
      {movieDetailState && (
        <MediaDetailBanner
          media={movieDetail}
          movieDetailState={movieDetailState}
          deactivateMediaDetailBanner={ToggleMovieDetailState}
          isMovie={movieDetail?.release_date ? true : false}
          numOfActors={screenSize >= 1200 ? 3 : 1}
        />
      )}
    </div>
  );
};
