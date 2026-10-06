import api from "../../../shared/utils/api";
import {
  DEFAULT_ERROR_MSG,
  PHOTOS_UPLOAD_FAILED_MSG,
  PHOTOS_UPLOAD_SUCCESS_MSG,
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

  function getPhotoFile(photoItem) {
    return photoItem.file || photoItem;
  }

  function getPhotoId(photoItem) {
    return photoItem.id;
  }

  function showUploadSummary(addedPhotos, failedCount) {
    if (addedPhotos.length > 0) {
      addPhotosToGallery(addedPhotos);
    }

    if (failedCount === 0) {
      openModal({
        status: "success",
        message: PHOTOS_UPLOAD_SUCCESS_MSG(addedPhotos.length),
      });

      return;
    }

    if (addedPhotos.length > 0) {
      return;
    }

    openModal({
      status: "error",
      message: PHOTOS_UPLOAD_FAILED_MSG(failedCount),
    });
  }

  async function uploadPhotoItem(photoItem, hashtags, views, onPhotoStatusChange) {
    const photoId = getPhotoId(photoItem);

    onPhotoStatusChange?.(photoId, "uploading");

    try {
      const newPhoto = await uploadSinglePhoto(
        getPhotoFile(photoItem),
        hashtags,
        views,
      );

      onPhotoStatusChange?.(photoId, "success");
      return newPhoto;
    } catch (err) {
      console.error(err);
      onPhotoStatusChange?.(photoId, "error", err);
      throw err;
    }
  }

  async function handlePhotoUpload({
    photoData,
    hashtags,
    views,
    onPhotoStatusChange,
  }) {
    startLoading();

    try {
      const results = await Promise.allSettled(
        photoData.map((photoItem) =>
          uploadPhotoItem(photoItem, hashtags, views, onPhotoStatusChange),
        ),
      );

      const addedPhotos = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      const failedCount = results.length - addedPhotos.length;

      showUploadSummary(addedPhotos, failedCount);

      return {
        addedPhotos,
        failedCount,
      };
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: DEFAULT_ERROR_MSG,
      });
      return {
        addedPhotos: [],
        failedCount: photoData.length,
      };
    } finally {
      stopLoading();
    }
  }

  return {
    handlePhotoUpload,
  };
}
