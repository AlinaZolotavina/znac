import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import GetInTouchPopup from "../../blog/components/GetInTouchPopup";

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText("Name"), {
    target: { value: "Alina" },
  });
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value: "alina@test.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Your message"), {
    target: { value: "Hello from test" },
  });
}

describe("contact form", () => {
  test("submits contact form and closes on success", async () => {
    const onSubmit = jest.fn().mockResolvedValue(true);
    const onClose = jest.fn();

    render(
      <GetInTouchPopup
        isOpen
        isSendingReq={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Alina",
        email: "alina@test.com",
        message: "Hello from test",
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  test("keeps popup open when API returns error", async () => {
    const onSubmit = jest.fn().mockResolvedValue(false);
    const onClose = jest.fn();

    render(
      <GetInTouchPopup
        isOpen
        isSendingReq={false}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    fillForm();

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  test("disables submit while sending", () => {
    render(
      <GetInTouchPopup
        isOpen
        isSendingReq
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
