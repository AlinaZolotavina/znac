import { render, screen } from "@testing-library/react";
import Hashtags from "../components/Hashtags";

describe("gallery hashtags", () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test("renders hashtag objects without ids without duplicate key warnings", () => {
    render(
      <Hashtags
        photoHashtags={[{ name: "test" }, { name: "react" }]}
        hashtagsNumber={10}
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "# test" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "# react" })).toBeInTheDocument();
    expect(
      consoleErrorSpy.mock.calls.some((call) =>
        call.some((message) =>
          String(message).includes(
            "Encountered two children with the same key",
          ),
        ),
      ),
    ).toBe(false);
  });
});
