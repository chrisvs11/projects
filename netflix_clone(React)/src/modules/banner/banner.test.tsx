import { render, screen } from "@testing-library/react";
import { useMediaQuery } from "shared/hooks";
import { Media, MediaQueryResponse } from "types";
import { Banner } from "./banner.component";
import React, { useEffect, useState } from "react";


jest.mock("shared/hooks",() => (
  {useMediaQuery:jest.fn()}
))

const mockSetMovie = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn()
}))

const movieResponseMock:MediaQueryResponse = {
  page:1,
  results:[
    {
      overview: "lorem lorem",
      id: 0,
      genre_ids: [],
      vote_average: 0,
      name:"A",
      backdrop_path:"backdrop_path.jpg"
    }
  ]
}


describe ("Testing the Banner Component", () => {
  beforeEach(() => {
    (useMediaQuery as jest.Mock).mockReturnValue({data:movieResponseMock}),
    (useState as jest.Mock).mockImplementation((init:Media)=>[movieResponseMock.results[0],mockSetMovie])

  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should render when banner is called", () => {
    render(<Banner/>)
    const bannerContent = screen.getByTestId("bannerContents")
    expect(bannerContent).toBeInTheDocument()
  })

  it("should display a movie in their content", () => {
    render(<Banner/>)
    const bannerHeader = screen.getByTestId("header")
    const bannerHeaderStyle = getComputedStyle(bannerHeader)
    expect(bannerHeaderStyle.backgroundImage).toBe("url(https://image.tmdb.org/t/p/original/backdrop_path.jpg)")

    const bannerTitle = screen.getByTestId("bannerTitle")
    expect(bannerTitle.textContent).toBe("A")

    const bannerDescription = screen.getByTestId("bannerDescription")
    expect(bannerDescription.textContent).toBe("lorem lorem")

  })




})