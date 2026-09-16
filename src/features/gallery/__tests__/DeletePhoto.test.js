import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import usePhotos from "../hooks/usePhotos";
import { mockApi } from "../../../test/mockApi";
import { photos } from "../../../test/fixtures/photo";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

function renderUsePhotos() {
  const queryClient = createTestQueryClient();
  const props = {
    openModal: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    closeAllPopups: jest.fn(),
    screenWidth: 500,
    setScreenWidth: jest.fn(),
    hashtag: "",
    setHashtag: jest.fn(),
    location: { pathname: "/" },
    setIsPhotoPopupOpen: jest.fn(),
    setIsDeletePhotoModalOpen: jest.fn(),
  };

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return {
    props,
    ...renderHook((hookProps) => usePhotos(hookProps), {
      initialProps: props,
      wrapper,
    }),
  };
}

describe("delete photo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
