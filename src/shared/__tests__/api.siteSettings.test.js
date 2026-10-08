jest.mock("../../config/index", () => ({
  API_URL: "https://api.test",
}));

const mockRequest = jest.fn();

jest.mock("../utils/request", () => ({
  createRequest: jest.fn(() => mockRequest),
}));

describe("site settings API methods", () => {
  let api;

  beforeEach(() => {
    jest.clearAllMocks();
    api = require("../utils/api").default;
  });

  test("gets public site settings", () => {
    api.getSiteSettings();

    expect(mockRequest).toHaveBeenCalledWith("/settings", {
      method: "GET",
    });
  });

  test("updates hero image", () => {
    const formData = new FormData();

    api.updateHeroImage("main", formData);

    expect(mockRequest).toHaveBeenCalledWith("/settings/heroes/main", {
      method: "PATCH",
      body: formData,
    });
  });

  test("updates signup enabled setting", () => {
    api.updateSignupEnabled(false);

    expect(mockRequest).toHaveBeenCalledWith("/settings/auth/signup", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enabled: false,
      }),
    });
  });

  test("updates accent color setting", () => {
    api.updateAccentColor("#aabbcc");

    expect(mockRequest).toHaveBeenCalledWith("/settings/colors/accent", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color: "#aabbcc",
      }),
    });
  });
});
