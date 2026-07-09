import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import api from "../../../shared/utils/api";
import {
  DEFAULT_ERROR_MSG,
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
  hashtag,
  setHashtag,
  lastHashtags,
  setLastHashtags,
  location,
  setIsPhotoPopupOpen,
  setIsDeletePhotoModalOpen,
}) {
  const [allPhotos, setAllPhotos] = useState([]);
  const [loadedPhotos, setLoadedPhotos] = useState([]);
  const [photosPage, setPhotosPage] = useState(1);
  const [photosPages, setPhotosPages] = useState(1);
  const [currentPhotosNumber, setCurrentPhotosNumber] = useState(0);
  const [photosToAdd, setPhotosToAdd] = useState(0);
  const [visibleLoadedPhotosCount, setVisibleLoadedPhotosCount] = useState(0);
  const resizeTimeoutRef = useRef(null);

  const photosToRender = useMemo(
    () => allPhotos.slice(0, currentPhotosNumber),
    [allPhotos, currentPhotosNumber],
  );

  const hasMorePhotos =
    currentPhotosNumber < allPhotos.length || photosPage < photosPages;

  const { handlePhotoUpload } = photoUploadActions({
    startLoading,
    stopLoading,
    addPhotosToGallery,
    openModal,
  });

  const loadHashtags = useCallback(() => {
    return api
      .getHashtags(1, 10)
      .then((response) => {
        setLastHashtags(response.data);
      })
      .catch(console.error);
  }, [setLastHashtags]);

  useEffect(() => {
    loadHashtags();
  }, [loadHashtags]);

  useEffect(() => {
    setHashtag("");
  }, [location.pathname, setHashtag]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
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

  const calculatePhotosCount = useCallback(() => {
    const { initialPhotosNumber, photosToAdd: nextPhotosToAdd } =
      getPhotosLayout();
    setPhotosToAdd(nextPhotosToAdd);
    setCurrentPhotosNumber((current) => Math.max(current, initialPhotosNumber));
  }, [getPhotosLayout]);

  useEffect(() => {
    calculatePhotosCount();
  }, [calculatePhotosCount]);

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

  function showMorePhotos() {
    const nextVisibleCount = currentPhotosNumber + photosToAdd;
    const isFiltered = Boolean(hashtag.trim());

    if (nextVisibleCount <= allPhotos.length) {
      setCurrentPhotosNumber(nextVisibleCount);
      if (!isFiltered) {
        setVisibleLoadedPhotosCount(nextVisibleCount);
      }
      return;
    }

    if (photosPage >= photosPages) {
      setCurrentPhotosNumber(allPhotos.length);
      if (!isFiltered) {
        setVisibleLoadedPhotosCount(allPhotos.length);
      }
      return;
    }

    loadPhotos({
      page: photosPage + 1,
      append: true,
      hashtag,
    })
      .then((response) => {
        const nextCount = Math.min(
          nextVisibleCount,
          allPhotos.length + response.data.length,
        );
        setCurrentPhotosNumber(nextCount);
        if (!isFiltered) {
          setVisibleLoadedPhotosCount(nextCount);
        }
      })
      .catch(console.error);
  }

  function getRestoredVisibleCount() {
    const { initialPhotosNumber } = getPhotosLayout();

    return Math.min(
      visibleLoadedPhotosCount || initialPhotosNumber,
      loadedPhotos.length,
    );
  }

  const loadPhotos = useCallback(
    ({ page = 1, append = false, hashtag = "" } = {}) => {
      const normalizedHashtag = hashtag.trim().toLowerCase();
      const hasFilter = Boolean(normalizedHashtag);

      const request = hasFilter
        ? api.findPhoto(normalizedHashtag, page, 20)
        : api.getPhotos(page, 20);

      return request
        .then((response) => {
          const { data, page: responsePage, pages } = response;
          setAllPhotos((previousPhotos) =>
            append ? [...previousPhotos, ...data] : data,
          );
          if (!hasFilter) {
            setLoadedPhotos((previousPhotos) =>
              append ? [...previousPhotos, ...data] : data,
            );
          }
          setPhotosPage(responsePage);
          setPhotosPages(pages);

          if (!append) {
            const { initialPhotosNumber } = getPhotosLayout();
            const visibleCount = Math.min(initialPhotosNumber, data.length);
            setCurrentPhotosNumber(visibleCount);
            if (!hasFilter) {
              setVisibleLoadedPhotosCount(visibleCount);
            }
          }

          return response;
        })
        .catch((err) => {
          openModal({
            status: "error",
            message: err.message || DEFAULT_ERROR_MSG,
          });

          throw err;
        });
    },
    [getPhotosLayout, openModal],
  );

  useEffect(() => {
    loadPhotos({
      page: 1,
      append: false,
      hashtag: "",
    });
  }, [loadPhotos]);

  const handlePhotoOpen = (photo) => {
    handlePhotoClick(photo);
    setIsPhotoPopupOpen(true);
  };

  function checkUniqueness(hashtag, hashtags) {
    return !hashtags.some((item) => item.name === hashtag);
  }

  function handlePhotoSearch(nextValue) {
    const normalizedHashtag = nextValue.trim().toLowerCase();

    setHashtag(nextValue);

    if (!normalizedHashtag) {
      const restoredVisibleCount = getRestoredVisibleCount();

      setAllPhotos(loadedPhotos);
      setPhotosPage(1);
      setPhotosPages(Math.max(1, Math.ceil(loadedPhotos.length / 20)));
      setCurrentPhotosNumber(restoredVisibleCount);

      return;
    }

    loadPhotos({
      page: 1,
      append: false,
      hashtag: normalizedHashtag,
    })
      .then((response) => {
        if (response.data.length === 0) {
          return;
        }
        const isHashtagUniq = checkUniqueness(normalizedHashtag, lastHashtags);

        if (isHashtagUniq) {
          return api.addHashtag(normalizedHashtag).then((data) => {
            setLastHashtags((prev) => [
              {
                name: data.name,
                _id: data._id,
                __v: data.__v,
                createdAt: data.createdAt,
              },
              ...prev,
            ]);
          });
        }

        return api.updateHashtag(normalizedHashtag).then((data) => {
          setLastHashtags((prev) => [
            {
              name: data.name,
              _id: data._id,
              __v: data.__v,
              createdAt: data.createdAt,
            },
            ...prev.filter((h) => h.name.toLowerCase() !== normalizedHashtag),
          ]);
        });
      })
      .catch(console.error);
  }

  function handleClearPhotoSearch() {
    const restoredVisibleCount = getRestoredVisibleCount();

    setHashtag("");
    setAllPhotos(loadedPhotos);
    setPhotosPage(1);
    setPhotosPages(Math.max(1, Math.ceil(loadedPhotos.length / 20)));
    setCurrentPhotosNumber(restoredVisibleCount);
  }

  function handlePhotoHashtagClick(nextHashtag) {
    closeAllPopups();
    handlePhotoSearch(nextHashtag);
  }

  function handlePhotoClick(photo) {
    setSelectedPhoto(photo);
    increaseViewsNumber(photo._id);
  }

  const currentIndex = selectedPhoto
    ? allPhotos.findIndex((p) => p._id === selectedPhoto._id)
    : -1;

  const isLeftFlipDisabled = currentIndex <= 0;

  const isRightFlipDisabled =
    currentIndex === -1 || currentIndex >= allPhotos.length - 1;

  function handlePhotoFlip(direction) {
    const currentIndex = allPhotos.findIndex(
      (p) => p._id === selectedPhoto?._id,
    );

    if (currentIndex === -1) return;

    const nextIndex =
      direction === "right" ? currentIndex + 1 : currentIndex - 1;

    const nextPhoto = allPhotos[nextIndex];
    if (!nextPhoto) return;

    increaseViewsNumber(nextPhoto._id);
    setAreHashtagsEditing(false);
  }

  function handleAddPhotoFromPc(photoData, hashtags, views) {
    return handlePhotoUpload({
      photoData,
      hashtags,
      views,
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
        setAllPhotos((prev) => [newPhoto, ...prev]);
        setLoadedPhotos((prev) => [newPhoto, ...prev]);
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
    setAllPhotos((prev) => [...newPhotos, ...prev]);
    setLoadedPhotos((prev) => [...newPhotos, ...prev]);
  }

  const handleDeletePhotoModalOpen = (photo) => {
    setSelectedPhoto(photo);
    setIsDeletePhotoModalOpen(true);
  };

  function handlePhotoDelete(photo) {
    api
      .deletePhoto(photo._id)
      .then(() => {
        setAllPhotos((state) => state.filter((p) => p._id !== photo._id));
        setLoadedPhotos((state) => state.filter((p) => p._id !== photo._id));

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
    api
      .increaseViews(photoId)
      .then((newPhoto) => {
        setAllPhotos((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setSelectedPhoto(newPhoto);
      })
      .catch((err) => console.log(err));
  }

  function handleEditHashtagsBtnClick() {
    setAreHashtagsEditing((prev) => !prev);
  }

  function handleEditHashtags(photoId, hashtags) {
    api
      .editHashtags(photoId, hashtags)
      .then((newPhoto) => {
        setAllPhotos((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
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

    // gallery
    photosToRender,
    currentPhotosNumber,
    hasMorePhotos,

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
