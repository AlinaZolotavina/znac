import api from "../../../shared/utils/api";
import {
  DEFAULT_ERROR_MSG,
  PHOTO_ADDED_SUCCESSFULLY_MSG,
  PHOTOS_ADDED_SUCCESSFULLY_MSG,
} from "../../../shared/utils/messages";

export default function photoUploadActions({
  startLoading,
  stopLoading,
  addPhotosToGallery,
  openModal,
}) {
  async function uploadSinglePhoto(file, hashtags, views) {
    const formData = new FormData();

    formData.append("photos", file);

    const response = await api.uploadPhoto(formData);

    if (!response.data?.length) {
      throw new Error("Upload response is invalid");
    }

    const photoDataToSave = {
      filename: response.data[0].filename,
      hashtags,
      views,
    };

    return api.addPhoto(photoDataToSave);
  }

  function handlePhotoUploadSuccess({ addedPhotos }) {
    addPhotosToGallery(addedPhotos);

    openModal({
      status: "success",
      message:
        addedPhotos.length === 1
          ? PHOTO_ADDED_SUCCESSFULLY_MSG
          : PHOTOS_ADDED_SUCCESSFULLY_MSG(addedPhotos.length),
    });
  }

  async function handlePhotoUpload({ photoData, hashtags, views }) {
    startLoading();

    try {
      const addedPhotos = [];

      for (const file of photoData) {
        const newPhoto = await uploadSinglePhoto(file, hashtags, views);
        addedPhotos.push(newPhoto);
      }

      handlePhotoUploadSuccess({
        addedPhotos,
        addPhotosToGallery,
        openModal,
      });

      return addedPhotos;
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: DEFAULT_ERROR_MSG,
      });

      throw err;
    } finally {
      stopLoading();
    }
  }

  return {
    handlePhotoUpload,
  };
}
