import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import NewPostRadioButton from "../components/NewPostRadioButton";

describe("NewPostRadioButton native semantics", () => {
  test("uses native radio input and label for mouse selection", () => {
    const handleClick = jest.fn();

    renderWithProviders(
      <NewPostRadioButton
        classname="new-post__radio-btn_type_theme"
        radioBtnValue="Travel"
        radioBtnName="theme"
        checkValue=""
        onClick={handleClick}
        labelText="Travel"
      />,
    );

    const radio = screen.getByRole("radio", { name: "Travel" });

    expect(radio).toHaveAttribute("type", "radio");

    fireEvent.click(screen.getByText("Travel"));

    expect(handleClick).toHaveBeenCalledWith("Travel");
  });
});
