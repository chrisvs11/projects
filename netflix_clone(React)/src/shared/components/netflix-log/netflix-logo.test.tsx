import React, { act } from "react";

import { fireEvent, render,screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { NetflixLogo } from "./netflix-logo.component";
import { Img } from "@chakra-ui/react";

jest.mock("react-router-dom", () => ( {
  useNavigate:jest.fn()
}))


describe("Netflix Logo Testing", () => {

  const navigateMock = jest.fn()
  const onClickMock = jest.fn()

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(navigateMock)
  })
  afterEach(() =>{
    jest.clearAllMocks()
  })

  it("should render when called", () => {
    render(<NetflixLogo/>)
    const image = screen.getByTestId("netflixLogo")
    expect(image).toBeInTheDocument()
  })

  it("should called navigate when image is clicked", async () => {
    render(<NetflixLogo/>)
    const image =screen.getByTestId("netflixLogo")
    await act(async() => {
      fireEvent.click(image)
    })

    expect(navigateMock).toHaveBeenCalledWith("/")

  })

})