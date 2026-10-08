import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import GalleryRoot from "../GalleryRoot";
import { mockApi } from "../../../test/mockApi";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

jest.mock("../hooks/usePhotos", () => ({
  __esModule: true,
  default: () => ({
    selectedPhoto: null,
    hashtagsOfSelectedPhoto: [],
    viewsOfSelectedPhoto: 0,
    areHashtagsEditing: false,
    isLeftFlipDisabled: true,
    isRightFlipDisabled: true,
    photosToRender: [],
    currentPhotosNumber: 0,
    hasMorePhotos: false,
    isPhotosLoading: false,
    handlePhotoOpen: jest.fn(),
    handlePhotoFlip: jest.fn(),
    handlePhotoDelete: jest.fn(),
    handleDeletePhotoModalOpen: jest.fn(),
    handlePhotoSearch: jest.fn(),
    handleClearPhotoSearch: jest.fn(),
    handlePhotoHashtagClick: jest.fn(),
    handleEditHashtags: jest.fn(),
    handleEditHashtagsBtnClick: jest.fn(),
    handleAddPhotoFromPc: jest.fn(),
    handleAddPhotoViaLink: jest.fn(),
    showMorePhotos: jest.fn(),
  }),
}));

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderGalleryRoot() {
  return render(
    <QueryClientProvider client={createTestQueryClient()}>
      <MemoryRouter initialEntries={["/"]}>
        <GalleryRoot
          loggedIn={false}
          isAuthInitialized
          handleSignout={jest.fn()}
          isLoading={false}
          openModal={jest.fn()}
          startLoading={jest.fn()}
          stopLoading={jest.fn()}
          screenWidth={1280}
          setScreenWidth={jest.fn()}
          closeModal={jest.fn()}
          onMenuClick={jest.fn()}
          isMenuOpen={false}
          onContactClick={jest.fn()}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("gallery hero", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApi.getHashtags.mockResolvedValue({
      data: [],
    });
    mockApi.getSiteSettings.mockResolvedValue({
      heroes: {
        main: null,
        gallery: {
          url: "https://api.test/uploads/heroes/gallery-hero.jpg",
          filename: "gallery-hero.jpg",
          updatedAt: "2026-10-07T00:00:00.000Z",
        },
      },
      auth: {
        signupEnabled: false,
      },
    });
  });

test("uses site settings gallery hero image", async () => {
    const { container } = renderGalleryRoot();

    await waitFor(() =>
      expect(container.querySelector(".home").style.backgroundImage).toContain(
        "https://api.test/uploads/heroes/gallery-hero.jpg",
      ),
    );
  });
});
