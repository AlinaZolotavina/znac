import { render, screen } from "@testing-library/react";
import BlogInput from "../components/BlogInput";
import BlogTextArea from "../components/BlogTextArea";

describe("blog form errors accessibility", () => {
  test("connects BlogInput error to input without removing reserved error node", () => {
    render(
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
    const { rerender } = render(
      <BlogInput
        placeholder="Title"
        classname="blog-input__field"
        inputType="text"
        inputValue="Post title"
        onChange={jest.fn()}
        isSendingReq={false}
        error="Title is required"
        inputName="post title"
      />,
    );

    const input = screen.getByRole("textbox");
    const error = screen.getByText("Title is required");

    rerender(
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

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(input).not.toHaveAccessibleDescription();
    expect(error).toBeInTheDocument();
    expect(error).toBeEmptyDOMElement();
  });

  test("connects BlogTextArea error to textarea", () => {
    render(
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
