import { QueryClient } from "@tanstack/react-query";
import { getPhotosQueryOptions, photoKeys } from "../queries/photoQueries";
import { mockApi } from "../../../test/mockApi";

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
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

describe("photo queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getPhotos.mockImplementation((page, limit) =>
      Promise.resolve({
        data: [],
        page,
        limit,
        total: 0,
        pages: 1,
      }),
    );
  });

  test("uses page and limit in the photos query key", () => {
    expect(photoKeys.list({ page: 1, limit: 20 })).toEqual([
      "photos",
      { page: 1, limit: 20 },
    ]);
    expect(photoKeys.list({ page: 2, limit: 20 })).not.toEqual(
      photoKeys.list({ page: 1, limit: 20 }),
    );
    expect(photoKeys.list({ page: 1, limit: 4 })).not.toEqual(
      photoKeys.list({ page: 1, limit: 20 }),
    );
  });

  test("reuses fresh cached photos and separates different page and limit entries", async () => {
    const queryClient = createTestQueryClient();

    await queryClient.fetchQuery(getPhotosQueryOptions(1, 20));
    await queryClient.fetchQuery(getPhotosQueryOptions(1, 20));
    await queryClient.fetchQuery(getPhotosQueryOptions(2, 20));
    await queryClient.fetchQuery(getPhotosQueryOptions(1, 4));

    expect(api.getPhotos).toHaveBeenCalledTimes(3);
    expect(api.getPhotos).toHaveBeenNthCalledWith(1, 1, 20);
    expect(api.getPhotos).toHaveBeenNthCalledWith(2, 2, 20);
    expect(api.getPhotos).toHaveBeenNthCalledWith(3, 1, 4);
  });
});
