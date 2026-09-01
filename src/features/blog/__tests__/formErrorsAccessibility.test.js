import { screen } from "@testing-library/react";
import BlogInput from "../components/BlogInput";
import BlogTextArea from "../components/BlogTextArea";
import { renderWithProviders } from "../../../test/renderWithProviders";

describe("blog form errors accessibility", () => {
  test("connects BlogInput error to input without removing reserved error node", () => {
    renderWithProviders(
      <BlogInput
        placeholder="Title"
        classname="blog-input__field"
        inputType="text"
        inputValue=""
        onChange={jest.fn()}
        isSendingReq={false}
        error="Title is required"
        inputName="post title"
      />,
    );

    const input = screen.getByRole("textbox");
    const error = screen.getByText("Title is required");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "post-title-error");
    expect(error).toHaveAttribute("id", "post-title-error");
    expect(error).not.toHaveAttribute("role");
  });

  test("keeps BlogInput error node but does not expose empty error", () => {
    renderWithProviders(
      <BlogInput
        placeholder="Title"
        classname="blog-input__field"
        inputType="text"
        inputValue="Post title"
        onChange={jest.fn()}
        isSendingReq={false}
        error=""
        inputName="post title"
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(document.getElementById("post-title-error")).toBeEmptyDOMElement();
  });

  test("connects BlogTextArea error to textarea", () => {
    renderWithProviders(
      <BlogTextArea
        placeholder="Text"
        value=""
        onChange={jest.fn()}
        isSendingReq={false}
        error="Please enter your message"
        inputName="post text"
      />,
    );

    const textarea = screen.getByRole("textbox");
    const error = screen.getByText("Please enter your message");

    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "post-text-error");
    expect(error).toHaveAttribute("id", "post-text-error");
    expect(error).not.toHaveAttribute("role");
  });
});
