import Header from "../../../app/components/Header";
import Navigation from "../../../app/components/Navigation";
import LogoutButton from "../../../app/components/LogoutButton";
import Form from "../../../app/components/Form";
import Input from "../../../app/components/Input";
import Modal from "../../../app/components/Modal";
import { useState } from "react";
import BurgerMenuBtn from "../../../app/components/BurgerMenuBtn";
import UploadFileInfo from "./UploadFileInfo";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import isValidUrl from "../../../shared/utils/isValidUrl";

const MAX_FILES_COUNT = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function AddPhoto({
  loggedIn,
  onHomeClick,
  onBlogClick,
  onGalleryClick,
  onContactClick,
  onMenuClick,
  isSendingReq,
  onAddPhotoViaLink,
  onUploadPhotoToServer,
  email,
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
  const [modalData, setModalData] = useState({
    isOpen: false,
    status: "",
    message: "",
  });

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
      <section className="add-photo">
        <Header className="header admin-header">
          <Navigation
            loggedIn={loggedIn}
            onHomeClick={() => {}}
            onGalleryClick={onGalleryClick}
            onContactClick={onContactClick}
          />
          {loggedIn && (
            <LogoutButton
              className="logout-btn logout-btn_position_nav"
              email={email}
              onLogout={onLogout}
            />
          )}
        </Header>
        <BurgerMenuBtn onMenuClick={onMenuClick} />
        <Form
          formName="add-photo"
          formClassname="form add-photo__form"
          titleClassname="form__title"
          title="Add new photo"
          buttonClassname="form__submit-btn"
          buttonText="Add photo"
          isFormValid={isFormValid}
          isSendingReq={isSendingReq}
          onSubmit={handleSubmit}
        >
          <div className="radio-buttons-container">
            <div
              className={`radio-btn ${pcDownloadCheck ? "radio-btn_state_active" : "radio-btn_state_inactive"}`}
              onClick={handlePcDownloadClick}
            >
              <input type="radio" className="radio-btn__input" />
              <label className="radio-btn__label radio-btn__label_type_pc" />
              <span className="radio-btn__tooltip">Upload photo from PC</span>
            </div>
            <div
              className={`radio-btn ${googleDownloadCheck ? "radio-btn_state_active" : "radio-btn_state_inactive"}`}
              onClick={handleGoogleDownloadClick}
            >
              <input type="radio" className="radio-btn__input" />
              <label className="radio-btn__label radio-btn__label_type_google-drive" />
              <span className="radio-btn__tooltip">
                Add photo via its Google Drive link
              </span>
            </div>
            <div
              className={`radio-btn ${linkDownloadCheck ? "radio-btn_state_active" : "radio-btn_state_inactive"}`}
              onClick={handleLinkDownloadClick}
            >
              <input type="radio" className="radio-btn__input" />
              <label className="radio-btn__label radio-btn__label_type_link" />
              <span className="radio-btn__tooltip">Add photo via link</span>
            </div>
          </div>
          {pcDownloadCheck ? (
            <div className="upload-container">
              <label className="upload-file">
                <input
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
      </section>
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
