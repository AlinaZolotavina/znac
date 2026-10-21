import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  within,
} from "@testing-library/react";
import Post from "../components/Post";
import CurrentPost from "../components/CurrentPost";
import NewPostPopup from "../components/NewPostPopup";
import EditPostPopup from "../components/EditPostPopup";
import api from "../../../shared/utils/api";
import usePosts from "../hooks/usePosts";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

const post = {
  _id: "post-1",
  title: "An article",
  theme: "Development",
  icon: "js",
  text: "Post text",
  hashtags: [],
  createdAt: "2026-10-18T10:00:00.000Z",
};
const link = "https://example.com/article";
// eslint-disable-next-line no-script-url -- Intentionally unsafe fixture for rejection tests.
const unsafeLink = "javascript:alert(1)";

describe("Single post image fallback", () => {
  test("applies the compact placeholder only after an image error and resets it for another image", () => {
    const originalPost = {
      ...post,
      photoLink: "https://example.com/photo.jpg",
    };
    const { rerender } = render(
      <CurrentPost post={originalPost} location="single-post" />,
    );
    const image = screen.getByRole("img");
    const imageContainer = screen.getByTestId("post-image-container");

    fireEvent.load(image);
    expect(imageContainer).not.toHaveClass("post__image-container_state_error");
    expect(image).toHaveAttribute("src", originalPost.photoLink);

    fireEvent.error(image);
    expect(imageContainer).toHaveClass("post__image-container_state_error");
    expect(imageContainer).not.toHaveClass(
      "post__image-container_state_loading",
    );
    expect(image).not.toHaveAttribute("src", originalPost.photoLink);

    const nextPost = {
      ...originalPost,
      photoLink: "https://example.com/another.jpg",
    };
    rerender(<CurrentPost post={nextPost} location="single-post" />);
    fireEvent.load(screen.getByRole("img"));
    expect(imageContainer).not.toHaveClass("post__image-container_state_error");
    expect(screen.getByRole("img")).toHaveAttribute("src", nextPost.photoLink);
  });
});

