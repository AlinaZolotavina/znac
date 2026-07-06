import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Main from "./Main";
import Footer from "./Footer";
import Profile from "./Profile";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
import AddPhoto from "./AddPhoto";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import PhotoPopup from "./PhotoPopup";
import DeletePhotoModal from "./DeletePhotoModal";

import usePhotos from "../hooks/usePhotos";

function GalleryRoot({
  loggedIn,
  currentUser,
  homeRef,
  mainRef,
  footerRef,
  handleSignout,
  handleHomeClick,
  handleBlogClick,
  handleGalleryClick,
  handleContactClick,
  handleMenuClick,
  isLoading,
  handleEditEmailBtnClick,
  handleEditPasswordBtnClick,
  handleUpdateEmail,
  openModal,
  startLoading,
  stopLoading,
  screenWidth,
  setScreenWidth,
  location,
}) {
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [hashtag, setHashtag] = useState(""); // search input
  const [lastHashtags, setLastHashtags] = useState([]);

  const closeGalleryPopups = useCallback(() => {
    setIsPhotoPopupOpen(false);
    setIsDeletePhotoModalOpen(false);
  }, []);

  const {
    selectedPhoto,
    hashtagsOfSelectedPhoto,
    viewsOfSelectedPhoto,
    areHashtagsEditing,
    handleEditHashtagsBtnClick,
    handleEditHashtags,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    handlePhotoFlip,
    handleAddPhotoFromPc,
    handleAddPhotoViaLink,
    handlePhotoDelete,
    calculatePhotosCount,
    photosToRender,
    currentPhotosNumber,
    hasMorePhotos,
    showMorePhotos,
    handlePhotoSearch,
    handleClearPhotoSearch,
    handlePhotoHashtagClick,
    handlePhotoOpen,
    handleDeletePhotoModalOpen,
  } = usePhotos({
    openModal,
    startLoading,
    stopLoading,
    closeAllPopups: closeGalleryPopups,
    screenWidth,
    setScreenWidth,
    hashtag,
    setHashtag,
    lastHashtags,
    setLastHashtags,
    location,
    setIsPhotoPopupOpen,
    setIsDeletePhotoModalOpen,
  });

  const handleKeyPress = useCallback(
    (e) => {
      const { keyCode } = e;

      if (keyCode === 27) {
        closeGalleryPopups();
      }

      if (isPhotoPopupOpen) {
        if (keyCode === 37 && !isLeftFlipDisabled) {
          handlePhotoFlip("left");
        }

        if (keyCode === 39 && !isRightFlipDisabled) {
          handlePhotoFlip("right");
        }
      }

      if (keyCode === 13 && isDeletePhotoModalOpen) {
        handlePhotoDelete(selectedPhoto);
      }
    },
    [
      closeGalleryPopups,
      isPhotoPopupOpen,
      isLeftFlipDisabled,
      isRightFlipDisabled,
      handlePhotoFlip,
      isDeletePhotoModalOpen,
      handlePhotoDelete,
      selectedPhoto,
    ],
  );

  const handleOverlayClickClose = useCallback(
    (e) => {
      if (
        e.target.classList.contains("popup_is-opened") ||
        e.target.classList.contains("popup__close-btn")
      ) {
        closeGalleryPopups();
      }
    },
    [closeGalleryPopups],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleOverlayClickClose);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleOverlayClickClose);
    };
  }, [handleKeyPress, handleOverlayClickClose]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home
                loggedIn={loggedIn}
                ref={homeRef}
                onHomeClick={handleHomeClick}
                onBlogClick={handleBlogClick}
                onGalleryClick={handleGalleryClick}
                onContactClick={handleContactClick}
                onMenuClick={handleMenuClick}
                onSignout={handleSignout}
                isSendingReq={isLoading}
                email={currentUser.email}
                onLogout={handleSignout}
              />
              <Main
                photos={photosToRender}
                loggedIn={loggedIn}
                ref={mainRef}
                onPhotoClick={handlePhotoOpen}
                onDeleteBtnClick={handleDeletePhotoModalOpen}
                onHomeClick={handleHomeClick}
                onBlogClick={handleBlogClick}
                onGalleryClick={handleGalleryClick}
                onContactClick={handleContactClick}
                onHashtagClick={handlePhotoHashtagClick}
                hashtag={hashtag}
                photoHashtags={lastHashtags || []}
                hashtagSetter={setHashtag}
                onSearch={handlePhotoSearch}
                onClearSearch={handleClearPhotoSearch}
                photosQuantity={currentPhotosNumber}
                hasMorePhotos={hasMorePhotos}
                onShowMore={showMorePhotos}
                email={currentUser.email}
                onLogout={handleSignout}
                areHashtagsEditing={false}
                onEditHashtags={handleEditHashtags}
                isSendingReq={isLoading}
                hashtagsNumber={10}
              />
              <Footer ref={footerRef} />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Profile
                loggedIn={loggedIn}
                onHomeClick={handleHomeClick}
                onBlogClick={handleBlogClick}
                onGalleryClick={handleGalleryClick}
                onContactClick={handleContactClick}
                onEditEmailBtnClick={handleEditEmailBtnClick}
                onEditPasswordBtnClick={handleEditPasswordBtnClick}
                onMenuClick={handleMenuClick}
                onSignout={handleSignout}
                isSendingReq={isLoading}
                email={currentUser.email}
                onLogout={handleSignout}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/update-email/:updateEmailLink"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <ConfirmEmailUpdate
                loggedIn={loggedIn}
                onUpdateEmail={handleUpdateEmail}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addphoto"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <AddPhoto
                loggedIn={loggedIn}
                onHomeClick={handleHomeClick}
                onBlogClick={handleBlogClick}
                onGalleryClick={handleGalleryClick}
                onContactClick={handleContactClick}
                onMenuClick={handleMenuClick}
                onSignout={handleSignout}
                isSendingReq={isLoading}
                onAddPhotoViaLink={handleAddPhotoViaLink}
                onUploadPhotoToServer={handleAddPhotoFromPc}
                email={currentUser.email}
                onLogout={handleSignout}
              />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <PhotoPopup
        loggedIn={loggedIn}
        isOpen={isPhotoPopupOpen}
        photo={selectedPhoto}
        photoHashtags={hashtagsOfSelectedPhoto || []}
        views={viewsOfSelectedPhoto}
        onClose={closeGalleryPopups}
        onHashtagClick={handlePhotoHashtagClick}
        areHashtagsEditing={areHashtagsEditing}
        onEditHashtags={handleEditHashtags}
        isSendingReq={isLoading}
        onEditHashtagsBtnClick={handleEditHashtagsBtnClick}
        onPhotoFlip={handlePhotoFlip}
        isLeftFlipDisabled={isLeftFlipDisabled}
        isRightFlipDisabled={isRightFlipDisabled}
      />

      <DeletePhotoModal
        photo={selectedPhoto}
        isOpen={isDeletePhotoModalOpen}
        onClose={closeGalleryPopups}
        onDeletePhoto={handlePhotoDelete}
      />
    </>
  );
}

export default GalleryRoot;
