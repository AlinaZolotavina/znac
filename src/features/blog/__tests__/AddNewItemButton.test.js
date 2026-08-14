import { fireEvent, screen } from "@testing-library/react";
import AddNewItemButton from "../components/AddNewItemButton";
import { renderWithProviders } from "../../../test/renderWithProviders";

describe("AddNewItemButton", () => {
  const originalInnerWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: originalInnerWidth,
    });
  });

  test("keeps an accessible name when visual text is hidden on small screens", () => {
    const onAddNewItem = jest.fn();

    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      value: 500,
    });

    renderWithProviders(
      <AddNewItemButton
        buttonText="New post"
        onAddNewItem={onAddNewItem}
      />,
    );

    const button = screen.getByRole("button", { name: "New post" });

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    expect(onAddNewItem).toHaveBeenCalledTimes(1);
  });
});
