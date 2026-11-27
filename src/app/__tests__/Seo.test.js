import { act, cleanup, render, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import RouteSeo from "../components/RouteSeo";
import CurrentPostPage from "../../features/blog/components/CurrentPostPage";
import api from "../../shared/utils/api";

jest.mock("../../shared/utils/api", () => ({
  __esModule: true,
  default: { getPost: jest.fn() },
}));
jest.mock("../../features/blog/components/BlogHeader", () => () => null);
jest.mock("../../features/blog/components/CurrentPost", () => () => null);

const openModal = jest.fn();
let navigate;
const post = { _id: "one", title: "First post", text: "First description", photoLink: "https://znac.org/post.jpg" };
const meta = (selector) => document.head.querySelector(selector)?.getAttribute("content");
const canonical = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute("href");

function Harness({ version }) {
  const { pathname } = useLocation();
  navigate = useNavigate();
  return (
    <>
      <RouteSeo pathname={pathname} />
      <Routes>
        <Route path="/journal/posts/:id" element={<CurrentPostPage postVersion={version} openModal={openModal} />} />
        <Route path="*" element={null} />
      </Routes>
    </>
  );
}

function tree(path = "/journal/posts/one", version = 0) {
  return (
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Harness version={version} />
    </MemoryRouter>
  );
}

function expectNoindex() {
  expect(meta('meta[name="robots"]')).toBe("noindex,follow");
  expect(canonical()).toBeUndefined();
  expect(meta('meta[property="og:url"]')).toBeUndefined();
}

beforeEach(() => jest.clearAllMocks());
afterEach(() => {
  cleanup();
  document.head.innerHTML = "";
});

test("clears article metadata on reload failure and restores it after recovery", async () => {
  api.getPost.mockResolvedValueOnce(post);
  const view = render(tree());
  await waitFor(() => expect(document.title).toBe("First post — ZNAC"));
  expect(canonical()).toBe("https://znac.org/journal/posts/one");
  expect(meta('meta[name="robots"]')).toBe("index,follow");

  let reject;
  api.getPost.mockImplementationOnce(() => new Promise((resolve, rejectRequest) => { reject = rejectRequest; }));
  view.rerender(tree(undefined, 1));
  expectNoindex();
  expect(document.title).toBe("Loading post — ZNAC");
  expect(meta('meta[property="og:image"]')).toBe("https://znac.org/og-image.jpg");

  await act(async () => reject(Object.assign(new Error("Missing"), { status: 404 })));
  expectNoindex();
  expect(document.title).toBe("Post not found — ZNAC");

  api.getPost.mockResolvedValueOnce({ ...post, title: "Updated post" });
  view.rerender(tree(undefined, 2));
  await waitFor(() => expect(document.title).toBe("Updated post — ZNAC"));
  expect(meta('meta[name="robots"]')).toBe("index,follow");
  expect(canonical()).toBe("https://znac.org/journal/posts/one");
  expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
});

test("a missing post and unknown nested route cannot retain the previous article metadata", async () => {
  api.getPost.mockResolvedValueOnce(post);
  render(tree());
  await waitFor(() => expect(document.title).toBe("First post — ZNAC"));
  api.getPost.mockRejectedValueOnce(Object.assign(new Error("Missing"), { status: 404 }));
  await act(async () => navigate("/journal/posts/missing"));
  expectNoindex();
  expect(document.title).toBe("Post not found — ZNAC");
  await act(async () => navigate("/journal/posts/missing/extra"));
  expectNoindex();
  expect(document.title).toBe("Page not found — ZNAC");
});

test("ignores an old response after navigation to a different post", async () => {
  let resolveOld;
  api.getPost.mockImplementationOnce(() => new Promise((resolve) => { resolveOld = resolve; }));
  render(tree());
  expectNoindex();
  api.getPost.mockResolvedValueOnce({ ...post, _id: "two", title: "Second post" });
  await act(async () => navigate("/journal/posts/two"));
  expect(document.title).toBe("Second post — ZNAC");
  await act(async () => resolveOld(post));
  expect(document.title).toBe("Second post — ZNAC");
  expect(canonical()).toBe("https://znac.org/journal/posts/two");
  expect(openModal).not.toHaveBeenCalled();
});

test.each([
  ["/signin", "Sign in"],
  ["/signup", "Sign up"],
  ["/signin/recovery", "Recover password"],
  ["/reset-password/secret-token", "Reset password"],
  ["/password-changed", "Password changed"],
  ["/profile", "Profile"],
  ["/profile/update-email/secret-token", "Confirm email change"],
  ["/profile/missing", "Page not found"],
])("sets private metadata for %s after leaving an article", async (path, title) => {
  api.getPost.mockResolvedValueOnce(post);
  render(tree());
  await waitFor(() => expect(document.title).toBe("First post — ZNAC"));
  await act(async () => navigate(path));
  expect(document.title).toBe(`${title} — ZNAC`);
  expectNoindex();
  expect(document.head.innerHTML).not.toContain("secret-token");
});

test.each(["/", "/journal", "/journal/posts", "/journal/projects", "/journal/about", "/gallery"])(
  "restores public metadata for %s after a private page", async (path) => {
    render(tree("/signin"));
    await act(async () => navigate(`${path}?search=test`));
    expect(meta('meta[name="robots"]')).toBe("index,follow");
    expect(canonical()).toBe(`https://znac.org${path}`);
    expect(meta('meta[property="og:url"]')).toBe(`https://znac.org${path}`);
  },
);
