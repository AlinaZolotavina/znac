import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../shared/utils/api";
import { DEFAULT_ERROR_MSG } from "../../../shared/utils/messages";
import { getPhotosQueryOptions, photoKeys } from "../queries/photoQueries";

const PAGE_SIZE = 20;
const emptyCollection = (visibleCount) => ({
  data: [],
  page: 0,
  limit: PAGE_SIZE,
  total: null,
  visibleCount,
  needsRefresh: false,
  exhausted: false,
  loading: false,
  loadingNext: false,
});

function mergePhotos(previous, incoming) {
  const photos = new Map(previous.map((photo) => [photo._id, photo]));
  incoming.forEach((photo) => photos.set(photo._id, photo));
  return [...photos.values()];
}

function matchesFilter(photo, filter) {
  return photo?.hashtags.some((tag) =>
    tag.toLowerCase().split(/\s+/).includes(filter),
  );
}

function withResponse(previous, response, append) {
  const data = mergePhotos(append ? previous.data : [], response.data);
  return {
    ...previous,
    data,
    page: response.page,
    limit: response.limit ?? PAGE_SIZE,
    total: response.total ?? data.length,
    exhausted: false,
    needsRefresh: false,
  };
}

const hasUnloadedPhotos = (collection) =>
  collection.total !== null &&
  collection.data.length < collection.total &&
  !collection.exhausted;

