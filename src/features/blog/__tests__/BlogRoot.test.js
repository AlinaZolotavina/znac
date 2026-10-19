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

    await waitFor(() =>
      expect(result.current.postsToRender).toHaveLength(posts.length),
    );

    expect(api.getPosts).toHaveBeenCalledWith(1, 12, {
      search: "",
      theme: "All",
    });
    expect(result.current.hasMorePosts).toBe(false);
  });

  const allPosts = Array.from({ length: 29 }, (_, index) => ({
    ...posts[0],
    _id: `post-${index + 1}`,
  }));

  function mockPaginatedPosts(data = allPosts) {
    api.getPosts.mockImplementation((page, limit) =>
      Promise.resolve({
        data: data.slice((page - 1) * limit, page * limit),
        page,
        pages: Math.ceil(data.length / limit),
      }),
    );
  }

  test.each([
    [375, 6, 2],
    [599, 6, 2],
    [600, 12, 4],
    [768, 12, 4],
    [1440, 12, 4],
  ])(
    "at %ipx initially shows %i posts and adds %i per click",
    async (screenWidth, initial, increment) => {
      mockPaginatedPosts();
      const { result } = renderUsePosts({ screenWidth });

      await waitFor(() => expect(result.current.isPostsLoading).toBe(false));
      expect(result.current.postsToRender).toHaveLength(initial);
      expect(result.current.hasMorePosts).toBe(true);

      for (
        let expected = initial + increment;
        expected < allPosts.length;
        expected += increment
      ) {
        await act(async () => {
          await result.current.showMorePosts();
        });
        expect(result.current.postsToRender).toEqual(
          allPosts.slice(0, expected),
        );
        expect(result.current.hasMorePosts).toBe(true);
      }

      await act(async () => {
        await result.current.showMorePosts();
      });
      expect(result.current.postsToRender).toEqual(allPosts);
      expect(result.current.hasMorePosts).toBe(false);
      expect(api.getPosts.mock.calls.map(([page]) => page)).toEqual([1, 2, 3]);
    },
  );

  test("uses the larger initial quantity after resizing from mobile to tablet", async () => {
    mockPaginatedPosts();
    const { result, props, rerender } = renderUsePosts({ screenWidth: 375 });
    await waitFor(() => expect(result.current.isPostsLoading).toBe(false));
    expect(result.current.postsToRender).toHaveLength(6);

    rerender({ ...props, screenWidth: 768 });
    act(() => result.current.calculatePostsCount());
    expect(result.current.postsToRender).toHaveLength(12);

    await act(async () => {
      await result.current.showMorePosts();
    });
    expect(result.current.postsToRender).toHaveLength(16);
  });

  test("resets filtered results and restores the cached list with its pagination", async () => {
    mockPaginatedPosts();
    const { result } = renderUsePosts();
    await waitFor(() => expect(result.current.isPostsLoading).toBe(false));
    await act(async () => {
      await result.current.showMorePosts();
    });
    expect(result.current.postsToRender).toHaveLength(16);

    api.getPosts.mockResolvedValueOnce({ data: posts, page: 1, pages: 1 });
    await act(async () => result.current.handlePostsSearch("hooks"));
    expect(result.current.postsToRender).toEqual(posts);
    expect(result.current.hasMorePosts).toBe(false);

    act(() => result.current.handlePostsSearch(""));
    expect(result.current.postsToRender).toEqual(allPosts.slice(0, 12));
    expect(result.current.hasMorePosts).toBe(true);

    for (const count of [16, 20, 24, 28, 29]) {
      await act(async () => {
        await result.current.showMorePosts();
      });
      expect(result.current.postsToRender).toEqual(allPosts.slice(0, count));
    }
    expect(result.current.hasMorePosts).toBe(false);
    expect(api.getPosts).toHaveBeenLastCalledWith(3, 12, {
      search: "",
      theme: "All",
    });
  });

  test("keeps existing posts visible if loading the next page fails and allows retrying", async () => {
    mockPaginatedPosts();
    const { result } = renderUsePosts();
    await waitFor(() => expect(result.current.isPostsLoading).toBe(false));
    api.getPosts.mockRejectedValueOnce(new Error("Request failed"));
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    try {
      await act(async () => {
        await result.current.showMorePosts();
      });
      expect(result.current.postsToRender).toEqual(allPosts.slice(0, 12));
      expect(result.current.hasMorePosts).toBe(true);

      await act(async () => {
        await result.current.showMorePosts();
      });
      expect(result.current.postsToRender).toEqual(allPosts.slice(0, 16));
    } finally {
      consoleError.mockRestore();
    }
  });
});
