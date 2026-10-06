import Header from "../../../app/components/Header";
import MainNav from "../../../app/components/MainNav";
import Form from "../../../app/components/Form";
import Input from "../../../app/components/Input";
import Modal from "../../../app/components/Modal";
import { useEffect, useRef, useState } from "react";
import UploadFileInfo from "./UploadFileInfo";
import { useLocation } from "react-router-dom";
import isValidUrl from "../../../shared/utils/isValidUrl";

const MAX_FILES_COUNT = 10;
const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB
const PHOTO_UPLOAD_STATUS = {
  ready: "ready",
  uploading: "uploading",
  success: "success",
  error: "error",
};
const PHOTO_UPLOAD_TYPES = [
  {
    value: "pc",
    labelClassName: "radio-btn__label radio-btn__label_type_pc",
    tooltip: "Upload photo from PC",
  },
  {
    value: "google-drive",
    labelClassName: "radio-btn__label radio-btn__label_type_google-drive",
    tooltip: "Add photo via its Google Drive link",
  },
  {
    value: "link",
    labelClassName: "radio-btn__label radio-btn__label_type_link",
    tooltip: "Add photo via link",
  },
];

function AddPhoto({
  loggedIn,
  onMenuClick,
  isSendingReq,
  onAddPhotoViaLink,
  onUploadPhotoToServer,
  onLogout,
  isMenuOpen,
  menuId,
  onContactClick,
}) {
  const [photoLink, setPhotoLink] = useState("");
  const [photoLinkError, setPhotoLinkError] = useState("");
  const [photoItems, setPhotoItems] = useState([]);
  const [hashtags, setHashtags] = useState("");
  const [hashtagsError, setHashtagsError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasPartialUploadWarning, setHasPartialUploadWarning] = useState(false);
  const [pcDownloadCheck, setPcDownloadCheck] = useState(true);
  const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);
  const [googleDownloadCheck, setGoogleDownloadCheck] = useState(false);
  const [googlePhotoId, setGooglePhotoId] = useState("");
  const location = useLocation();
  const views = 0;
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const uploadTypeRefs = useRef([]);
  const photoItemsRef = useRef([]);
  const photoItemIdRef = useRef(0);
  const [modalData, setModalData] = useState({
    isOpen: false,
    status: "",
    message: "",
  });
  const uploadStatusMessage = isUploadingPhotos
    ? "Processing selected photos"
    : "";
  const isUploadControlsDisabled = isSendingReq || isUploadingPhotos;
  const uploadablePhotoItems = photoItems.filter(
    (item) => item.status !== PHOTO_UPLOAD_STATUS.success,
  );
  const submitButtonText = hasPartialUploadWarning
    ? "Try to add again"
    : "Add";

  useEffect(() => {
    clearInputs();
  }, [location.pathname]);

  useEffect(() => {
    photoItemsRef.current = photoItems;
  }, [photoItems]);

  useEffect(() => {
    return () => {
      photoItemsRef.current.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, []);

  const openModal = ({ status, message, type }) => {
    setModalData({
      isOpen: true,
      status,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModalData({
      isOpen: false,
      status: "",
      message: "",
      type: "",
    });
  };

  function clearInputs() {
    setPhotoLink("");
    setPhotoLinkError("");
    setHashtags("");
    setHashtagsError("");
    setLinkDownloadCheck(false);
    setGoogleDownloadCheck(false);
    setPcDownloadCheck(true);
    setHasPartialUploadWarning(false);
    setPhotoItems((items) => {
      items.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });

      return [];
    });
    setIsUploadingPhotos(false);
  }

  function handlePhotoLinkChange(e) {
    const value = e.target.value.trim();

    if (!value) {
      setPhotoLinkError("You missed this field");
    } else if (!isValidUrl(value)) {
      setPhotoLinkError("Invalid URL");
    } else {
      setPhotoLinkError("");
    }

    setPhotoLink(value);
  }

  useEffect(() => {
    if (googleDownloadCheck) {
      setGooglePhotoId(photoLink.split("/")[5]);
    }
  }, [photoLink, googleDownloadCheck]);

  function handleHashtagsChange(e) {
    const regex = /^[A-Za-zА-Яа-я0-9 _]*$/;
    if (e.target.value.length === 0) {
      setHashtagsError("You must add at least one hashtag");
    } else if (!regex.test(e.target.value)) {
      setHashtagsError("Only letters, numbers and underscores are allowed");
    } else {
      setHashtagsError("");
    }
    setHashtags(e.target.value);
  }

  useEffect(() => {
    if (
      (photoLink && hashtags && !photoLinkError && !hashtagsError) ||
      (uploadablePhotoItems.length !== 0 && hashtags && !hashtagsError)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [
    photoLink,
    photoLinkError,
    hashtags,
    hashtagsError,
    uploadablePhotoItems.length,
  ]);

  function handlePcDownloadClick() {
    setPcDownloadCheck(true);
    setGoogleDownloadCheck(false);
    setLinkDownloadCheck(false);
  }

  function handleLinkDownloadClick() {
    setPcDownloadCheck(false);
    setGoogleDownloadCheck(false);
    setLinkDownloadCheck(true);
  }

  function handleGoogleDownloadClick() {
    setPcDownloadCheck(false);
    setGoogleDownloadCheck(true);
    setLinkDownloadCheck(false);
  }

  function activateUploadType(type) {
    if (type === "pc") {
      handlePcDownloadClick();
    } else if (type === "google-drive") {
      handleGoogleDownloadClick();
    } else {
      handleLinkDownloadClick();
    }
  }

  function handleUploadTypeKeyDown(e, currentIndex) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();

      const direction = e.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + PHOTO_UPLOAD_TYPES.length) %
        PHOTO_UPLOAD_TYPES.length;

      uploadTypeRefs.current[nextIndex]?.focus();
      return;
    }

    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      activateUploadType(PHOTO_UPLOAD_TYPES[currentIndex].value);
    }
  }

  async function handleUploadFromPc(e) {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    setHasPartialUploadWarning(false);

    const currentFilesCount = photoItems.length;

    if (currentFilesCount + selectedFiles.length > MAX_FILES_COUNT) {
      openModal({
        status: "error",
        message: `You already selected ${currentFilesCount} files. Maximum allowed is ${MAX_FILES_COUNT}.`,
      });

      e.target.value = "";
      return;
    }

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        openModal({
          status: "error",
          message: `${file.name} exceeds the 30 MB limit`,
        });

        e.target.value = "";
        return;
      }
    }

    try {
      setIsUploadingPhotos(true);
      let failedFilesCount = 0;

      await Promise.all(
        selectedFiles.map(async (file) => {
          const fileName = file.name.replace(/\.[^.]+$/, "");

          try {
            const convertedFile = await convert(file, fileName);
            const convertedPhoto = {
              id: `photo-${photoItemIdRef.current++}`,
              file: convertedFile,
              name: `${fileName}.webp`,
              previewUrl: URL.createObjectURL(convertedFile),
              status: PHOTO_UPLOAD_STATUS.ready,
            };

            setPhotoItems((prevItems) => [...prevItems, convertedPhoto]);
          } catch (err) {
            failedFilesCount += 1;
            console.error(err);
          }
        }),
      );

      if (failedFilesCount > 0) {
        openModal({
          status: "error",
          message:
            failedFilesCount === 1
              ? "Failed to process 1 selected file"
              : `Failed to process ${failedFilesCount} selected files`,
        });
      }
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: "Failed to process selected files",
      });
    } finally {
      setIsUploadingPhotos(false);
    }

    e.target.value = "";
  }

  const convert = (sourceFile, targetName) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const objectUrl = URL.createObjectURL(sourceFile);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);

            if (!blob) {
              reject(new Error("Conversion failed"));
              return;
            }

            resolve(
              new File([blob], `${targetName}.webp`, { type: "image/webp" }),
            );
          },
          "image/webp",
          0.5,
        );
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      };

      img.src = objectUrl;
    });
  };

  function handleRemoveSelectedPhoto(photoId) {
    setPhotoItems((items) => {
      const photoToRemove = items.find((item) => item.id === photoId);

      if (photoToRemove?.previewUrl) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }

      return items.filter((item) => item.id !== photoId);
    });
  }

  function handlePhotoUploadStatusChange(photoId, status, err) {
    setPhotoItems((items) =>
      items.map((item) =>
        item.id === photoId
          ? {
              ...item,
              status,
              error: err?.message || "",
            }
          : item,
      ),
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (linkDownloadCheck) {
        await onAddPhotoViaLink({
          link: photoLink,
          hashtags,
          views,
        });

        clearInputs();
      } else if (googleDownloadCheck) {
        await onAddPhotoViaLink({
          link: `https://lh3.googleusercontent.com/d/${googlePhotoId}`,
          hashtags,
          views,
        });

        clearInputs();
      } else if (pcDownloadCheck) {
        setHasPartialUploadWarning(false);

        const uploadResult = await onUploadPhotoToServer(
          uploadablePhotoItems.map(({ id, file }) => ({ id, file })),
          hashtags,
          views,
          handlePhotoUploadStatusChange,
        );

        setHasPartialUploadWarning(
          uploadResult?.addedPhotos?.length > 0 && uploadResult?.failedCount > 0,
        );

        if (
          uploadResult?.addedPhotos?.length > 0 &&
          uploadResult?.failedCount === 0
        ) {
          clearInputs();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className="add-photo">
        <Header className="header admin-header header_type_main-nav">
          <MainNav
            activeSection="photos"
            activeSubsection="add-photo"
            loggedIn={loggedIn}
            onLogout={onLogout}
            onMenuClick={onMenuClick}
            isMenuOpen={isMenuOpen}
            menuId={menuId}
            onContactClick={onContactClick}
          />
        </Header>
        <main>
          <Form
            formName="add-photo"
            formClassname="form add-photo__form"
            titleClassname="form__title"
            title="Add new photo"
            titleTag="h1"
            buttonClassname="form__submit-btn"
            buttonText={submitButtonText}
            isFormValid={isFormValid}
            isSendingReq={isUploadControlsDisabled}
            onSubmit={handleSubmit}
          >
          <div
            className="radio-buttons-container"
            role="tablist"
            aria-label="Photo upload method"
          >
            {PHOTO_UPLOAD_TYPES.map((type, index) => {
              const isActive =
                (type.value === "pc" && pcDownloadCheck) ||
                (type.value === "google-drive" && googleDownloadCheck) ||
                (type.value === "link" && linkDownloadCheck);

              return (
                <button
                  key={type.value}
                  ref={(node) => {
                    uploadTypeRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  className={`radio-btn ${isActive ? "radio-btn_state_active" : "radio-btn_state_inactive"}`}
                  onClick={() => activateUploadType(type.value)}
                  onKeyDown={(e) => handleUploadTypeKeyDown(e, index)}
                  disabled={isUploadControlsDisabled}
                >
                  <span className={type.labelClassName} aria-hidden="true" />
                  <span className="radio-btn__tooltip">{type.tooltip}</span>
                </button>
              );
            })}
          </div>
          <div className="add-photo__upload-section">
            {pcDownloadCheck ? (
              <div className="upload-container">
                <div className="visually-hidden" role="status">
                  {uploadStatusMessage}
                </div>
                <label className="upload-file">
                  <input
                    id="photo-file-upload"
                    name="photoFile"
                    className="upload-file__input"
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handleUploadFromPc}
                    disabled={isUploadControlsDisabled}
                  />
                  <span
                    className={`upload-file__btn ${
                      isUploadControlsDisabled ? "upload-file__btn_disabled" : ""
                    }`}
                  >
                    <div className="upload-file__icon" />
                    Select
                  </span>
                </label>
                {isUploadingPhotos && photoItems.length === 0 && (
                  <div
                    className="upload-file__processing"
                    aria-hidden="true"
                  >
                    <span className="upload-file__processing-spinner" />
                  </div>
                )}
                <ul
                  className={`upload-file__info ${
                    photoItems.length === 0 ? "upload-file__info_empty" : ""
                  }`}
                >
                  {photoItems.length === 0 && !isUploadingPhotos ? (
                    <li className="upload-file__info_empty">
                      Photo not selected
                    </li>
                  ) : (
                    photoItems.map((photo) => (
                      <UploadFileInfo
                        key={photo.id}
                        photo={photo}
                        onRemove={() => handleRemoveSelectedPhoto(photo.id)}
                        isDisabled={isUploadControlsDisabled}
                      />
                    ))
                  )}
                </ul>
              </div>
            ) : (
              <Input
                labelClassname=""
                inputLabel="Photo"
                classname="input__field"
                placeholder="Paste image link"
                inputType="url"
                inputValue={photoLink}
                onChange={handlePhotoLinkChange}
                isSendingReq={isSendingReq}
                error={photoLinkError}
              />
            )}
          </div>
          <Input
            inputLabel="Hashtags"
            placeholder="Enter hashtags separated by spaces"
            classname="input__field"
            inputType="text"
            inputValue={hashtags}
            onChange={handleHashtagsChange}
            isSendingReq={isSendingReq}
            error={hashtagsError}
          />
          <div
            className={`add-photo__upload-warning ${
              hasPartialUploadWarning ? "add-photo__upload-warning_visible" : ""
            }`}
            role={hasPartialUploadWarning ? "status" : undefined}
            aria-hidden={hasPartialUploadWarning ? undefined : "true"}
          >
            <span className="add-photo__upload-warning-icon">!</span>
            <p className="add-photo__upload-warning-text">
              Not all photos were uploaded. Please try again.
            </p>
          </div>
          </Form>
        </main>
      </div>
      <Modal
        isOpen={modalData.isOpen}
        status={modalData.status}
        type={modalData.type}
        message={modalData.message}
        onClose={closeModal}
      />
    </>
  );
}

export default AddPhoto;
