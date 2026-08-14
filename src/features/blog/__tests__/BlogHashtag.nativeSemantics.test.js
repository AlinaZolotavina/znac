import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import BlogHashtag from "../components/BlogHashtag";

describe("BlogHashtag native semantics", () => {
  test("renders clickable hashtag as a button inside a list item", () => {
    const handleHashtagClick = jest.fn();

    renderWithProviders(
      <ul>
        <BlogHashtag
          hashtag="#react"
          isSymbolActive={true}
          classname="project__hashtag"
          onHashtagClick={handleHashtagClick}
        />
      </ul>,
    );

    const listItem = screen.getByRole("listitem");
    const hashtagButton = screen.getByRole("button", { name: "#react" });

    expect(listItem).not.toHaveAttribute("role", "button");
    expect(listItem).not.toHaveAttribute("tabindex");

    fireEvent.click(hashtagButton);

    expect(handleHashtagClick).toHaveBeenCalledWith("react");
  });

  test("keeps static hashtag as plain list content", () => {
    renderWithProviders(
      <ul>
        <BlogHashtag
          hashtag="react"
          isSymbolActive={true}
          classname="post__hashtag"
        />
      </ul>,
    );

    expect(screen.getByRole("listitem")).toHaveTextContent("#react");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
