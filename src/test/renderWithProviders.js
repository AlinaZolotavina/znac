import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

export function renderWithProviders(
  ui,
  { route = "/", routerProps = {}, ...renderOptions } = {},
) {
  return render(
    <MemoryRouter initialEntries={[route]} {...routerProps}>
      {ui}
    </MemoryRouter>,
    renderOptions,
  );
}
