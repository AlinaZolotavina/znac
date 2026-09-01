import { fireEvent, screen } from "@testing-library/react";
import Search from "../components/Search";
import EditingHashtags from "../components/EditingHashtags";
import { renderWithProviders } from "../../../test/renderWithProviders";

describe("gallery form errors accessibility", () => {
  test("connects search validation error to search input", () => {
    renderWithProviders(
      <Search
        onSubmit={jest.fn()}
        onClearSearch={jest.fn()}
        isLoading={false}
        hashtag=""
        hashtagSetter={jest.fn()}
      />,
    );

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "bad-tag!" } });

    const error = screen.getByText(
      "Only letters, numbers and underscores are allowed",
    );

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "gallery-search-error");
    expect(error).toHaveAttribute("id", "gallery-search-error");
    expect(error).not.toHaveAttribute("role");
  });

  test("does not expose empty search error", () => {
    renderWithProviders(
      <Search
        onSubmit={jest.fn()}
        onClearSearch={jest.fn()}
        isLoading={false}
        hashtag=""
        hashtagSetter={jest.fn()}
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(document.getElementById("gallery-search-error")).toBeEmptyDOMElement();
  });

  test("connects edit hashtags validation error to input", () => {
    renderWithProviders(
      <EditingHashtags
        editingHashtags="winter"
        onSubmit={jest.fn()}
        isSendingReq={false}
        photoId="photo-1"
      />,
    );

    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "" } });

    const error = screen.getByText("You must add at least one hashtag");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute(
      "aria-describedby",
      "edit-photo-hashtags-photo-1-error",
    );
    expect(error).toHaveAttribute("id", "edit-photo-hashtags-photo-1-error");
    expect(error).not.toHaveAttribute("role");
  });
});
