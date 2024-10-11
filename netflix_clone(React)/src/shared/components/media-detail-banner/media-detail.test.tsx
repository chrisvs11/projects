import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { useMediaDetailQuery, useMediaGenresQuery } from "shared/hooks";
import { Media, MediaDetail, MediaGenresQuery, MediaDetailBannerProps} from "types";
import { MediaDetailBanner } from "./media-detail-banner.component";


jest.mock("shared/hooks",() => ({
  useMediaDetailQuery:jest.fn(),
  useMediaGenresQuery:jest.fn()

}))

jest.mock("../chapter-detail/chapter-detail", () => ({
  ChapterDetail:() => <div>ChapterDetail</div>
}))

const mockGenres:MediaGenresQuery = {
  genres: [
    {id:1,name:"action"},
    {id:2,name:"terror"},
    {id:3,name:"comedy"}
  ]
}

const mockMediaDetailWithCast:MediaDetail = {
  runtime:70,
  credits:{
    cast:[{name:"cast 1"},{name:"cast 2"},{name:"cast 3"},{name:"cast 4"}],
    crew:[]
  }
}


const mockMediaDetailWithCrew:MediaDetail = {
  runtime:70,
  credits:{
    cast:[],
    crew:[{name:"crew 1"},{name:"crew 2"},{name:"crew 3"},{name:"crew 4"}]
  }
}


const mediaDetailBannerPropsMock:MediaDetailBannerProps = {
  media: {
    overview: "lorem lorem",
    id: 1,
    genre_ids: [1, 2, 3],
    vote_average: 10,
    backdrop_path: "backdrop_path.jpg",
    name:"Movie Mock",
    release_date:"2020-12-15",
    first_air_date:"2022-12-15"
  },
  isMovie: true,
  movieDetailState: true,
  deactivateMediaDetailBanner: jest.fn(),
  numOfActors:3
}


describe("Media Detail Banner Test",() => {

  beforeEach(() => {
    (useMediaGenresQuery as jest.Mock).mockReturnValue({data:mockGenres}),
    (useMediaDetailQuery as jest.Mock).mockReturnValue({data:mockMediaDetailWithCast}),
    window.scrollTo = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Media detail header", () => {
    it("should render the image", () => {
      render(<MediaDetailBanner {...mediaDetailBannerPropsMock} />)
      const movieBanner = screen.getByTestId("movieBanner")
      const movieBannerStyle = getComputedStyle(movieBanner)
      expect(movieBannerStyle.backgroundImage).toBe("url(https://image.tmdb.org/t/p/original/backdrop_path.jpg)")
    })
  })

  it("should call de deactivate banner function when close btn is clicked", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock} />)
    const closeBtn = screen.getByTestId("closeBtn")
    fireEvent.click(closeBtn)

    expect(mediaDetailBannerPropsMock.deactivateMediaDetailBanner).toHaveBeenCalledTimes(1)
    expect(mediaDetailBannerPropsMock.deactivateMediaDetailBanner).toHaveBeenCalledWith(false)
  })

  it("should display the title of movie when passed",() => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock} />)
    const movieTitleHeader = screen.getByTestId("movieTitle")
    expect(movieTitleHeader.textContent).toBe(" Movie Mock")
  })

  it("should display movie when isMovie is true", () => {
    const SeriesDetails = {...mediaDetailBannerPropsMock,isMovie:false}
    render(<MediaDetailBanner {...SeriesDetails} />)
    const mediaCategory = screen.getByTestId("category")
    expect(mediaCategory.textContent).toBe(" Series ")
  })

  it("should display the runtime time in hours and minutes when is movie", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const durationTime = screen.getByTestId("duration")
    expect(durationTime.textContent).toBe(" Duration: 1 h 10 min ")
  })

  it("should not display the runtime time in hours and minutes when is a series", () => {
    const SeriesDetails = {...mediaDetailBannerPropsMock,isMovie:false}
    render(<MediaDetailBanner {...SeriesDetails}/>)
    const durationTime = screen.getByTestId("duration")
    expect(durationTime.textContent).toBe("  ")
  })

  it("should display the release date", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    let releaseDate = screen.getByTestId("releaseDate")
    expect(releaseDate.textContent).toBe("2020 ")
  })

  it("should display the release date", () => {
    const seriesMedia:Media = {...mediaDetailBannerPropsMock.media!,release_date:undefined}
    const seriesDetail:MediaDetailBannerProps = {...mediaDetailBannerPropsMock,media:{...seriesMedia}}
    render(<MediaDetailBanner {...seriesDetail}/>)
    const releaseDate = screen.getByTestId("releaseDate")
    expect(releaseDate.textContent).toBe("2022 ")
  })

  it("should display the rating ", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const rating = screen.getByTestId("rating")
    expect(rating.textContent).toBe("100% Match ")
  })

  it("should called truncate when rendering the content", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const description = screen.getByTestId("description")
    expect(description.textContent).toBe("lorem lorem")
  })

  it("should display the num of actors of cast members", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const cast = screen.getAllByTestId("cast")
    expect(cast.length).toBe(3)
  })

  it("should display the num of crew member when cast is empty", () => {
    (useMediaDetailQuery as jest.Mock).mockReturnValue({data:mockMediaDetailWithCrew})
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const crew = screen.getAllByTestId("crew")
    expect(crew.length).toBe(3)
  })

  it("should display the genres as actors screen", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const genre = screen.getAllByTestId("genre")
    expect(genre.length).toBe(3)
  })

  it("should not display the chapter detail when is a movie", () => {
    render(<MediaDetailBanner {...mediaDetailBannerPropsMock}/>)
    const chapterDetailElement = screen.queryByTestId('chapterDetail');
    expect(chapterDetailElement).not.toBeInTheDocument()
  })

  it("should not display the chapter detail when is a movie", () => {
    const SeriesDetails = {...mediaDetailBannerPropsMock,isMovie:false}
    render(<MediaDetailBanner {...SeriesDetails}/>)
    const chapterDetailElement = screen.queryByTestId('chapterDetail'); // You should have a text inside the ChapterDetail component to query.
    expect(chapterDetailElement).toBeInTheDocument()
  })
  
})