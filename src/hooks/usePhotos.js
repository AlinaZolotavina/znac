import { useState, useEffect } from "react";
import api from "../utils/api";
import * as messages from "../utils/messages";

import {
  LARGE_SCREEN_WIDTH,
  MIDDLE_SCREEN_WIDTH,
  LARGE_SCREEN_PHOTOS_NUMBER,
  LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  MIDDLE_SCREEN_PHOTOS_NUMBER,
  MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  SMALL_SCREEN_PHOTOS_NUMBER,
  SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
} from "../utils/constants";

export default function usePhotos({
  openModal,
  startLoading,
  stopLoading,
  closeAllPopups,
  screenWidth,
  setScreenWidth,
  loadPhotos,
  hashtag,
}) {
  const [photosToRender, setPhotosToRender] = useState([]);
  const [allPhotos, setAllPhotos] = useState([]);
  const [loadedPhotos, setLoadedPhotos] = useState([]);
  const [photosPage, setPhotosPage] = useState(1);
  const [photosPages, setPhotosPages] = useState(1);
  const [currentPhotosNumber, setCurrentPhotosNumber] = useState(0);
  const [photosToAdd, setPhotosToAdd] = useState(0);
  const [visibleLoadedPhotosCount, setVisibleLoadedPhotosCount] = useState(0);
  const hasMorePhotos =
    currentPhotosNumber < allPhotos.length || photosPage < photosPages;

  useEffect(() => {
    if (loadedPhotos.length > 0) {
      return;
    }
    loadPhotos({
      page: 1,
      append: false,
      hashtag: "",
    });
  }, [loadedPhotos.length]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const hashtagsOfSelectedPhoto = selectedPhoto?.hashtags || [];
  const viewsOfSelectedPhoto = selectedPhoto?.views || 0;
  const [areHashtagsEditing, setAreHashtagsEditing] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", updateDemensions);
    return () => window.removeEventListener("resize", updateDemensions);
  }, []);

  const getPhotosLayout = () => {
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
  };

  const calculatePhotosCount = () => {
    const { initialPhotosNumber, photosToAdd: nextPhotosToAdd } =
      getPhotosLayout();
    setPhotosToAdd(nextPhotosToAdd);
    setCurrentPhotosNumber((current) => Math.max(current, initialPhotosNumber));
  };

  const updateDemensions = () => {
    let resizeTimeout;
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        setScreenWidth(window.innerWidth);
      }, 150);
    }
  };

  useEffect(() => {
    setPhotosToRender(allPhotos.slice(0, currentPhotosNumber));
  }, [allPhotos, currentPhotosNumber]);

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

  // open photo popup, handle photo flip
  function handlePhotoClick(photo) {
    console.log("handlePhotoClick:", photo);
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

  // add photo
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
        setPhotosToRender((prev) => [newPhoto, ...prev]);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: "Photo cannot be added",
        });
      })
      .finally(() => stopLoading());
  }

  // delete photo

  function handlePhotoDelete(photo) {
    api
      .deletePhoto(photo._id)
      .then(() => {
        setPhotosToRender((state) => state.filter((p) => p._id !== photo._id));
        setAllPhotos((state) => state.filter((p) => p._id !== photo._id));

        openModal({
          status: "success",
          message: messages.SUCCESSFUL_PHOTO_DELETE_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DELETE_PHOTO_ERROR_MSG,
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
        setPhotosToRender((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setSelectedPhoto(newPhoto);
      })
      .catch((err) => console.log(err));
  }

  function handleEditHashtags(photoId, hashtags) {
    api
      .editHashtags(photoId, hashtags)
      .then((newPhoto) => {
        setAllPhotos((state) =>
          state.map((p) => (p._id === photoId ? newPhoto : p)),
        );
        setPhotosToRender((state) =>
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
          message: err.message || messages.EDIT_HASHTAGS_ERROR_MSG,
        });
      });
  }

  return {
    selectedPhoto,
    setSelectedPhoto,
    hashtagsOfSelectedPhoto,
    viewsOfSelectedPhoto,
    areHashtagsEditing,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    handlePhotoClick,
    handlePhotoFlip,
    handleAddPhotoViaLink,
    handlePhotoDelete,
    setAreHashtagsEditing,
    handleEditHashtags,
    getPhotosLayout,
    calculatePhotosCount,
    photosToRender,
    setPhotosToRender,
    allPhotos,
    setAllPhotos,
    loadedPhotos,
    setLoadedPhotos,
    photosPage,
    setPhotosPage,
    photosPages,
    setPhotosPages,
    currentPhotosNumber,
    setCurrentPhotosNumber,
    photosToAdd,
    visibleLoadedPhotosCount,
    setVisibleLoadedPhotosCount,
    hasMorePhotos,
    showMorePhotos,
  };
}
