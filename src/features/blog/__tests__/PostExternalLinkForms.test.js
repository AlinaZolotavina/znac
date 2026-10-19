import { fireEvent, render, screen } from "@testing-library/react";
import NewPostPopup from "../components/NewPostPopup";
import EditPostPopup from "../components/EditPostPopup";

const link = "https://example.com/article";
const post = {
  _id: "post-1",
  theme: "Web development",
  icon: "js",
  title: "An article",
  hashtags: ["node"],
  text: "Post text",
  externalLink: link,
  externalLinkButtonText: "Read article",
};

function renderNewPost() {
  const onAddPost = jest.fn();
  const view = render(
    <NewPostPopup isOpen onClose={jest.fn()} onAddPost={onAddPost} />,
  );
  fireEvent.click(screen.getByRole("radio", { name: "Web development" }));
  fireEvent.click(view.container.querySelector('input[value="js"]'));
  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "An article" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Hashtags separated by spaces"),
    {
      target: { value: "node" },
    },
  );
  fireEvent.change(screen.getByPlaceholderText("Text"), {
    target: { value: "Post text" },
  });
  return { ...view, onAddPost };
}

function renderEditPost(postToEdit = post) {
  const onEditPost = jest.fn();
  const view = render(
    <EditPostPopup
      isOpen
      post={postToEdit}
      onClose={jest.fn()}
      onEditPost={onEditPost}
    />,
  );
  return { ...view, onEditPost };
}

function changeLink(value) {
  fireEvent.change(
    screen.getByRole("textbox", { name: "Link to resource (optional)" }),
    {
      target: { value },
    },
  );
}

function changeButtonText(value) {
  fireEvent.change(
    screen.getByRole("textbox", { name: "Button text (optional)" }),
    {
      target: { value },
    },
  );
}

