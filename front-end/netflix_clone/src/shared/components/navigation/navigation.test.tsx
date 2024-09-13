import React, { act } from "react";
import { fireEvent, render,screen } from "@testing-library/react";
import { Navigation } from "./navigation.component";
import { RecoilRoot } from "recoil";
import { useActiveUser, useFilter } from "shared/hooks";
import { USERDATABASE } from "shared/database";
import { BrowserRouter, Router, useNavigate } from "react-router-dom";
import { NetflixAvatar,NetflixLogo } from "../index"
import userEvent from "@testing-library/user-event";
import { Button } from "@chakra-ui/react";


jest.mock("shared/hooks", () => ({
  useFilter:jest.fn(),
  useActiveUser:jest.fn()
}))

jest.mock("../index", () => ({
  NetflixAvatar:() => <div>Avatar</div>,
  NetflixLogo:() => <div>Logo</div>
}))


describe("Navigation Bar Testing", () => {
  
  const setActiveFilterMock = jest.fn();

  beforeEach(() => {
    (useFilter as jest.Mock)
      .mockReturnValue({
        setActiveFilter: setActiveFilterMock});
  
    (useActiveUser as jest.Mock)
      .mockReturnValue({activeUser:USERDATABASE[0]});

  })
  afterEach(() => {
    jest.clearAllMocks();
  })

  it("should render the netflix logo and the avatar", () => {
    render(
    <RecoilRoot>
      <BrowserRouter>
        <Navigation/>
      </BrowserRouter>
    </RecoilRoot>
    )
    const netflixLogo = screen.getByText("Logo")
    const netflixAvatar = screen.getByText("Avatar")
    expect(netflixAvatar).toBeInTheDocument()
    expect(netflixLogo).toBeInTheDocument()
  })

  it ("should call setActiveFilter when search button is clicked", async () => {
    
    render(
      <RecoilRoot>
        <BrowserRouter>
          <Navigation/>
        </BrowserRouter>
      </RecoilRoot>
      )

      const searchBtn = screen.getByTestId("search")
      const input = screen.getByPlaceholderText("Search")
      fireEvent.change(input,{target:{value:"test search"}})

      await act(async() => {
        fireEvent.click(searchBtn)
      })
      
      expect(setActiveFilterMock).toHaveBeenCalledWith("test search")
  })

})