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

function renderUsePosts() {
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
  };

  return renderHook((hookProps) => usePosts(hookProps), {
    wrapper: createRouterWrapper(),
    initialProps: props,
  });
}

describe("delete post", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPosts.mockResolvedValue({ data: posts, page: 1, pages: 1 });
    api.deletePost.mockResolvedValue({});
  });

  test("deletes post and removes it from list", async () => {
    const { result } = renderUsePosts();

    await waitFor(() =>
      expect(result.current.postsToRender).toHaveLength(posts.length),
    );

    await act(async () => {
      result.current.handlePostDelete(posts[0]);
    });

    await waitFor(() => expect(api.deletePost).toHaveBeenCalledWith("post-1"));
    expect(result.current.postsToRender).not.toContainEqual(
      expect.objectContaining({ _id: "post-1" }),
    );
  });
});