export default function usePhotoPagination({
  initialVisibleCount,
  photosToAdd,
  openModal,
}) {
  const queryClient = useQueryClient();
  const [collections, setCollections] = useState(() => ({
    "": emptyCollection(initialVisibleCount),
  }));
  const collectionsRef = useRef(collections);
  const [activeFilter, setActiveFilter] = useState("");
  const activeFilterRef = useRef("");
  const contextVersionRef = useRef(0);
  const revisionRef = useRef(0);
  const generationsRef = useRef(new Map());
  const requestsRef = useRef(new Map());
  const firstRequestsRef = useRef(new Map());
  const nextRequestsRef = useRef(new Map());
  const layoutRef = useRef({ initialVisibleCount, photosToAdd });
  layoutRef.current = { initialVisibleCount, photosToAdd };
  const mountedRef = useRef(true);

  const updateCollection = useCallback((filter, update) => {
    if (!mountedRef.current) return;
    const previous = Object.prototype.hasOwnProperty.call(
      collectionsRef.current,
      filter,
    )
      ? collectionsRef.current[filter]
      : emptyCollection(layoutRef.current.initialVisibleCount);
    const next = update(previous);
    collectionsRef.current = { ...collectionsRef.current, [filter]: next };
    setCollections(collectionsRef.current);
    return next;
  }, []);

  const reportError = useCallback(
    (err) => {
      openModal({ status: "error", message: err.message || DEFAULT_ERROR_MSG });
    },
    [openModal],
  );

  const requestPage = useCallback(
    (filter, page, fresh = false) => {
      const revision = revisionRef.current;
      const key = `${revision}|${filter}|${page}|${fresh}`;
      const existing = requestsRef.current.get(key);
      if (existing) return existing;

      const request = filter
        ? api.findPhoto(filter, page, PAGE_SIZE)
        : fresh
          ? api.getPhotos(page, PAGE_SIZE)
          : queryClient.fetchQuery(getPhotosQueryOptions(page, PAGE_SIZE));
      const promise = request
        .then((response) => {
          if (!filter && fresh && revision === revisionRef.current) {
            queryClient.setQueryData(
              photoKeys.list({ page, limit: PAGE_SIZE }),
              response,
            );
          }
          return response;
        })
        .finally(() => requestsRef.current.delete(key));
      requestsRef.current.set(key, promise);
      return promise;
    },
    [queryClient],
  );

  const loadFirstPage = useCallback(
    (value = "") => {
      const filter = value.trim().toLowerCase();
      const revision = revisionRef.current;
      contextVersionRef.current += 1;
      activeFilterRef.current = filter;
      setActiveFilter(filter);
      updateCollection(filter, (previous) => ({
        ...previous,
        loading: true,
        loadingNext: false,
      }));

      // Repeated submissions of the same search share a request and its result.
      const existing = firstRequestsRef.current.get(filter);
      if (existing?.revision === revision) return existing.promise;

      const generation = (generationsRef.current.get(filter) ?? 0) + 1;
      generationsRef.current.set(filter, generation);
      const entry = { revision };
      const promise = requestPage(filter, 1)
        .then((response) => {
          if (
            revision !== revisionRef.current ||
            generation !== generationsRef.current.get(filter)
          )
            return null;
          updateCollection(filter, (previous) => {
            const next = withResponse(previous, response, false);
            return {
              ...next,
              visibleCount: Math.min(
                layoutRef.current.initialVisibleCount,
                next.data.length,
              ),
            };
          });
          return response;
        })
        .catch((err) => {
          if (
            revision === revisionRef.current &&
            activeFilterRef.current === filter
          ) {
            reportError(err);
          }
          return null;
        })
        .finally(() => {
          if (firstRequestsRef.current.get(filter) === entry) {
            firstRequestsRef.current.delete(filter);
            updateCollection(filter, (previous) => ({
              ...previous,
              loading: false,
            }));
          }
        });
      entry.promise = promise;
      firstRequestsRef.current.set(filter, entry);
      return promise;
    },
    [reportError, requestPage, updateCollection],
  );

  // Rebuild the loaded prefix after mutations or inconsistent pagination.
  // Updating it atomically avoids losing an item at a shifted page boundary.
  const refreshCollection = useCallback(
    async (filter, revision, generation) => {
      const previous = collectionsRef.current[filter];
      const lastPage = Math.max(1, previous.page);
      let next = { ...previous, data: [] };
      let emptyPage = false;
      for (let page = 1; page <= lastPage; page += 1) {
        const response = await requestPage(filter, page, true).catch((err) => {
          if (
            revision === revisionRef.current &&
            generation === generationsRef.current.get(filter)
          ) {
            updateCollection(filter, (current) => ({
              ...current,
              needsRefresh: true,
            }));
          }
          throw err;
        });
        if (
          revision !== revisionRef.current ||
          generation !== generationsRef.current.get(filter) ||
          !mountedRef.current
        )
          return null;
        next = withResponse(next, response, page !== 1);
        emptyPage = response.data.length === 0;
        if (emptyPage || page * next.limit >= next.total) break;
      }
      next = {
        ...next,
        visibleCount: Math.min(previous.visibleCount, next.data.length),
        exhausted: emptyPage && next.data.length < next.total,
      };
      updateCollection(filter, (current) => ({
        ...next,
        loading: current.loading,
        loadingNext: current.loadingNext,
      }));
      return collectionsRef.current[filter];
    },
    [requestPage, updateCollection],
  );

  const loadNextPage = useCallback(() => {
    const filter = activeFilterRef.current;
    const revision = revisionRef.current;
    const generation = generationsRef.current.get(filter);
    const requestKey = `${revision}|${generation}|${filter}`;
    const existing = nextRequestsRef.current.get(requestKey);
    if (existing) return existing;
    const initial = collectionsRef.current[filter];
    if (!initial || initial.loading) return Promise.resolve(null);
    if (!initial.needsRefresh && !hasUnloadedPhotos(initial)) {
      return Promise.resolve(initial);
    }

    updateCollection(filter, (previous) => ({
      ...previous,
      loadingNext: true,
    }));
    const promise = (async () => {
      let collection = initial.needsRefresh
        ? await refreshCollection(filter, revision, generation)
        : initial;
      if (!collection) return null;
      const initialCount = collection.data.length;
      while (hasUnloadedPhotos(collection)) {
        const previousTotal = collection.total;
        const response = await requestPage(filter, collection.page + 1);
        if (
          revision !== revisionRef.current ||
          generation !== generationsRef.current.get(filter) ||
          !mountedRef.current
        )
          return null;
        collection = updateCollection(filter, (previous) =>
          withResponse(previous, response, true),
        );

        if (
          response.data.length === 0 ||
          previousTotal !== collection.total ||
          (collection.page * collection.limit >= collection.total &&
            collection.data.length < collection.total)
        ) {
          collection = await refreshCollection(filter, revision, generation);
          if (!collection) return null;
          // A persistently inconsistent server response must not cause an
          // endless series of requests. Keep its total and allow a new search
          // or refresh to retry the collection.
          if (
            hasUnloadedPhotos(collection) &&
            (collection.page * collection.limit >= collection.total ||
              response.data.length === 0)
          ) {
            collection = updateCollection(filter, (previous) => ({
              ...previous,
              exhausted: true,
            }));
          }
          break;
        }
        if (collection.data.length > initialCount) break;
      }
      return collection;
    })()
      .catch((err) => {
        if (
          revision === revisionRef.current &&
          generation === generationsRef.current.get(filter) &&
          activeFilterRef.current === filter
        ) {
          reportError(err);
        }
        return null;
      })
      .finally(() => {
        nextRequestsRef.current.delete(requestKey);
        if (
          revision === revisionRef.current &&
          generation === generationsRef.current.get(filter)
        ) {
          updateCollection(filter, (previous) => ({
            ...previous,
            loadingNext: false,
          }));
        }
      });
    nextRequestsRef.current.set(requestKey, promise);
    return promise;
  }, [refreshCollection, reportError, requestPage, updateCollection]);

  const restoreGallery = useCallback(() => {
    contextVersionRef.current += 1;
    activeFilterRef.current = "";
    setActiveFilter("");
    if (collectionsRef.current[""].total === null) return loadFirstPage();
  }, [loadFirstPage]);

  function showMorePhotos() {
    const filter = activeFilterRef.current;
    const version = contextVersionRef.current;
    const collection = collectionsRef.current[filter];
    if (collection.loading || collection.loadingNext) return;
    const nextCount = collection.visibleCount + layoutRef.current.photosToAdd;
    const reveal = () => {
      if (version !== contextVersionRef.current || !mountedRef.current) return;
      updateCollection(filter, (current) => ({
        ...current,
        visibleCount: Math.min(nextCount, current.data.length),
      }));
    };
    if (nextCount <= collection.data.length || !hasUnloadedPhotos(collection)) {
      reveal();
      return;
    }
    return loadNextPage().then((result) => {
      if (result) reveal();
    });
  }

  // All page caches become stale when insertion/removal shifts their offsets.
  const mutateCollections = useCallback(
    (update) => {
      revisionRef.current += 1;
      contextVersionRef.current += 1;
      queryClient.removeQueries({ queryKey: photoKeys.all });
      Object.keys(collectionsRef.current).forEach((filter) => {
        updateCollection(filter, (previous) => ({
          ...update(previous, filter),
          needsRefresh: true,
          exhausted: false,
          loading: false,
          loadingNext: false,
        }));
      });
      if (collectionsRef.current[activeFilterRef.current].total === null) {
        loadFirstPage(activeFilterRef.current);
      }
    },
    [loadFirstPage, queryClient, updateCollection],
  );

  function addPhotos(photos) {
    const added = mergePhotos([], photos);
    mutateCollections((previous, filter) => {
      const matching = filter
        ? added.filter((photo) => matchesFilter(photo, filter))
        : added;
      const incoming = matching.filter(
        (photo) => !previous.data.some((item) => item._id === photo._id),
      );
      return {
        ...previous,
        data: mergePhotos(incoming, previous.data),
        total:
          previous.total === null ? null : previous.total + incoming.length,
      };
    });
  }

  function removePhoto(photoId) {
    const deletedPhoto = Object.values(collectionsRef.current)
      .flatMap((collection) => collection.data)
      .find((photo) => photo._id === photoId);
    mutateCollections((previous, filter) => ({
      ...previous,
      data: previous.data.filter((photo) => photo._id !== photoId),
      total:
        previous.total === null
          ? null
          : Math.max(
              0,
              previous.total -
                (!filter ||
                matchesFilter(deletedPhoto, filter) ||
                previous.data.some((photo) => photo._id === photoId)
                  ? 1
                  : 0),
            ),
    }));
  }

  function updatePhoto(photo) {
    Object.keys(collectionsRef.current).forEach((filter) => {
      updateCollection(filter, (previous) => ({
        ...previous,
        data: previous.data.map((item) =>
          item._id === photo._id ? photo : item,
        ),
      }));
    });
  }

  useEffect(() => {
    mountedRef.current = true;
    loadFirstPage();
    return () => {
      mountedRef.current = false;
      contextVersionRef.current += 1;
    };
  }, [loadFirstPage]);

  useEffect(() => {
    updateCollection(activeFilterRef.current, (previous) => ({
      ...previous,
      visibleCount: Math.max(previous.visibleCount, initialVisibleCount),
    }));
  }, [initialVisibleCount, updateCollection]);

  const collection = collections[activeFilter];
  return {
    collection,
    isPhotosLoading: collection.loading || collection.loadingNext,
    hasMorePhotos:
      collection.visibleCount < collection.data.length ||
      hasUnloadedPhotos(collection),
    hasUnloadedPhotos: hasUnloadedPhotos(collection),
    loadFirstPage,
    loadNextPage,
    showMorePhotos,
    restoreGallery,
    addPhotos,
    removePhoto,
    updatePhoto,
    contextVersionRef,
  };
}
