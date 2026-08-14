import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import Post from "../components/Post";

const post = {
  _id: "post-1",
  createdAt: "2026-08-12T10:00:00.000Z",
  theme: "Web development",
  icon: "typescript",
  title: "Native semantics post",
  text: "Post text",
  hashtags: ["accessibility"],
};

describe("Post native semantics", () => {
  test("opens post through a native button instead of an interactive list item", () => {
    const handlePostClick = jest.fn();

    renderWithProviders(
      <ul>
        <Post
          post={post}
          onPostClick={handlePostClick}
          onEditPostButtonClick={jest.fn()}
          onDeletePostButtonClick={jest.fn()}
          loggedIn={false}
          location="posts"
        />
      </ul>,
    );

    const listItem = screen.getByRole("listitem");
    const openButton = screen.getByRole("button", {
      name: "Open post Native semantics post",
    });

    expect(listItem).not.toHaveAttribute("role", "button");
    expect(listItem).not.toHaveAttribute("tabindex");
    expect(openButton.tagName).toBe("BUTTON");

    fireEvent.click(openButton);

    expect(handlePostClick).toHaveBeenCalledWith(post);
  });

  test("keeps edit and delete actions separate from the post open button", () => {
    const handlePostClick = jest.fn();
    const handleEditPostButtonClick = jest.fn();
    const handleDeletePostButtonClick = jest.fn();

    renderWithProviders(
      <ul>
        <Post
          post={post}
          onPostClick={handlePostClick}
          onEditPostButtonClick={handleEditPostButtonClick}
          onDeletePostButtonClick={handleDeletePostButtonClick}
          loggedIn={true}
          location="posts"
        />
      </ul>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Edit post" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete post" }));

    expect(handleEditPostButtonClick).toHaveBeenCalledWith(post);
    expect(handleDeletePostButtonClick).toHaveBeenCalledWith(post);
    expect(handlePostClick).not.toHaveBeenCalled();
  });
});
