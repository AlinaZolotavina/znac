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

  return {
    props,
    ...renderHook((hookProps) => usePosts(hookProps), {
      wrapper: createRouterWrapper(),
      initialProps: props,
    }),
  };
}

describe("edit post", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPosts.mockResolvedValue({ data: posts, page: 1, pages: 1 });
  });

  test("opens edit popup and edits post", async () => {
    const updatedPost = { ...posts[0], title: "Updated post" };
    api.editPost.mockResolvedValue(updatedPost);

    const { result, props } = renderUsePosts();

    await waitFor(() =>
      expect(result.current.postsToRender).toHaveLength(posts.length),
    );

    act(() => {
      result.current.handleEditPostPopupOpen(posts[0]);
    });

    expect(props.setIsEditPostPopupOpen).toHaveBeenCalledWith(true);
    expect(result.current.postToEdit).toEqual(posts[0]);

    await act(async () => {
      result.current.handleEditPost("post-1", {
        theme: "React",
        icon: "react",
        title: "Updated post",
        hashtags: ["react"],
        text: "Updated text",
        photoData: [[]],
      });
    });

    await waitFor(() => expect(api.editPost).toHaveBeenCalled());
    expect(result.current.postsToRender).toContainEqual(updatedPost);
  });
});
