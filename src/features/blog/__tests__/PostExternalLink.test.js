import { fireEvent, render, screen } from "@testing-library/react";
import Post from "../components/Post";
import CurrentPost from "../components/CurrentPost";

const post = {
  _id: "post-1",
  title: "An article",
  theme: "Web development",
  icon: "js",
  text: "Post text",
  hashtags: [],
  createdAt: "2026-10-18T10:00:00.000Z",
};
const link = "https://example.com/article";

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
    const container = image.parentElement;

    fireEvent.load(image);
    expect(container).not.toHaveClass("post__image-container_state_error");
    expect(image).toHaveAttribute("src", originalPost.photoLink);

    fireEvent.error(image);
    expect(container).toHaveClass("post__image-container_state_error");
    expect(container).not.toHaveClass("post__image-container_state_loading");
    expect(image).not.toHaveAttribute("src", originalPost.photoLink);

    const nextPost = {
      ...originalPost,
      photoLink: "https://example.com/another.jpg",
    };
    rerender(<CurrentPost post={nextPost} location="single-post" />);
    fireEvent.load(screen.getByRole("img"));
    expect(container).not.toHaveClass("post__image-container_state_error");
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
      expect(button.closest("button")).toBeNull();
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
          post={{ ...post, externalLink: "javascript:alert(1)" }}
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
