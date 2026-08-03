import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ProjectHashtags from "../../blog/components/ProjectHashtags";

describe("project hashtags dropdown", () => {
  const originalClientWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "clientWidth",
  );
  const originalOffsetWidth = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    "offsetWidth",
  );

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get() {
        if (this.classList?.contains("project-hashtags__container")) {
          return 260;
        }

        return 0;
      },
    });

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get() {
        const text = this.textContent || "";

        if (this.classList?.contains("project-hashtags__more-button")) {
          return 80;
        }

        return text.length * 8 + 44;
      },
    });
  });

  afterAll(() => {
    if (originalClientWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "clientWidth",
        originalClientWidth,
      );
    }

    if (originalOffsetWidth) {
      Object.defineProperty(
        HTMLElement.prototype,
        "offsetWidth",
        originalOffsetWidth,
      );
    }
  });

  test("moves overflowing hashtags into dropdown", async () => {
    const handleHashtagClick = jest.fn();

    render(
      <ProjectHashtags
        hashtags={[
          ["Frontend", 5],
          ["Backend", 4],
          ["Fullstack", 3],
          ["React", 2],
          ["Node.js", 1],
        ]}
        activeHashtag="All"
        onHashtagClick={handleHashtagClick}
      />,
    );

    const moreButton = await screen.findByRole("button", { name: /more/i });

    expect(moreButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("option", { name: "Backend" })).toBeNull();

    fireEvent.click(moreButton);

    expect(moreButton).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("option", { name: "Backend" })).toBeVisible();

    fireEvent.click(screen.getByRole("option", { name: "Backend" }));

    expect(handleHashtagClick).toHaveBeenCalledWith("Backend");

    await waitFor(() =>
      expect(screen.queryByRole("option", { name: "Backend" })).toBeNull(),
    );
  });
});
