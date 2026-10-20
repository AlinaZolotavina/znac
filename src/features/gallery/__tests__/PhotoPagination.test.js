import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import usePhotos from "../hooks/usePhotos";
import usePhotoPagination from "../hooks/usePhotoPagination";
import { mockApi as api } from "../../../test/mockApi";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const photos = Array.from({ length: 61 }, (_, index) => ({
  _id: `photo-${index + 1}`,
  link: `https://img.test/${index + 1}.jpg`,
  hashtags: index === 0 ? ["travel", "solo"] : ["travel"],
  views: 0,
}));

function response(data, page = 1) {
  return {
    data: data.slice((page - 1) * 20, page * 20),
    page,
    limit: 20,
    total: data.length,
    pages: Math.max(1, Math.ceil(data.length / 20)),
  };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function renderGallery(paginationOnly = false) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 300000 } },
  });
  const props = {
    openModal: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    closeAllPopups: jest.fn(),
    screenWidth: 500,
    setScreenWidth: jest.fn(),
    setHashtag: jest.fn(),
    location: { pathname: "/gallery" },
    setIsPhotoPopupOpen: jest.fn(),
    setIsDeletePhotoModalOpen: jest.fn(),
  };
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const hook = paginationOnly
    ? () =>
        usePhotoPagination({
          initialVisibleCount: 6,
          photosToAdd: 6,
          openModal: props.openModal,
        })
    : () => usePhotos(props);
  return { props, ...renderHook(hook, { wrapper }) };
}

let serverPhotos;

beforeEach(() => {
  jest.resetAllMocks();
  sessionStorage.clear();
  serverPhotos = photos.slice(0, 41);
  api.getPhotos.mockImplementation((page) =>
    Promise.resolve(response(serverPhotos, page)),
  );
  api.findPhoto.mockImplementation((tag, page) =>
    Promise.resolve(
      response(
        serverPhotos.filter((photo) => photo.hashtags.includes(tag)),
        page,
      ),
    ),
  );
  api.increaseViews.mockImplementation((id) =>
    Promise.resolve({ ...photos.find((photo) => photo._id === id), views: 1 }),
  );
});

test("search values matching object property names still create independent collections", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  await act(async () => {
    await result.current.loadFirstPage("constructor");
  });
  expect(result.current.collection.total).toBe(0);
  expect(result.current.collection.data).toEqual([]);
  act(() => result.current.restoreGallery());
  expect(result.current.collection.total).toBe(41);
});

test("a duplicate-only page advances to the next page without counting duplicates", async () => {
  serverPhotos = photos;
  api.getPhotos.mockImplementation((page) =>
    Promise.resolve({
      ...response(serverPhotos, page),
      data:
        page === 2
          ? photos.slice(0, 20)
          : page === 3
            ? photos.slice(20, 40)
            : response(serverPhotos, page).data,
    }),
  );
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(61));
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 2, 3]);
  expect(result.current.collection.data).toEqual(photos.slice(0, 40));
  expect(result.current.hasUnloadedPhotos).toBe(true);
});

test("right flip loads one shared page, opens its first photo and stops at total without revealing grid cards", async () => {
  serverPhotos = photos.slice(0, 21);
  const next = deferred();
  api.getPhotos.mockImplementation((page) =>
    page === 2 ? next.promise : Promise.resolve(response(serverPhotos, page)),
  );
  const { result } = renderGallery();
  await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
  act(() => result.current.handlePhotoOpen(photos[19]));
  expect(result.current.isRightFlipDisabled).toBe(false);

  let pending;
  act(() => {
    pending = result.current.handlePhotoFlip("right");
    result.current.handlePhotoFlip("right");
  });
  expect(result.current.isNextPhotoLoading).toBe(true);
  expect(result.current.selectedPhoto._id).toBe("photo-20");
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 2]);
  await act(async () => {
    next.resolve(response(serverPhotos, 2));
    await pending;
  });
  expect(result.current.selectedPhoto._id).toBe("photo-21");
  expect(result.current.isRightFlipDisabled).toBe(true);
  expect(result.current.photosToRender).toHaveLength(6);
  await act(async () => {
    await result.current.handlePhotoFlip("right");
  });
  expect(api.getPhotos).toHaveBeenCalledTimes(2);
});

test("show more and modal share the in-flight page request", async () => {
  const next = deferred();
  api.getPhotos.mockImplementation((page) =>
    page === 2 ? next.promise : Promise.resolve(response(serverPhotos, page)),
  );
  const { result } = renderGallery();
  await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
  for (let index = 0; index < 7; index += 1) {
    act(() => result.current.showMorePhotos());
  }
  expect(result.current.photosToRender).toHaveLength(20);
  act(() => result.current.handlePhotoOpen(photos[19]));
  let pending;
  act(() => {
    pending = result.current.showMorePhotos();
    result.current.handlePhotoFlip("right");
  });
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 2]);
  await act(async () => {
    next.resolve(response(serverPhotos, 2));
    await pending;
  });
  expect(result.current.photosToRender).toHaveLength(22);
});

