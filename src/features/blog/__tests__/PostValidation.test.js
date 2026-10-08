import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { posts } from "../../../test/fixtures/post";
import NewPostPopup from "../components/NewPostPopup";
import EditPostPopup from "../components/EditPostPopup";

describe("post form validation", () => {
  test("allows extended title symbols in new post popup", () => {
    renderWithProviders(
      <NewPostPopup
        isOpen
        onClose={jest.fn()}
        isSendingReq={false}
        onAddPost={jest.fn()}
      />,
    );

    const titleInput = screen.getByPlaceholderText("Title");

    fireEvent.change(titleInput, {
      target: {
        value: "React ^ hooks & state #notes",
      },
    });

    expect(
      screen.queryByText(
        "Only letters, numbers, spaces and _()-:!?^&# are allowed",
      ),
    ).toBeNull();
  });

  test("shows title and text length errors in new post popup", () => {
    renderWithProviders(
      <NewPostPopup
        isOpen
        onClose={jest.fn()}
        isSendingReq={false}
        onAddPost={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: {
        value: "a".repeat(71),
      },
    });
    fireEvent.change(screen.getByPlaceholderText("Text"), {
      target: {
        value: "a".repeat(6001),
      },
    });

    expect(
      screen.getByText("Title must be 70 characters or fewer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Text must be 6000 characters or fewer"),
    ).toBeInTheDocument();
  });

  test("shows title and text length errors in edit post popup", () => {
    renderWithProviders(
      <EditPostPopup
        isOpen
        onClose={jest.fn()}
        isSendingReq={false}
        post={posts[0]}
        onEditPost={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: {
        value: "a".repeat(71),
      },
    });
    fireEvent.change(screen.getByPlaceholderText("Text"), {
      target: {
        value: "a".repeat(6001),
      },
    });

    expect(
      screen.getByText("Title must be 70 characters or fewer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Text must be 6000 characters or fewer"),
    ).toBeInTheDocument();
  });
});
