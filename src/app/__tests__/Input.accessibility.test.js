import { fireEvent, screen } from "@testing-library/react";
import Input from "../components/Input";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("Input accessibility", () => {
  test("connects field error to input", () => {
    renderWithProviders(
      <Input
        inputLabel="E-mail"
        placeholder="Enter e-mail"
        classname="input__field"
        inputType="text"
        inputValue="wrong"
        onChange={jest.fn()}
        isSendingReq={false}
        error="Please enter a valid e-mail"
        inputName="email"
      />,
    );

    const input = screen.getByRole("textbox");
    const error = screen.getByText("Please enter a valid e-mail");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    expect(error).toHaveAttribute("id", "email-error");
  });

  test("does not leave broken aria-describedby when valid", () => {
    renderWithProviders(
      <Input
        inputLabel="E-mail"
        placeholder="Enter e-mail"
        classname="input__field"
        inputType="text"
        inputValue="test@example.com"
        onChange={jest.fn()}
        isSendingReq={false}
        error=""
        inputName="email"
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(document.getElementById("email-error")).toBeEmptyDOMElement();
  });

  test("keeps input change behavior", () => {
    const handleChange = jest.fn();

    renderWithProviders(
      <Input
        inputLabel="Name"
        placeholder="Enter name"
        classname="input__field"
        inputType="text"
        inputValue=""
        onChange={handleChange}
        isSendingReq={false}
        error=""
      />,
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Alina" },
    });

    expect(handleChange).toHaveBeenCalled();
  });
});
