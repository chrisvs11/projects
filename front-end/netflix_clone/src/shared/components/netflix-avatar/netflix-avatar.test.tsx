import React from "react";

import { render,screen } from "@testing-library/react";
import { NetflixAvatar } from "./netflix-avatar.component";

describe("Netflix Avatar Testing", () => {
  it("should rendered when props are given", () => {
    render(<NetflixAvatar className="test" avatarImage="avatar.png" />)
    const avatar = screen.getByTestId("avatar")
    expect(avatar).toBeInTheDocument()

  })
})