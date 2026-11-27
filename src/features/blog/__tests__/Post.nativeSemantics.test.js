import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import Post from "../components/Post";

const post = {
  _id: "post-1",
  createdAt: "2026-08-12T10:00:00.000Z",
  theme: "Development",
  icon: "typescript",
  title: "Native semantics post",
  text: "Post text",
  hashtags: ["accessibility"],
};

describe("Post native semantics", () => {
  test("opens post through a crawlable link with client navigation", () => {
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
    const openLink = screen.getByRole("link", {
      name: "Open post Native semantics post",
    });

    expect(listItem).not.toHaveAttribute("role", "button");
    expect(listItem).not.toHaveAttribute("tabindex");
    expect(openLink.tagName).toBe("A");
    expect(openLink).toHaveAttribute("href", "/journal/posts/post-1");

    fireEvent.click(openLink);

    expect(handlePostClick).toHaveBeenCalledWith(post);
  });

  test("keeps edit and delete actions separate from the post link", () => {
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
