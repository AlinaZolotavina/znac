import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "../../features/gallery/components/Home";
import Main from "../../features/gallery/components/Main";
import Footer from "../../features/gallery/components/Footer";
import AddPhoto from "../../features/gallery/components/AddPhoto";
import ProtectedRoute from "../../app/components/ProtectedRoute";
import NotFound from "../../app/components/NotFound";

import PhotoPopup from "../../features/gallery/components/PhotoPopup";
import DeletePhotoModal from "../../features/gallery/components/DeletePhotoModal";

import usePhotos from "./hooks/usePhotos";

import scrollToRef from "./utils/scrollToRef";

function GalleryRoot({
  loggedIn,
  isAuthInitialized,
  currentUser,
  handleSignout,
  isLoading,
  openModal,
  startLoading,
  stopLoading,
  screenWidth,
  setScreenWidth,
  closeModal,
  onMenuClick,
  onMenuClose,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const homeRef = useRef(null);
  const mainRef = useRef(null);
  const footerRef = useRef(null);
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [hashtag, setHashtag] = useState(""); // search input
  const [lastHashtags, setLastHashtags] = useState([]);

  const closeGalleryPopups = useCallback(() => {
    setIsPhotoPopupOpen(false);
    setIsDeletePhotoModalOpen(false);
    closeModal();
  }, [closeModal]);

  const {
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

  function handleHomeClick() {
    navigate("/");

    requestAnimationFrame(() => {
      scrollToRef(homeRef);
    });
  }

  function handleGalleryClick() {
    scrollToRef(mainRef);
  }

  function handleBlogClick() {
    window.scrollTo(0, 0);
    onMenuClose();
  }

  function handleContactClick() {
    scrollToRef(footerRef);
  }

  const handleKeyPress = useCallback(
    (e) => {
      const { keyCode } = e;

      if (keyCode === 27) {
        closeGalleryPopups();
        onMenuClose();
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
      onMenuClose,
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
          index
          element={
            <>
              <Home
                loggedIn={loggedIn}
                ref={homeRef}
                onHomeClick={handleHomeClick}
                onGalleryClick={handleGalleryClick}
                onBlogClick={handleBlogClick}
                onContactClick={handleContactClick}
                onProfileClick={() => navigate("/profile")}
                onAddPhotoClick={() => navigate("/addphoto")}
                onMenuClick={onMenuClick}
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
          path="addphoto"
          element={
            <ProtectedRoute
              loggedIn={loggedIn}
              isAuthInitialized={isAuthInitialized}
            >
              <AddPhoto
                loggedIn={loggedIn}
                onHomeClick={handleHomeClick}
                onBlogClick={handleBlogClick}
                onGalleryClick={handleGalleryClick}
                onContactClick={handleContactClick}
                onMenuClick={onMenuClick}
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
