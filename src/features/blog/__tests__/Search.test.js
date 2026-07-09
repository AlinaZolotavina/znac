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

describe("blog posts search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPosts.mockResolvedValue({ data: posts, page: 1, pages: 1 });
  });

  test("searches posts", async () => {
    const { result, props } = renderUsePosts();

    await waitFor(() => expect(result.current.postsToRender).toHaveLength(3));

    act(() => {
      result.current.handlePostsSearch("hooks");
    });

    expect(props.setQuery).toHaveBeenCalledWith("hooks");
    await waitFor(() =>
      expect(api.getPosts).toHaveBeenLastCalledWith(1, 8, {
        search: "hooks",
        theme: "All",
      }),
    );
  });

  test("combines search and theme filter", async () => {
    const { result } = renderUsePosts({
      query: "hooks",
      activePostHashtag: "React",
    });

    await waitFor(() => expect(result.current.postsToRender).toHaveLength(3));

    act(() => {
      result.current.handlePostsSearch("state");
    });

    await waitFor(() =>
      expect(api.getPosts).toHaveBeenLastCalledWith(1, 8, {
        search: "state",
        theme: "React",
      }),
    );
  });

  test("filters posts by theme", async () => {
    const { result, props } = renderUsePosts();

    await waitFor(() => expect(result.current.postsToRender).toHaveLength(3));

    act(() => {
      result.current.handlePostHashtagClick("Design");
    });

    expect(props.setActivePostHashtag).toHaveBeenCalledWith("Design");
    await waitFor(() =>
      expect(api.getPosts).toHaveBeenLastCalledWith(1, 8, {
        search: "",
        theme: "Design",
      }),
    );
  });
});
