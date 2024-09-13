import React, { FC, useCallback, useEffect, useState } from "react";
import { useStyles } from "./chapter-detail.style";
import { useTVSeasonChaptersDetail, useTVSeasonsQuery } from "shared/hooks";

interface ChapterDetailProps {
  seriesId?: number;
  seasonNumber?: number;
}

export const ChapterDetail: FC<ChapterDetailProps> = ({ seriesId = 0 }) => {
  const classes = useStyles();
  const [seasonNumber, setSeasonNumber] = useState<number>(1);
  const { data: tvSeasons, isError } = useTVSeasonsQuery(seriesId);
  const { data: seasonChapters } = useTVSeasonChaptersDetail(
    seasonNumber,
    seriesId
  );

  useEffect(() => {
    setSeasonNumber(1)
    document.querySelector("select")!.value = "1"
  },[seriesId])

  const truncateText = useCallback((text: string, n: number): string => {

    return (text.length>=n?`${text.slice(0, n)}...`:text);
  }, []);

  return (
    <>
      {!isError && (
        <div className={classes.chapterDetail} data-testid="chapter-detail">
          <select className={classes.seasonSelector} key={"select-0"} onChange={(e) => setSeasonNumber(Number(e.target.value))} data-testid="select">
            {tvSeasons?.seasons.map((season) => {
              if (season.season_number !== 0) {
                return (
                  <option value={season.season_number} key={`select -${season.season_number}`} data-testid="option">
                    Season Number {season.season_number}
                  </option>
                );
              } else {
                return <></>
              }
            })}
          </select>
          {seasonChapters?.episodes.map((episode, i) => {
            if(episode.name && episode.still_path && episode.overview){
              return(
                <div key={`${episode} - ${i}`} className={classes.chapterDetail_body} data-testid="episode">
                  <img
                    className={classes.chapter_image}
                    src={`https://image.tmdb.org/t/p/original/${episode.still_path}`}
                    alt="Not Found"
                  />
                  <div className={classes.chapter_rightBody}>
                    <p className={classes.chapterTitle}>
                      {i + 1}. {episode.name}, Duration: {episode.runtime} min
                    </p>
                    <p className={classes.chapterOverview}>
                        {truncateText(episode.overview, 200)}
                    </p>
                  </div>
                </div>
              )
            } else {
              return <></>
            }
          })}
        </div>
      )}
    </>
  );
};
