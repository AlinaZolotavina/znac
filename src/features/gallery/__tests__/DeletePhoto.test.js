import { act, renderHook, waitFor } from "@testing-library/react";
import usePhotos from "../hooks/usePhotos";
import { mockApi } from "../../../test/mockApi";
import { hashtags, photos } from "../../../test/fixtures/photo";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function renderUsePhotos() {
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
  };

  return {
    props,
    ...renderHook((hookProps) => usePhotos(hookProps), {
      initialProps: props,
    }),
  };
}

describe("delete photo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getHashtags.mockResolvedValue({ data: hashtags });
    api.getPhotos.mockResolvedValue({ data: photos, page: 1, pages: 1 });
    api.deletePhoto.mockResolvedValue({});
  });

  test("deletes photo and removes it from rendered list", async () => {
    const { result, props } = renderUsePhotos();

    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));

    await act(async () => {
      result.current.handlePhotoDelete(photos[0]);
    });

    await waitFor(() => expect(api.deletePhoto).toHaveBeenCalledWith("photo-1"));
    expect(result.current.photosToRender).not.toContainEqual(
      expect.objectContaining({ _id: "photo-1" }),
    );
    expect(props.openModal).toHaveBeenCalledWith(
      expect.objectContaining({ status: "success" }),
    );
  });
});
