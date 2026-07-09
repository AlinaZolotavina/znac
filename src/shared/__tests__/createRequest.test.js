import { createRequest } from "../utils/request";

describe("createRequest", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("sends credentials and returns JSON for successful responses", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ ok: true }),
    });

    const request = createRequest("https://api.test");
    const result = await request("/profile", { method: "GET" });

    expect(fetch).toHaveBeenCalledWith("https://api.test/profile", {
      credentials: "include",
      method: "GET",
    });
    expect(result).toEqual({ ok: true });
  });

  test.each([
    [401, "AUTH_ERROR"],
    [403, "FORBIDDEN_ERROR"],
    [404, "NOT_FOUND_ERROR"],
    [500, "API_ERROR"],
  ])("maps HTTP %s to %s", async (status, type) => {
    fetch.mockResolvedValue({
      ok: false,
      status,
      json: jest.fn().mockResolvedValue({ message: "Request failed" }),
    });

    const request = createRequest("https://api.test");

    await expect(request("/broken")).rejects.toMatchObject({
      message: "Request failed",
      status,
      type,
    });
  });
});
