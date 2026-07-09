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
    screenWidth: 800,
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

  return renderHook((hookProps) => usePhotos(hookProps), {
    initialProps: props,
  });
}

describe("gallery search", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getHashtags.mockResolvedValue({ data: hashtags });
    api.getPhotos.mockResolvedValue({ data: photos, page: 1, pages: 1 });
    api.findPhoto.mockResolvedValue({
      data: [photos[2]],
      page: 1,
      pages: 1,
    });
    api.addHashtag.mockResolvedValue({
      _id: "tag-2",
      name: "portrait",
      __v: 0,
      createdAt: "2026-01-01",
    });
  });

  test("searches photos by hashtag and clears search from cached list", async () => {
    const { result } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoSearch(" portrait ");
    });

    await waitFor(() =>
      expect(api.findPhoto).toHaveBeenCalledWith("portrait", 1, 20),
    );
    expect(result.current.photosToRender).toEqual([photos[2]]);

    act(() => {
      result.current.handleClearPhotoSearch();
    });

    expect(result.current.photosToRender).toHaveLength(6);
  });
});
