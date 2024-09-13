import { Media } from "types";
import { SearchFunction } from "./search-function";

const mockTargetMedia:Media[] = [
  {
    overview: "",
    id: 0,
    genre_ids: [1,2],
    vote_average: 0,
    name:"A"
  },
  {
    overview: "",
    id: 0,
    genre_ids: [2,3],
    vote_average: 0,
    title:"B"
  },
  {
    overview: "",
    id: 0,
    genre_ids: [2,3],
    vote_average: 0,
    original_title:"BA"
  }
]


describe("search function testing", () => {
  it("should return all target media when search is blank", () => {
   const results = SearchFunction(mockTargetMedia,"")
   expect(results.length).toBe(3)
  }),
  it("should return 2 when filter is A", () => {
    const results = SearchFunction(mockTargetMedia,"A")
    expect(results.length).toBe(2)
  })
})