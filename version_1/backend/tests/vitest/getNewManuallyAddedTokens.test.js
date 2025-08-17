import { describe, it, expect } from "vitest";
import { getNewManuallyAddedTokens } from "../../utils/training-token-selection";

describe("getNewManuallyAddedTokens", () => {
  beforeEach(async () => {
    // we want to clear and recreate the database to set up the test
  });

  it("should return the expected tokens", async () => {
    const tokens = await getNewManuallyAddedTokens(1, 1);
    expect(tokens).toEqual([{ id: 1, tokenString: "a" }]);
  });
});
