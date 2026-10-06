import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import MainPage from "../components/MainPage";
import { mockApi } from "../../test/mockApi";
import { photos } from "../../test/fixtures/photo";

jest.mock("../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../test/mockApi").mockApi,
}));

jest.mock("../../features/blog/hooks/usePosts", () => ({
  __esModule: true,
  default: () => ({
    postsToRender: [],
    handleEditPostPopupOpen: jest.fn(),
    postToEdit: null,
    handleEditPost: jest.fn(),
    handleDeletePostModalOpen: jest.fn(),
    handlePostDelete: jest.fn(),
    postToDelete: null,
    isPostsLoading: false,
  }),
}));

jest.mock("../../features/blog/components/EditPostPopup", () => () => null);

const api = mockApi;

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

function renderMainPage(queryClient = createTestQueryClient()) {
  const props = {
    loggedIn: false,
    handleSignout: jest.fn(),
    isLoading: false,
    openModal: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <MainPage {...props} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("main page photos query", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPhotos.mockResolvedValue({
      data: photos.slice(0, 4),
      page: 1,
      limit: 4,
      total: photos.length,
      pages: 2,
    });
  });

  test("uses the shared photos query cache for latest photos", async () => {
    const queryClient = createTestQueryClient();
    const view = renderMainPage(queryClient);

    await waitFor(() => expect(api.getPhotos).toHaveBeenCalledWith(1, 4));
    expect(await screen.findByText("#tag-1")).toBeInTheDocument();

    view.unmount();
    renderMainPage(queryClient);

    expect(await screen.findByText("#tag-1")).toBeInTheDocument();
    expect(api.getPhotos).toHaveBeenCalledTimes(1);
  });
});
