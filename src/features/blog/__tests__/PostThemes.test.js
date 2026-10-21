import { fireEvent, render, screen, within } from "@testing-library/react";
import NewPostPopup from "../components/NewPostPopup";
import EditPostPopup from "../components/EditPostPopup";
import PostHashtags from "../components/PostHashtags";

const themes = ["Development", "Design", "Travel", "Daily life"];
const post = {
  _id: "post-1",
  theme: "Development",
  icon: "js",
  title: "An article",
  hashtags: ["node"],
  text: "Post text",
};

describe("Post categories in forms", () => {
  test.each(["new", "edit"])(
    "%s form offers exactly four categories",
    (mode) => {
      render(
        mode === "new" ? (
          <NewPostPopup isOpen onClose={jest.fn()} onAddPost={jest.fn()} />
        ) : (
          <EditPostPopup
            isOpen
            post={post}
            onClose={jest.fn()}
            onEditPost={jest.fn()}
          />
        ),
      );

      const group = within(screen.getByRole("radiogroup", { name: "Theme" }));
      expect(group.getAllByRole("radio").map((input) => input.value)).toEqual(
        themes,
      );
      for (const theme of themes) {
        expect(group.getByRole("radio", { name: theme })).toHaveAttribute(
          "value",
          theme,
        );
      }
      for (const theme of ["Web development", "Web design", "Books"]) {
        expect(
          group.queryByRole("radio", { name: theme }),
        ).not.toBeInTheDocument();
      }
    },
  );

  test.each(themes)("creates a post with the value %s", (theme) => {
    const onAddPost = jest.fn();
    render(<NewPostPopup isOpen onClose={jest.fn()} onAddPost={onAddPost} />);
    fireEvent.click(screen.getByRole("radio", { name: theme }));
    fireEvent.click(screen.getByRole("radio", { name: "js icon" }));
    for (const [name, value] of [
      ["Title", post.title],
      ["Hashtags", "node"],
      ["Text", post.text],
    ]) {
      fireEvent.change(screen.getByRole("textbox", { name }), {
        target: { value },
      });
    }
    fireEvent.click(screen.getByRole("button", { name: "Add post" }));

    expect(onAddPost).toHaveBeenCalledWith(expect.objectContaining({ theme }));
  });

  test.each(themes)("loads and saves the existing category %s", (theme) => {
    const onEditPost = jest.fn();
    render(
      <EditPostPopup
        isOpen
        post={{ ...post, theme }}
        onClose={jest.fn()}
        onEditPost={onEditPost}
      />,
    );
    expect(screen.getByRole("radio", { name: theme })).toBeChecked();
    fireEvent.change(screen.getByRole("textbox", { name: "Title" }), {
      target: { value: "Updated article" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save post" }));

    expect(onEditPost).toHaveBeenCalledWith(
      post._id,
      expect.objectContaining({ theme }),
    );
  });
});

describe("Post category filters", () => {
  test("shows All and the four categories", () => {
    render(<PostHashtags activeHashtag="All" onClick={jest.fn()} query="" />);
    expect(
      screen.getAllByRole("button").map((button) => button.textContent),
    ).toEqual(["All", ...themes]);
  });

  test.each(["Development", "Design"])("filters by %s", (theme) => {
    const onClick = jest.fn();
    render(
      <PostHashtags activeHashtag={theme} onClick={onClick} query="hooks" />,
    );
    const button = screen.getByRole("button", { name: theme });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith(theme, "hooks");
  });
});
