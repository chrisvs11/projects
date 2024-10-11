import truncate from "./truncate";

describe("truncate test", () => {
  it("should filter when string overpasses n and on the first blank", () => {
    const truncatedText:string = truncate("lorem lorem",3)
    expect(truncatedText).toBe("lorem ...")
  })
})