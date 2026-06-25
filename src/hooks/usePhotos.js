import { useState } from "react";
import api from "../utils/api";

export default function usePhotos({
  openModal,
  startLoading,
  stopLoading,
  closeAllPopups,
  setAllPhotos,
  allPhotos,
  setPhotosToRender,
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const hashtagsOfSelectedPhoto = selectedPhoto?.hashtags || [];
  const viewsOfSelectedPhoto = selectedPhoto?.views || 0;
  const [areHashtagsEditing, setAreHashtagsEditing] = useState(false);

  // open photo popup, handle photo flip

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
      })
      .catch((err) => console.log(err))
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
      .catch((err) => console.log(err));
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
  };
}