describe.each([
  ["new post", renderNewPost],
  ["edit post", renderEditPost],
])("Persistent labels in %s popup", (_name, renderPopup) => {
  test("asks for post text when its text field is cleared", () => {
    renderPopup();
    fireEvent.change(screen.getByRole("textbox", { name: "Text" }), {
      target: { value: "" },
    });

    expect(screen.getByText("Please enter post text")).toBeInTheDocument();
    expect(
      screen.queryByText("Please enter your message"),
    ).not.toBeInTheDocument();
  });

  test("keeps field labels visible with entered values and validation errors", () => {
    renderPopup();
    for (const label of [
      "Title",
      "Hashtags",
      "Text",
      "Link to resource (optional)",
      "Button text (optional)",
    ]) {
      expect(
        screen.getByText(label, { selector: ".blog-input__label" }),
      ).toBeVisible();
      expect(screen.getByRole("textbox", { name: label })).toBeInTheDocument();
    }
    expect(
      screen.getByText("Photo (optional)", { selector: ".new-post__upload-label" }),
    ).toBeVisible();

    changeLink(link);
    changeButtonText("a".repeat(41));

    expect(
      screen.getByText("Button text (optional)", {
        selector: ".blog-input__label",
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("textbox", { name: "Button text (optional)" }),
    ).toHaveAccessibleDescription("Button text must be 40 characters or fewer");
  });
});

describe("New post external link fields", () => {
  test("creates without a link and marks both link fields as optional", () => {
    const { onAddPost } = renderNewPost();
    expect(screen.queryByText("Optional link")).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Link to resource (optional)" }),
    ).not.toBeRequired();
    expect(
      screen.getByRole("textbox", { name: "Button text (optional)" }),
    ).not.toBeRequired();

    fireEvent.click(screen.getByRole("button", { name: "Add post" }));

    expect(onAddPost).toHaveBeenCalledTimes(1);
    expect(onAddPost.mock.calls[0][0]).not.toHaveProperty("externalLink");
    expect(onAddPost.mock.calls[0][0]).not.toHaveProperty(
      "externalLinkButtonText",
    );
  });

  test.each(["http://example.com/article", link])(
    "sends a valid link %s without custom text",
    (url) => {
      const { onAddPost } = renderNewPost();
      changeLink(`  ${url}  `);
      fireEvent.click(screen.getByRole("button", { name: "Add post" }));

      expect(onAddPost).toHaveBeenCalledWith(
        expect.objectContaining({ externalLink: url }),
      );
      expect(onAddPost.mock.calls[0][0]).not.toHaveProperty(
        "externalLinkButtonText",
      );
    },
  );

  test("sends a link and trimmed custom text", () => {
    const { onAddPost } = renderNewPost();
    changeLink(link);
    changeButtonText("  Read article  ");
    fireEvent.click(screen.getByRole("button", { name: "Add post" }));

    expect(onAddPost).toHaveBeenCalledWith(
      expect.objectContaining({
        externalLink: link,
        externalLinkButtonText: "Read article",
      }),
    );
  });

  test("does not send orphaned custom text", () => {
    const { onAddPost } = renderNewPost();
    changeButtonText("Read article");
    fireEvent.click(screen.getByRole("button", { name: "Add post" }));

    expect(onAddPost.mock.calls[0][0]).not.toHaveProperty(
      "externalLinkButtonText",
    );
  });

  test.each([
    "example.com/article",
    "not a url",
    "https://",
    "https:example.com",
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///etc/passwd",
    "ftp://example.com/article",
  ])("blocks submission for invalid link %s", (url) => {
    const { onAddPost, container } = renderNewPost();
    changeLink(url);

    expect(screen.getByText("Please enter a valid URL")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
    fireEvent.submit(container.querySelector("form"));
    expect(onAddPost).not.toHaveBeenCalled();
  });

  test("blocks overlong text and allows exactly 40 characters", () => {
    const { onAddPost, container } = renderNewPost();
    changeLink(link);
    changeButtonText("a".repeat(41));

    expect(
      screen.getByText("Button text must be 40 characters or fewer"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
    fireEvent.submit(container.querySelector("form"));
    expect(onAddPost).not.toHaveBeenCalled();

    changeButtonText("a".repeat(40));
    expect(screen.getByRole("button", { name: "Add post" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Add post" }));
    expect(onAddPost).toHaveBeenCalledWith(
      expect.objectContaining({ externalLinkButtonText: "a".repeat(40) }),
    );
  });

  test("clears optional values and errors after closing", () => {
    const { rerender } = renderNewPost();
    changeLink("invalid");
    changeButtonText("a".repeat(41));
    const props = { onClose: jest.fn(), onAddPost: jest.fn() };
    rerender(<NewPostPopup {...props} isOpen={false} />);
    rerender(<NewPostPopup {...props} isOpen />);

    expect(
      screen.getByRole("textbox", { name: "Link to resource (optional)" }),
    ).toHaveValue("");
    expect(
      screen.getByRole("textbox", { name: "Button text (optional)" }),
    ).toHaveValue("");
    expect(
      screen.queryByText("Please enter a valid URL"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Button text must be 40 characters or fewer"),
    ).not.toBeInTheDocument();
  });
});

describe("Edit post external link fields", () => {
  test("loads the existing link and custom text", () => {
    renderEditPost();
    expect(
      screen.getByRole("textbox", { name: "Link to resource (optional)" }),
    ).toHaveValue(link);
    expect(
      screen.getByRole("textbox", { name: "Button text (optional)" }),
    ).toHaveValue("Read article");
    expect(screen.getByRole("button", { name: "Save post" })).toBeDisabled();
  });

  test("loads empty optional fields for legacy posts", () => {
    renderEditPost({
      ...post,
      externalLink: undefined,
      externalLinkButtonText: undefined,
    });
    expect(
      screen.getByRole("textbox", { name: "Link to resource (optional)" }),
    ).toHaveValue("");
    expect(
      screen.getByRole("textbox", { name: "Button text (optional)" }),
    ).toHaveValue("");
  });

  test.each([
    ["clears both fields", "", "Read article", "", ""],
    ["clears only custom text", link, "", link, ""],
    ["clears whitespace custom text", link, "   ", link, ""],
    [
      "updates both fields",
      "https://example.org/new",
      "New label",
      "https://example.org/new",
      "New label",
    ],
  ])("%s", (_name, url, label, expectedLink, expectedText) => {
    const { onEditPost } = renderEditPost();
    changeLink(url);
    changeButtonText(label);
    fireEvent.click(screen.getByRole("button", { name: "Save post" }));

    expect(onEditPost).toHaveBeenCalledWith(
      post._id,
      expect.objectContaining({
        externalLink: expectedLink,
        externalLinkButtonText: expectedText,
      }),
    );
  });

  test("adds a link to a legacy post", () => {
    const { onEditPost } = renderEditPost({
      ...post,
      externalLink: undefined,
      externalLinkButtonText: undefined,
    });
    changeLink(link);
    fireEvent.click(screen.getByRole("button", { name: "Save post" }));

    expect(onEditPost).toHaveBeenCalledWith(
      post._id,
      expect.objectContaining({
        externalLink: link,
        externalLinkButtonText: "",
      }),
    );
  });

  test.each([
    ["link", "javascript:alert(1)", "Please enter a valid URL"],
    ["text", "a".repeat(41), "Button text must be 40 characters or fewer"],
  ])("blocks submission for invalid %s", (field, value, message) => {
    const { onEditPost, container } = renderEditPost();
    if (field === "link") changeLink(value);
    else changeButtonText(value);

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save post" })).toBeDisabled();
    fireEvent.submit(container.querySelector("form"));
    expect(onEditPost).not.toHaveBeenCalled();
  });

  test("reloads link values and clears errors when opening another post", () => {
    const { rerender, onEditPost } = renderEditPost();
    changeLink("invalid");
    const nextPost = {
      ...post,
      _id: "post-2",
      externalLink: "https://example.org/",
      externalLinkButtonText: "Next",
    };
    rerender(
      <EditPostPopup
        isOpen
        post={nextPost}
        onClose={jest.fn()}
        onEditPost={onEditPost}
      />,
    );

    expect(
      screen.getByRole("textbox", { name: "Link to resource (optional)" }),
    ).toHaveValue(nextPost.externalLink);
    expect(
      screen.getByRole("textbox", { name: "Button text (optional)" }),
    ).toHaveValue("Next");
    expect(
      screen.queryByText("Please enter a valid URL"),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save post" })).toBeDisabled();
  });
});
