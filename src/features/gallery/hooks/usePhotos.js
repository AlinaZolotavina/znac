import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../../shared/utils/api";
import { hashtagKeys } from "../queries/hashtagQueries";
import usePhotoPagination from "./usePhotoPagination";
import {
  DELETE_PHOTO_ERROR_MSG,
  EDIT_HASHTAGS_ERROR_MSG,
  SUCCESSFUL_PHOTO_DELETE_MSG,
} from "../../../shared/utils/messages";
import photoUploadActions from "../utils/photoUploadActions";

import {
  LARGE_SCREEN_WIDTH,
  MIDDLE_SCREEN_WIDTH,
  LARGE_SCREEN_PHOTOS_NUMBER,
  LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  MIDDLE_SCREEN_PHOTOS_NUMBER,
  MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  SMALL_SCREEN_PHOTOS_NUMBER,
  SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
} from "../../../shared/utils/constants";

export default function usePhotos({
  openModal,
  startLoading,
  stopLoading,
  closeAllPopups,
  screenWidth,
  setScreenWidth,
  setHashtag,
  location,
  setIsPhotoPopupOpen,
  setIsDeletePhotoModalOpen,
}) {
  const queryClient = useQueryClient();

  const resizeTimeoutRef = useRef(null);
  const latestSearchRequestRef = useRef(0);
  const pendingViewsRef = useRef(new Set());
  const viewedPhotosRef = useRef(null);
  const flipRequestRef = useRef(0);
  const selectedPhotoRef = useRef(null);
  const cancelPendingPhotoFlip = useCallback(() => {
    flipRequestRef.current += 1;
  }, []);

  if (viewedPhotosRef.current === null) {
    try {
      viewedPhotosRef.current = new Set(
        JSON.parse(sessionStorage.getItem("viewedPhotos") || "[]"),
      );
    } catch {
      viewedPhotosRef.current = new Set();
    }
  }

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  selectedPhotoRef.current = selectedPhoto;
  const hashtagsOfSelectedPhoto = selectedPhoto?.hashtags || [];
  const viewsOfSelectedPhoto = selectedPhoto?.views || 0;
  const [areHashtagsEditing, setAreHashtagsEditing] = useState(false);

  const getPhotosLayout = useCallback(() => {
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      return {
        initialPhotosNumber: LARGE_SCREEN_PHOTOS_NUMBER,
        photosToAdd: LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
      };
    }

    if (screenWidth >= MIDDLE_SCREEN_WIDTH) {
      return {
        initialPhotosNumber: MIDDLE_SCREEN_PHOTOS_NUMBER,
        photosToAdd: MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
      };
    }

    return {
      initialPhotosNumber: SMALL_SCREEN_PHOTOS_NUMBER,
      photosToAdd: SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
    };
  }, [screenWidth]);

  const { initialPhotosNumber, photosToAdd } = getPhotosLayout();
  const pagination = usePhotoPagination({
    initialVisibleCount: initialPhotosNumber,
    photosToAdd,
    openModal,
  });
  const { collection, restoreGallery, contextVersionRef } = pagination;
  const allPhotos = collection.data;
  const currentPhotosNumber = collection.visibleCount;
  const { hasMorePhotos, isPhotosLoading, showMorePhotos } = pagination;
  const photosToRender = useMemo(
    () => allPhotos.slice(0, currentPhotosNumber),
    [allPhotos, currentPhotosNumber],
  );
  const { handlePhotoUpload } = photoUploadActions({
    startLoading,
    stopLoading,
    addPhotosToGallery,
    openModal,
  });

  const updateDimensions = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      setScreenWidth(window.innerWidth);
    }, 150);
  }, [setScreenWidth]);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, [updateDimensions]);

  const handlePhotoOpen = (photo) => {
    cancelPendingPhotoFlip();
    handlePhotoClick(photo);
    setIsPhotoPopupOpen(true);
  };

  function handlePhotoSearch(nextValue) {
    const normalizedHashtag = nextValue.trim().toLowerCase();

    if (!normalizedHashtag) {
      handleClearPhotoSearch();
      return;
    }

    const searchRequestId = latestSearchRequestRef.current + 1;
    latestSearchRequestRef.current = searchRequestId;
    cancelPendingPhotoFlip();
    setHashtag(nextValue);

    return pagination
      .loadFirstPage(normalizedHashtag)
      .then((response) => {
        if (searchRequestId !== latestSearchRequestRef.current) {
          return;
        }

        if (!response || response.data.length === 0) {
          return;
        }

        queryClient.setQueryData(hashtagKeys.all, (currentData) => {
          if (!currentData) {
            return currentData;
          }

          const currentHashtags = currentData.data ?? [];

          const existingHashtag = currentHashtags.find(
            (item) => item.name.toLowerCase() === normalizedHashtag,
          );

          const updatedHashtag = existingHashtag ?? {
            name: normalizedHashtag,
          };

          return {
            ...currentData,
            data: [
              updatedHashtag,
              ...currentHashtags.filter(
                (item) => item.name.toLowerCase() !== normalizedHashtag,
              ),
            ].slice(0, currentData.limit ?? 10),
          };
        });
      })
      .catch(console.error);
  }

  const handleClearPhotoSearch = useCallback(() => {
    latestSearchRequestRef.current += 1;
    cancelPendingPhotoFlip();
    setHashtag("");
    restoreGallery();
  }, [cancelPendingPhotoFlip, restoreGallery, setHashtag]);

  useEffect(() => {
    if (location.pathname !== "/gallery") {
      handleClearPhotoSearch();
    }
  }, [handleClearPhotoSearch, location.pathname]);

  function handlePhotoHashtagClick(nextHashtag) {
    closeAllPopups();
    handlePhotoSearch(nextHashtag);
  }

  function handlePhotoClick(photo) {
    selectedPhotoRef.current = photo;
    setSelectedPhoto(photo);
    increaseViewsNumber(photo._id);
  }

  const currentIndex = selectedPhoto
    ? allPhotos.findIndex((p) => p._id === selectedPhoto._id)
    : -1;

  const isLeftFlipDisabled = currentIndex <= 0;

  const isRightFlipDisabled =
    currentIndex === -1 ||
    (currentIndex >= allPhotos.length - 1 && !pagination.hasUnloadedPhotos);

  function selectPhoto(photo) {
    selectedPhotoRef.current = photo;
    setSelectedPhoto(photo);
    setAreHashtagsEditing(false);
    increaseViewsNumber(photo._id);
  }

  function handlePhotoFlip(direction) {
    if (direction === "right" && collection.loadingNext) return;
    const photoId = selectedPhotoRef.current?._id;
    const index = allPhotos.findIndex((photo) => photo._id === photoId);
    if (index === -1) return;
    const requestId = ++flipRequestRef.current;
    const version = contextVersionRef.current;
    const nextPhoto = allPhotos[index + (direction === "right" ? 1 : -1)];
    if (nextPhoto) {
      selectPhoto(nextPhoto);
      return;
    }
    if (direction !== "right" || !pagination.hasUnloadedPhotos) return;

    return pagination.loadNextPage().then((nextCollection) => {
      if (
        !nextCollection ||
        requestId !== flipRequestRef.current ||
        version !== contextVersionRef.current ||
        selectedPhotoRef.current?._id !== photoId
      )
        return;
      const updatedIndex = nextCollection.data.findIndex(
        (photo) => photo._id === photoId,
      );
      if (updatedIndex !== -1 && nextCollection.data[updatedIndex + 1]) {
        selectPhoto(nextCollection.data[updatedIndex + 1]);
      }
    });
  }

  function handleAddPhotoFromPc(
    photoData,
    hashtags,
    views,
    onPhotoStatusChange,
  ) {
    return handlePhotoUpload({
      photoData,
      hashtags,
      views,
      onPhotoStatusChange,
    });
  }

  function handleAddPhotoViaLink(newPhoto) {
    startLoading();
    api
      .addPhoto(newPhoto)
      .then((newPhoto) => {
        openModal({
          status: "success",
          message: "Photo was added successfully",
        });
        pagination.addPhotos([newPhoto]);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: "Photo cannot be added",
        });
      })
      .finally(() => stopLoading());
  }

  function addPhotosToGallery(newPhotos) {
    pagination.addPhotos(newPhotos);
  }

  const handleDeletePhotoModalOpen = (photo) => {
    setSelectedPhoto(photo);
    setIsDeletePhotoModalOpen(true);
  };

  function handlePhotoDelete(photo) {
    api
      .deletePhoto(photo._id)
      .then(() => {
        pagination.removePhoto(photo._id);

        openModal({
          status: "success",
          message: SUCCESSFUL_PHOTO_DELETE_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || DELETE_PHOTO_ERROR_MSG,
        });
      })
      .finally(() => closeAllPopups());
  }

  // increase views (when open photo popup, when flip photo by buttons' click)
  function increaseViewsNumber(photoId) {
    if (
      viewedPhotosRef.current.has(photoId) ||
      pendingViewsRef.current.has(photoId)
    ) {
      return;
    }

    pendingViewsRef.current.add(photoId);

    api
      .increaseViews(photoId)
      .then((newPhoto) => {
        viewedPhotosRef.current.add(photoId);

        sessionStorage.setItem(
          "viewedPhotos",
          JSON.stringify([...viewedPhotosRef.current]),
        );

        pagination.updatePhoto(newPhoto);

        setSelectedPhoto((currentPhoto) =>
          currentPhoto?._id === photoId ? newPhoto : currentPhoto,
        );
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        pendingViewsRef.current.delete(photoId);
      });
  }

  function handleEditHashtagsBtnClick() {
    setAreHashtagsEditing((prev) => !prev);
  }

  function handleEditHashtags(photoId, hashtags) {
    api
      .editHashtags(photoId, hashtags)
      .then((newPhoto) => {
        pagination.updatePhoto(newPhoto);
        setSelectedPhoto(newPhoto);
      })
      .then(() => {
        setAreHashtagsEditing(false);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || EDIT_HASHTAGS_ERROR_MSG,
        });
      });
  }
  return {
    // state
    selectedPhoto,
    hashtagsOfSelectedPhoto,
    viewsOfSelectedPhoto,
    areHashtagsEditing,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    isNextPhotoLoading: collection.loadingNext,
    cancelPendingPhotoFlip,

    // gallery
    photosToRender,
    currentPhotosNumber,
    hasMorePhotos,
    isPhotosLoading,

    // actions
    handlePhotoOpen,
    handlePhotoFlip,
    handlePhotoDelete,
    handleDeletePhotoModalOpen,
    handlePhotoSearch,
    handleClearPhotoSearch,
    handlePhotoHashtagClick,
    handleEditHashtags,
    handleEditHashtagsBtnClick,
    handleAddPhotoFromPc,
    handleAddPhotoViaLink,
    showMorePhotos,
  };
}
