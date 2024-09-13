import { fireEvent, render,screen } from "@testing-library/react";
import { Row } from "./row.component";
import { MediaQueryResponse, RowProps } from "types";
import { useFilter, useMediaQuery } from "shared/hooks";
import {SearchFunction} from "shared/functions/search-function";

const mockLargeRowProps:RowProps = {
  title: "Test",
  fetchURL: "fetchURL",
  updateMovieDetail: jest.fn(),
  activateMovieDetail: jest.fn(),
  isLargeRow:true
}

const mockSmallRowProps:RowProps = {
  title: "Test",
  fetchURL: "fetchURL",
  updateMovieDetail: jest.fn(),
  activateMovieDetail: jest.fn(),
  isLargeRow:false
}
jest.mock("shared/hooks",() => ({
  useMediaQuery:jest.fn(),
  useFilter:jest.fn()
}))

jest.mock("shared/functions/search-function", () => ({
  __esModule: true, // Ensure that ES modules are mocked correctly
  SearchFunction: jest.fn(), // Mocking the default export (SearchFunction)
}));

const mockMediaQuery:MediaQueryResponse = {
  page: 0,
  results: [
    {
    overview: "",
    id: 0,
    genre_ids: [],
    vote_average: 0,
    backdrop_path:"backdrop_path_0",
    poster_path:"poster_path_0"
   },
   {
    overview: "",
    id: 1,
    genre_ids: [],
    vote_average: 0,
    poster_path:"poster_path_1",
    backdrop_path:"backdrop_path_1"
  }
]
}

describe("Testing Row Component", () => {

  beforeEach(() => {
    (useMediaQuery as jest.Mock).mockReturnValue({data:mockMediaQuery}),
    (useFilter as jest.Mock).mockReturnValueOnce({activeFilter:""}),
    (SearchFunction as jest.Mock).mockImplementation(() => mockMediaQuery.results);
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should rendered when called", () => {
    render(<Row {...mockLargeRowProps}/>)
    const rowComponent = screen.getByTestId("row")
    expect(rowComponent).toBeInTheDocument()
  })

  it("should return 2 poster in the row", () => {
    render(<Row {...mockLargeRowProps}/>)
    const poster = screen.getAllByTestId("poster")
    expect(poster.length).toBe(2)
    expect(SearchFunction).toBeCalledTimes(2)
  })
  it("should be poster large when is large is true", () => {
    render(<Row {...mockLargeRowProps}/>)
    const poster = screen.getAllByTestId("poster")
    expect(poster[0].className.includes("rowPosterLarge")).toBe(true)
    expect(poster[1].className.includes("rowPosterLarge")).toBe(true)
  })
  it("should be poster small ", () => {
    render(<Row {...mockSmallRowProps}/>)
    const poster = screen.getAllByTestId("poster")
    expect(poster[0].className.includes("rowPosterLarge")).toBe(false)
    expect(poster[1].className.includes("rowPosterLarge")).toBe(false)
  })
  it("should called the methods inside clickHandle when click the poster", () => {
    render(<Row {...mockSmallRowProps}/>)
    const poster = screen.getAllByTestId("poster")[0]
    fireEvent.click(poster)
    expect(mockSmallRowProps.updateMovieDetail).toHaveBeenCalledWith(mockMediaQuery.results[0])
    expect(mockSmallRowProps.activateMovieDetail).toHaveBeenCalledWith(true)
  })
})