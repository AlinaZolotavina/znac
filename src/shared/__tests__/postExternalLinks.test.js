import { act, renderHook } from "@testing-library/react";
import api from "../utils/api";
import usePosts from "../../features/blog/hooks/usePosts";

jest.mock("react-router-dom", () => ({ useNavigate: () => jest.fn() }));

const link = "https://example.com/article";
const data = {
  theme: "Web development",
  icon: "js",
  title: "An article",
  hashtags: "node",
  text: "Post text",
};

beforeEach(() => {
  jest.spyOn(api, "_request").mockResolvedValue({ _id: "post-1", ...data });
});
afterEach(() => jest.restoreAllMocks());

const sentBody = () => JSON.parse(api._request.mock.calls[0][1].body);

describe("Post external link API payload", () => {
  test.each([
    ["no link", {}, {}],
    ["a link", { externalLink: link }, { externalLink: link }],
    [
      "a link and text",
      { externalLink: link, externalLinkButtonText: "Read article" },
      { externalLink: link, externalLinkButtonText: "Read article" },
    ],
    ["empty fields", { externalLink: "", externalLinkButtonText: "" }, {}],
    ["orphaned text", { externalLinkButtonText: "Read article" }, {}],
  ])("addPost sends %s", async (_name, fields, expected) => {
    await api.addPost({ ...data, ...fields });

    expect(api._request).toHaveBeenCalledWith(
      "/posts",
      expect.objectContaining({ method: "POST" }),
    );
    expect(sentBody()).toEqual({ ...data, ...expected });
  });

  test.each([
    [link, "Read article"],
    [link, ""],
    ["", ""],
  ])(
    "editPost preserves update values including empty strings (%s, %s)",
    async (url, label) => {
      await api.editPost("post-1", {
        ...data,
        externalLink: url,
        externalLinkButtonText: label,
      });

      expect(api._request).toHaveBeenCalledWith(
        "/posts/post-1",
        expect.objectContaining({ method: "PATCH" }),
      );
      expect(sentBody()).toEqual({
        newTheme: data.theme,
        newIcon: data.icon,
        newTitle: data.title,
        newHashtags: data.hashtags,
        newText: data.text,
        newExternalLink: url,
        newExternalLinkButtonText: label,
      });
    },
  );

  test("editPost omits optional fields when not supplied", async () => {
    await api.editPost("post-1", data);

    expect(sentBody()).not.toHaveProperty("newExternalLink");
    expect(sentBody()).not.toHaveProperty("newExternalLinkButtonText");
  });
});

function renderPostsHook() {
  const options = {
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    openModal: jest.fn(),
    closeAllBlogPopups: jest.fn(),
  };
  return { ...renderHook(() => usePosts(options)), options };
}

describe("External link through post actions", () => {
  test.each([
    ["without a photo", []],
    [
      "with a photo",
      [new File(["photo"], "photo.jpg", { type: "image/jpeg" })],
    ],
  ])(
    "passes create fields through the upload action %s",
    async (_name, photoData) => {
      jest
        .spyOn(api, "uploadPhoto")
        .mockResolvedValue({ data: [{ filename: "photo.jpg" }] });
      const { result } = renderPostsHook();
      await act(async () => {
        await result.current.handleAddPost({
          ...data,
          externalLink: link,
          externalLinkButtonText: "Read article",
          photoData,
        });
      });

      expect(sentBody()).toEqual(
        expect.objectContaining({
          externalLink: link,
          externalLinkButtonText: "Read article",
        }),
      );
    },
  );

  test.each([
    [link, "Read article", []],
    [link, "", []],
    ["", "", []],
    [
      link,
      "Read article",
      [new File(["photo"], "photo.jpg", { type: "image/jpeg" })],
    ],
  ])(
    "passes edit fields through usePosts (%s, %s)",
    async (url, label, photoData) => {
      jest
        .spyOn(api, "uploadPhoto")
        .mockResolvedValue({ data: [{ filename: "photo.jpg" }] });
      const { result, options } = renderPostsHook();
      await act(async () => {
        result.current.handleEditPost("post-1", {
          ...data,
          externalLink: url,
          externalLinkButtonText: label,
          photoData,
        });
      });

      expect(sentBody()).toEqual(
        expect.objectContaining({
          newExternalLink: url,
          newExternalLinkButtonText: label,
        }),
      );
      expect(options.openModal).toHaveBeenCalledWith(
        expect.objectContaining({ status: "success" }),
      );
    },
  );
});
