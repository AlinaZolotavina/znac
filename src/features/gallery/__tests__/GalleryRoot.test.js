import { act, renderHook, waitFor } from "@testing-library/react";
import usePhotos from "../hooks/usePhotos";
import { mockApi } from "../../../test/mockApi";
import { hashtags, photos } from "../../../test/fixtures/photo";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function renderUsePhotos(overrides = {}) {
  const props = {
    openModal: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    closeAllPopups: jest.fn(),
    screenWidth: 500,
    setScreenWidth: jest.fn(),
    hashtag: "",
    setHashtag: jest.fn(),
    lastHashtags: hashtags,
    setLastHashtags: jest.fn(),
    location: { pathname: "/" },
    setIsPhotoPopupOpen: jest.fn(),
    setIsDeletePhotoModalOpen: jest.fn(),
    ...overrides,
  };

  return {
    props,
    ...renderHook((hookProps) => usePhotos(hookProps), {
      initialProps: props,
    }),
  };
}

describe("gallery root logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getHashtags.mockResolvedValue({ data: hashtags });
    api.getPhotos.mockResolvedValue({ data: photos, page: 1, pages: 1 });
    api.increaseViews.mockImplementation((photoId) =>
      Promise.resolve({
        ...photos.find((photo) => photo._id === photoId),
        views: 100,
      }),
    );
  });

  test("loads initial photos", async () => {
    const { result } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    expect(api.getPhotos).toHaveBeenCalledWith(1, 20);
    expect(result.current.hasMorePhotos).toBe(true);
  });

  test("loads more photos", async () => {
    const { result } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    act(() => {
      result.current.showMorePhotos();
    });

    expect(result.current.photosToRender).toHaveLength(8);
    expect(result.current.hasMorePhotos).toBe(false);
  });

  test("opens photo and updates selected photo views", async () => {
    const setIsPhotoPopupOpen = jest.fn();
    const { result } = renderUsePhotos({ setIsPhotoPopupOpen });

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    act(() => {
      result.current.handlePhotoOpen(photos[0]);
    });

    expect(setIsPhotoPopupOpen).toHaveBeenCalledWith(true);
    expect(api.increaseViews).toHaveBeenCalledWith("photo-1");

    await waitFor(() => expect(result.current.selectedPhoto.views).toBe(100));
  });
});