test("clearing search restores data, total, visible count and last page together", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  await act(async () => {
    await result.current.loadNextPage();
  });
  act(() => result.current.showMorePhotos());
  expect(result.current.collection.page).toBe(2);
  expect(result.current.collection.visibleCount).toBe(12);
  await act(async () => {
    await result.current.loadFirstPage("solo");
  });
  expect(result.current.collection.total).toBe(1);
  act(() => result.current.restoreGallery());
  expect(result.current.collection).toMatchObject({
    page: 2,
    total: 41,
    visibleCount: 12,
  });
  expect(result.current.collection.data).toHaveLength(40);
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 2, 3]);
  expect(result.current.hasUnloadedPhotos).toBe(false);
});

test("filtered right flip requests the next page of that filter", async () => {
  const { result } = renderGallery();
  await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
  await act(async () => {
    await result.current.handlePhotoSearch(" travel ");
  });
  act(() => result.current.handlePhotoOpen(photos[19]));
  await act(async () => {
    await result.current.handlePhotoFlip("right");
  });
  expect(api.findPhoto.mock.calls).toEqual([
    ["travel", 1, 20],
    ["travel", 2, 20],
  ]);
  expect(api.getPhotos).toHaveBeenCalledTimes(1);
  expect(result.current.selectedPhoto._id).toBe("photo-21");
});

test("overlapping pages merge by id without counting duplicates or making an extra end request", async () => {
  serverPhotos = photos.slice(0, 21);
  api.getPhotos.mockImplementation((page) =>
    Promise.resolve(
      page === 2
        ? {
            ...response(serverPhotos, page),
            data: [photos[19], photos[20], photos[20]],
          }
        : response(serverPhotos, page),
    ),
  );
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(21));
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection.data).toHaveLength(21);
  expect(
    new Set(result.current.collection.data.map((photo) => photo._id)).size,
  ).toBe(21);
  expect(result.current.hasUnloadedPhotos).toBe(false);
  expect(api.getPhotos).toHaveBeenCalledTimes(2);
});

test("unexpected empty page refreshes server total and stops repeated requests", async () => {
  const { result } = renderGallery();
  await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
  act(() => result.current.handlePhotoOpen(photos[19]));
  serverPhotos = photos.slice(0, 20);
  await act(async () => {
    await result.current.handlePhotoFlip("right");
  });
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 2, 1]);
  expect(result.current.isRightFlipDisabled).toBe(true);
  await act(async () => {
    await result.current.handlePhotoFlip("right");
  });
  expect(api.getPhotos).toHaveBeenCalledTimes(3);
});

test("persistently inconsistent empty pages retain server total without looping", async () => {
  api.getPhotos.mockImplementation((page) =>
    Promise.resolve({
      ...response(serverPhotos, page),
      data: page === 1 ? photos.slice(0, 20) : [],
    }),
  );
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection.total).toBe(41);
  expect(result.current.hasUnloadedPhotos).toBe(false);
  const count = api.getPhotos.mock.calls.length;
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(api.getPhotos).toHaveBeenCalledTimes(count);
});

test("request failure allows retry instead of marking the end", async () => {
  serverPhotos = photos.slice(0, 21);
  const { result, props } = renderGallery();
  await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
  act(() => result.current.handlePhotoOpen(photos[19]));
  api.getPhotos.mockRejectedValueOnce(new Error("Offline"));
  await act(async () => {
    await result.current.handlePhotoFlip("right");
  });
  expect(props.openModal).toHaveBeenCalledWith({
    status: "error",
    message: "Offline",
  });
  expect(result.current.isRightFlipDisabled).toBe(false);
  expect(result.current.isNextPhotoLoading).toBe(false);
  await act(async () => {
    await result.current.handlePhotoFlip("right");
  });
  expect(result.current.selectedPhoto._id).toBe("photo-21");
});

test.each(["left", "close", "search"])(
  "pending right flip cannot override %s navigation",
  async (action) => {
    const next = deferred();
    api.getPhotos.mockImplementation((page) =>
      page === 2 ? next.promise : Promise.resolve(response(serverPhotos, page)),
    );
    const { result } = renderGallery();
    await waitFor(() => expect(result.current.photosToRender).toHaveLength(6));
    act(() => result.current.handlePhotoOpen(photos[19]));
    let pending;
    act(() => {
      pending = result.current.handlePhotoFlip("right");
    });
    await act(async () => {
      if (action === "left") result.current.handlePhotoFlip("left");
      if (action === "close") result.current.cancelPendingPhotoFlip();
      if (action === "search") {
        await result.current.handlePhotoSearch("solo");
        result.current.handlePhotoOpen(photos[0]);
      }
    });
    const selectedId = result.current.selectedPhoto._id;
    await act(async () => {
      next.resolve(response(serverPhotos, 2));
      await pending;
    });
    expect(result.current.selectedPhoto._id).toBe(selectedId);
    if (action === "search")
      expect(result.current.photosToRender).toHaveLength(1);
  },
);

