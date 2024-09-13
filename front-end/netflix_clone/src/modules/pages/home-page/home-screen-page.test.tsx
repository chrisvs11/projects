import { RecoilRoot } from "recoil"; // Assuming Recoil is used for state management
import { HomeScreen } from "./home-screen-page";
import { act, render,screen } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient()

// Mock any dependencies or custom context providers if needed

jest.mock("shared/components", () => ({
  Navigation:() => <nav>Navigation</nav>,
  Banner:() => <div>Banner</div>,
  Row:({title}:{title:string}) => <div>{title}</div>,
  MediaDetailBanner:() => <div>MediaDetailBanner</div>
}))



describe("HomeScreen Component", () => {

  const eventListenerSpy = jest.spyOn(window,"addEventListener")
  const removeEventListenerSpy = jest.spyOn(window,"removeEventListener")

  afterEach(() => {
    eventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it("renders all components", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <HomeScreen />
        </RecoilRoot>
      </QueryClientProvider>
    );

    expect(screen.getByText("NETFLIX ORIGINALS")).toBeInTheDocument();
    expect(screen.getByText("TOP TRENDING")).toBeInTheDocument();
    expect(screen.getByText("ACTIONS MOVIES")).toBeInTheDocument();
    expect(screen.getByText("COMEDY MOVIES")).toBeInTheDocument();
    expect(screen.getByText("HORROR MOVIES")).toBeInTheDocument();
    expect(screen.getByText("ROMANCE MOVIES")).toBeInTheDocument();

    const navigationComponent = screen.getByRole("navigation");
    expect(navigationComponent).toBeInTheDocument();

  });

  it("should render the media detail banner when movieDetail state is true", () => {
  
    render(
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <HomeScreen mediaDetailInitialState={true} />
        </RecoilRoot>
      </QueryClientProvider>
    );

    expect(screen.getByText("MediaDetailBanner")).toBeInTheDocument() 
  })


});
