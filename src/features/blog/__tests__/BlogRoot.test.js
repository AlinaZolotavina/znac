import { act, renderHook, waitFor } from "@testing-library/react";
import usePosts from "../hooks/usePosts";
import { createRouterWrapper } from "../../../test/mockRouter";
import { mockApi } from "../../../test/mockApi";
import { posts } from "../../../test/fixtures/post";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function renderUsePosts(overrides = {}) {
  const props = {
    screenWidth: 1300,
    isAlinaRoute: true,
    query: "",
    setQuery: jest.fn(),
    activePostHashtag: "All",
    setActivePostHashtag: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    openModal: jest.fn(),
    closeAllBlogPopups: jest.fn(),
    setIsEditPostPopupOpen: jest.fn(),
    setIsDeletePostModalOpen: jest.fn(),
    setRedirectAfterDelete: jest.fn(),
    redirectAfterDelete: false,
    ...overrides,
  };

  return {
    props,
    ...renderHook((hookProps) => usePosts(hookProps), {
      wrapper: createRouterWrapper(),
      initialProps: props,
    }),
  };
}

describe("blog posts root logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPosts.mockResolvedValue({ data: posts, page: 1, pages: 1 });
  });

  test("loads posts", async () => {
    const { result } = renderUsePosts();

    await waitFor(() => expect(result.current.postsToRender).toHaveLength(3));

    expect(api.getPosts).toHaveBeenCalledWith(1, 8, {
      search: "",
      theme: "All",
    });
    expect(result.current.hasMorePosts).toBe(true);
  });

  test("shows more posts after responsive count calculation", async () => {
    const { result } = renderUsePosts();

    await waitFor(() => expect(result.current.postsToRender).toHaveLength(3));

    act(() => {
      result.current.calculatePostsCount();
    });

    await waitFor(() => expect(result.current.postsToRender).toHaveLength(5));
  });
});
