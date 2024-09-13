import React, { act, Dispatch, SetStateAction,} from "react";
import { fireEvent, render,screen } from "@testing-library/react";
import { TVSeasonChapterDetail, TVSeasonsQueryFormat } from "types";
import { ChapterDetail } from "./chapter-detail";
import { useTVSeasonChaptersDetail, useTVSeasonsQuery } from "shared/hooks";


const tvSeasonDetailMock:TVSeasonChapterDetail = {
  episodes:[
    {id:1, name:"chapter 1",overview:"lorem lorem1",still_path:"still_path.jpg",episode_number:1,runtime:30},
    {id:2, name:"chapter 2",overview:"lorem lorem2",still_path:"still_path.jpg",episode_number:1,runtime:30},
    {id:3, name:"chapter 3",overview:"lorem lorem3",still_path:"still_path.jpg",episode_number:1,runtime:30}
  ]
}

const tvSeasonMock:TVSeasonsQueryFormat = {
  seasons:[
    {season_number:1},
    {season_number:2}
  ]
}

jest.mock("shared/hooks", () => ({
  useTVSeasonsQuery:jest.fn(),
  useTVSeasonChaptersDetail:jest.fn(),

}))

describe("Chapter Detail tests", () => {

  beforeEach(() => {
    (useTVSeasonChaptersDetail as jest.Mock).mockReturnValue({data:tvSeasonDetailMock,isError:false}),
    (useTVSeasonsQuery as jest.Mock).mockReturnValue({data:tvSeasonMock})
  })

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render chapter detail when called", () => {
    render(<ChapterDetail/>)
    const chapterDetailContainer = screen.getByTestId("chapter-detail")
    expect(chapterDetailContainer).toBeInTheDocument()
  })

  it("should have the same options as the seasons available", () => {
    render(<ChapterDetail/>)
    const options = screen.getAllByTestId("option")
    expect(options.length).toBe(2)
  })

  it("should have the episode quantity as the query mock", () => {
    render(<ChapterDetail/>)
    const episode = screen.getAllByTestId("episode")
    expect(episode.length).toBe(3)
  })

  it("should show the chapter information", () => {
    render(<ChapterDetail/>)
    const episodeTitle = screen.getByText(/chapter 1/i)
    const episodeOverview = screen.getByText(/lorem lorem1/i)
    expect(episodeTitle.textContent).toBe("1. chapter 1, Duration: 30 min")
    expect(episodeOverview.textContent).toBe("lorem lorem1")
  })

  // it("should call setSeasonNumber when select is changed",async () => {
  //   render(<ChapterDetail/>)
  //   const select = screen.getByTestId("select")
  //   const setSeasonNumber = jest.fn()

  //   const useStateSpy = jest.spyOn(React, "useState");
  //   useStateSpy.mockReturnValue([0,setSeasonNumber])
  //   fireEvent.change(select,{target:{value:"0"}})
   
  //   expect(setSeasonNumber).toBeCalledTimes(2);

  // })

})