describe.each([["single post", CurrentPost, "single-post"]])(
  "External link in %s",
  (_name, Component, location) => {
    test.each([
      ["custom text", "Read article", "Read article"],
      ["fallback text", undefined, "Open resource"],
      ["fallback for an empty custom label", "", "Open resource"],
    ])("shows a link with %s", (_case, label, expected) => {
      const onPostClick = jest.fn();
      render(
        <Component
          post={{ ...post, externalLink: link, externalLinkButtonText: label }}
          location={location}
          onPostClick={onPostClick}
        />,
      );

      const button = screen.getByRole("link", { name: expected });
      expect(button).toHaveAttribute("href", link);
      expect(button).toHaveAttribute("target", "_blank");
      expect(button).toHaveAttribute("rel", "noopener noreferrer");
      for (const action of screen.queryAllByRole("button")) {
        expect(within(action).queryByRole("link")).not.toBeInTheDocument();
      }
      fireEvent.click(button);
      expect(onPostClick).not.toHaveBeenCalled();
    });

    test("does not render an empty link for a legacy post", () => {
      render(<Component post={post} location={location} />);

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    test("does not render orphaned button text", () => {
      render(
        <Component
          post={{ ...post, externalLinkButtonText: "Read article" }}
          location={location}
        />,
      );

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    test("does not render links with an unsafe protocol", () => {
      render(
        <Component
          post={{ ...post, externalLink: unsafeLink }}
          location={location}
        />,
      );

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  },
);

describe.each(["main-page", "posts"])("Post card in %s", (location) => {
  test("keeps the external link on the single post page and opens that post from the card", () => {
    const onPostClick = jest.fn();
    const linkedPost = {
      ...post,
      externalLink: link,
      externalLinkButtonText: "Read article",
    };
    render(
      <Post post={linkedPost} location={location} onPostClick={onPostClick} />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByText("Read article")).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Open post An article" }),
    );
    expect(onPostClick).toHaveBeenCalledWith(linkedPost);
  });
});

describe("Post external link forms", () => {
  const link = "https://example.com/article";
  const post = {
    _id: "post-1",
    theme: "Development",
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
    fireEvent.click(screen.getByRole("radio", { name: "Development" }));
    fireEvent.click(screen.getByRole("radio", { name: "js icon" }));
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
        expect(
          screen.getByRole("textbox", { name: label }),
        ).toBeInTheDocument();
      }
      expect(
        screen.getByText("Photo (optional)", {
          selector: ".new-post__upload-label",
        }),
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
      ).toHaveAccessibleDescription(
        "Button text must be 40 characters or fewer",
      );
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
      unsafeLink,
      "data:text/html,hello",
      "file:///etc/passwd",
      "ftp://example.com/article",
    ])("blocks submission for invalid link %s", (url) => {
      const { onAddPost } = renderNewPost();
      changeLink(url);

      expect(screen.getByText("Please enter a valid URL")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
      fireEvent.submit(screen.getByRole("form", { name: "New post" }));
      expect(onAddPost).not.toHaveBeenCalled();
    });

    test("blocks overlong text and allows exactly 40 characters", () => {
      const { onAddPost } = renderNewPost();
      changeLink(link);
      changeButtonText("a".repeat(41));

      expect(
        screen.getByText("Button text must be 40 characters or fewer"),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add post" })).toBeDisabled();
      fireEvent.submit(screen.getByRole("form", { name: "New post" }));
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
      ["link", unsafeLink, "Please enter a valid URL"],
      ["text", "a".repeat(41), "Button text must be 40 characters or fewer"],
    ])("blocks submission for invalid %s", (field, value, message) => {
      const { onEditPost } = renderEditPost();
      if (field === "link") changeLink(value);
      else changeButtonText(value);

      expect(screen.getByText(message)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Save post" })).toBeDisabled();
      fireEvent.submit(screen.getByRole("form", { name: "Edit post" }));
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
});

describe("Post external link requests and actions", () => {
  const link = "https://example.com/article";
  const data = {
    theme: "Development",
    icon: "js",
    title: "An article",
    hashtags: "node",
    text: "Post text",
  };

  beforeEach(() => {
    jest.spyOn(api, "_request").mockResolvedValue({ _id: "post-1", ...data });
  });
  afterEach(() => jest.restoreAllMocks());

  const sentBody = () => JSON.parse(api._request.mock.calls[0][1].body);

  describe("Post external link API payload", () => {
    test.each([
      ["no link", {}, {}],
      ["a link", { externalLink: link }, { externalLink: link }],
      [
        "a link and text",
        { externalLink: link, externalLinkButtonText: "Read article" },
        { externalLink: link, externalLinkButtonText: "Read article" },
      ],
      ["empty fields", { externalLink: "", externalLinkButtonText: "" }, {}],
      ["orphaned text", { externalLinkButtonText: "Read article" }, {}],
    ])("addPost sends %s", async (_name, fields, expected) => {
      await api.addPost({ ...data, ...fields });

      expect(api._request).toHaveBeenCalledWith(
        "/posts",
        expect.objectContaining({ method: "POST" }),
      );
      expect(sentBody()).toEqual({ ...data, ...expected });
    });

    test.each([
      [link, "Read article"],
      [link, ""],
      ["", ""],
    ])(
      "editPost preserves update values including empty strings (%s, %s)",
      async (url, label) => {
        await api.editPost("post-1", {
          ...data,
          externalLink: url,
          externalLinkButtonText: label,
        });

        expect(api._request).toHaveBeenCalledWith(
          "/posts/post-1",
          expect.objectContaining({ method: "PATCH" }),
        );
        expect(sentBody()).toEqual({
          newTheme: data.theme,
          newIcon: data.icon,
          newTitle: data.title,
          newHashtags: data.hashtags,
          newText: data.text,
          newExternalLink: url,
          newExternalLinkButtonText: label,
        });
      },
    );

    test("editPost omits optional fields when not supplied", async () => {
      await api.editPost("post-1", data);

      expect(sentBody()).not.toHaveProperty("newExternalLink");
      expect(sentBody()).not.toHaveProperty("newExternalLinkButtonText");
    });
  });

  function renderPostsHook() {
    const options = {
      startLoading: jest.fn(),
      stopLoading: jest.fn(),
      openModal: jest.fn(),
      closeAllBlogPopups: jest.fn(),
    };
    return { ...renderHook(() => usePosts(options)), options };
  }

  describe("External link through post actions", () => {
    test.each([
      ["without a photo", []],
      [
        "with a photo",
        [new File(["photo"], "photo.jpg", { type: "image/jpeg" })],
      ],
    ])(
      "passes create fields through the upload action %s",
      async (_name, photoData) => {
        jest
          .spyOn(api, "uploadPhoto")
          .mockResolvedValue({ data: [{ filename: "photo.jpg" }] });
        const { result } = renderPostsHook();
        await act(async () => {
          await result.current.handleAddPost({
            ...data,
            externalLink: link,
            externalLinkButtonText: "Read article",
            photoData,
          });
        });

        expect(sentBody()).toEqual(
          expect.objectContaining({
            externalLink: link,
            externalLinkButtonText: "Read article",
          }),
        );
      },
    );

    test.each([
      [link, "Read article", []],
      [link, "", []],
      ["", "", []],
      [
        link,
        "Read article",
        [new File(["photo"], "photo.jpg", { type: "image/jpeg" })],
      ],
    ])(
      "passes edit fields through usePosts (%s, %s)",
      async (url, label, photoData) => {
        jest
          .spyOn(api, "uploadPhoto")
          .mockResolvedValue({ data: [{ filename: "photo.jpg" }] });
        const { result, options } = renderPostsHook();
        await act(async () => {
          result.current.handleEditPost("post-1", {
            ...data,
            externalLink: url,
            externalLinkButtonText: label,
            photoData,
          });
        });

        expect(sentBody()).toEqual(
          expect.objectContaining({
            newExternalLink: url,
            newExternalLinkButtonText: label,
          }),
        );
        expect(options.openModal).toHaveBeenCalledWith(
          expect.objectContaining({ status: "success" }),
        );
      },
    );
  });
});