test("additions update totals once and refresh shifted pages before continuing", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  const added = { ...photos[0], _id: "new-photo" };
  serverPhotos = [added, ...serverPhotos];
  act(() => result.current.addPhotos([added, added]));
  expect(result.current.collection.total).toBe(42);
  expect(result.current.collection.data).toHaveLength(21);
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection.total).toBe(42);
  expect(result.current.collection.data).toEqual(serverPhotos.slice(0, 40));
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 1, 2]);
});

test("deletion updates total and refreshes offsets so a boundary photo is not skipped", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  serverPhotos = serverPhotos.slice(1);
  act(() => result.current.removePhoto("photo-1"));
  expect(result.current.collection.total).toBe(40);
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection.total).toBe(40);
  expect(result.current.collection.data).toEqual(serverPhotos);
  expect(result.current.hasUnloadedPhotos).toBe(false);
});

test("a changed server total refreshes the prefix even when a next page is nonempty", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  serverPhotos = serverPhotos.slice(1);
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection.total).toBe(40);
  expect(result.current.collection.data).toEqual(serverPhotos);
  expect(result.current.hasUnloadedPhotos).toBe(false);
});

test("a failed reconciliation retries the refresh instead of skipping another page", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  serverPhotos = photos.slice(0, 20);
  api.getPhotos
    .mockResolvedValueOnce(response(serverPhotos, 2))
    .mockRejectedValueOnce(new Error("Offline"));
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection.needsRefresh).toBe(true);
  await act(async () => {
    await result.current.loadNextPage();
  });
  expect(result.current.collection).toMatchObject({
    total: 20,
    needsRefresh: false,
  });
  expect(api.getPhotos.mock.calls.map(([page]) => page)).toEqual([1, 2, 1, 1]);
  expect(result.current.hasUnloadedPhotos).toBe(false);
});

test("a new search for the same filter ignores an old pending append", async () => {
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  await act(async () => {
    await result.current.loadFirstPage("travel");
  });
  const next = deferred();
  api.findPhoto.mockReturnValueOnce(next.promise);
  let pending;
  act(() => {
    pending = result.current.loadNextPage();
  });
  serverPhotos = photos.slice(0, 1);
  await act(async () => {
    await result.current.loadFirstPage("travel");
  });
  await act(async () => {
    next.resolve(response(photos.slice(0, 41), 2));
    await pending;
  });
  expect(result.current.collection.total).toBe(1);
  expect(result.current.collection.data).toEqual(serverPhotos);
  expect(result.current.collection.loadingNext).toBe(false);
  expect(result.current.isPhotosLoading).toBe(false);
});

test("a mutation prevents an older pending page from overwriting the updated collection", async () => {
  const next = deferred();
  api.getPhotos.mockImplementation((page) =>
    page === 2 ? next.promise : Promise.resolve(response(serverPhotos, page)),
  );
  const { result } = renderGallery(true);
  await waitFor(() => expect(result.current.collection.total).toBe(41));
  let pending;
  act(() => {
    pending = result.current.loadNextPage();
  });
  const added = { ...photos[0], _id: "new-photo" };
  act(() => result.current.addPhotos([added]));
  await act(async () => {
    next.resolve(response(serverPhotos, 2));
    await pending;
  });
  expect(result.current.collection.total).toBe(42);
  expect(result.current.collection.data).toHaveLength(21);
  expect(result.current.collection.data[0]).toEqual(added);
  expect(result.current.collection.loadingNext).toBe(false);
});

test("a mutation during the initial request reloads authoritative pagination", async () => {
  const initial = deferred();
  api.getPhotos.mockReturnValueOnce(initial.promise);
  const { result } = renderGallery(true);
  const added = { ...photos[0], _id: "new-photo" };
  serverPhotos = [added, ...serverPhotos];
  act(() => result.current.addPhotos([added]));
  await waitFor(() => expect(result.current.collection.total).toBe(42));
  await act(async () => { initial.resolve(response(photos.slice(0, 41))); });
  expect(result.current.collection.total).toBe(42);
  expect(result.current.collection.data[0]).toEqual(added);
  expect(result.current.hasUnloadedPhotos).toBe(true);
  expect(result.current.isPhotosLoading).toBe(false);
});
