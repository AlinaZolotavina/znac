import { MemoryRouter } from "react-router-dom";

export function createRouterWrapper(initialEntries = ["/"]) {
  return function RouterWrapper({ children }) {
    return <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;
  };
}
