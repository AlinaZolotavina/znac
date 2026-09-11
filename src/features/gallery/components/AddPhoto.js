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
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
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
}) {
  const [photoLink, setPhotoLink] = useState("");
  const [photoLinkError, setPhotoLinkError] = useState("");
  const [photoFiles, setPhotoFiles] = useState([]);
  const [fileInfo, setFileInfo] = useState("Photo not selected");
  const [hashtags, setHashtags] = useState("");
  const [hashtagsError, setHashtagsError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [pcDownloadCheck, setPcDownloadCheck] = useState(true);
  const [linkDownloadCheck, setLinkDownloadCheck] = useState(false);
  const [googleDownloadCheck, setGoogleDownloadCheck] = useState(false);
  const [googlePhotoId, setGooglePhotoId] = useState("");
  const location = useLocation();
  const views = 0;
  const [fileNames, setFileNames] = useState([]);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const uploadTypeRefs = useRef([]);
  const [modalData, setModalData] = useState({
    isOpen: false,
    status: "",
    message: "",
  });
  const uploadStatusMessage = isUploadingPhotos ? "Uploading" : "";

  useEffect(() => {
    clearInputs();
  }, [location.pathname]);

  useEffect(() => {
    if (photoFiles.length === 0) {
      setFileInfo("Photo not selected");
    } else {
      setFileInfo("");
    }
  }, [photoFiles]);

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
    setFileNames([]);
    setFileInfo("Photo not selected");
    setPhotoFiles([]);
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
      (photoFiles.length !== 0 && hashtags && !hashtagsError)
    ) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [photoLink, photoLinkError, hashtags, hashtagsError, photoFiles]);

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

    const currentFilesCount = photoFiles.length;

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
          message: `${file.name} exceeds the 10 MB limit`,
        });

        e.target.value = "";
        return;
      }
    }

    try {
      setIsUploadingPhotos(true);
      const convertedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileName = file.name.replace(/\.[^.]+$/, "");

          return {
            file: await convert(file, fileName),
            name: `${fileName}.webp`,
          };
        }),
      );

      setPhotoFiles((prevFiles) => [
        ...prevFiles,
        ...convertedFiles.map((item) => item.file),
      ]);

      setFileNames((prevNames) => [
        ...prevNames,
        ...convertedFiles.map((item) => item.name),
      ]);
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

  function handleRemoveSelectedPhoto(index) {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setFileNames((prev) => prev.filter((_, i) => i !== index));
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
        await onUploadPhotoToServer(photoFiles, hashtags, views);

        clearInputs();
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
            buttonText="Add photo"
            isFormValid={isFormValid}
            isSendingReq={isSendingReq}
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
                  />
                  <span className="upload-file__btn">
                    <div className="upload-file__icon" />
                    Select photo
                  </span>
                </label>
                <ul className="upload-file__info">
                  {isUploadingPhotos ? (
                    <li className="upload-file__status">
                      Uploading
                      <span className="upload-file__dots" />
                    </li>
                  ) : photoFiles.length === 0 ? (
                    <li className="upload-file__info_empty">{fileInfo}</li>
                  ) : (
                    fileNames.map((name, index) => (
                      <UploadFileInfo
                        key={`${name}-${index}`}
                        fileName={name}
                        onRemove={() => handleRemoveSelectedPhoto(index)}
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
