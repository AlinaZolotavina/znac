import { useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "../../features/gallery/components/Home";
import Main from "../../features/gallery/components/Main";
import Footer from "../../features/gallery/components/Footer";
import AddPhoto from "../../features/gallery/components/AddPhoto";
import ProtectedRoute from "../../app/components/ProtectedRoute";
import NotFound from "../../app/components/NotFound";
import SkipLink from "../../app/components/SkipLink";

import PhotoPopup from "../../features/gallery/components/PhotoPopup";
import DeletePhotoModal from "../../features/gallery/components/DeletePhotoModal";

import usePhotos from "./hooks/usePhotos";
import scrollToRef from "./utils/scrollToRef";

function GalleryRoot({
  loggedIn,
  isAuthInitialized,
  handleSignout,
  isLoading,
  openModal,
  startLoading,
  stopLoading,
  screenWidth,
  setScreenWidth,
  closeModal,
  onMenuClick,
  isMenuOpen,
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
    isPhotosLoading,

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

  useEffect(() => {
    const photoToOpen = location.state?.photoToOpen;

    if (!photoToOpen || isPhotoPopupOpen) {
      return;
    }

    handlePhotoOpen(photoToOpen);
    navigate(location.pathname, { replace: true, state: null });
  }, [handlePhotoOpen, isPhotoPopupOpen, location.pathname, location.state, navigate]);

  const handleKeyPress = useCallback(
    (e) => {
      const { keyCode } = e;

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
      isPhotoPopupOpen,
      isLeftFlipDisabled,
      isRightFlipDisabled,
      handlePhotoFlip,
      isDeletePhotoModalOpen,
      handlePhotoDelete,
      selectedPhoto,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const handleGallerySubsectionClick = useCallback((itemId, event) => {
    const sectionRefs = {
      explore: homeRef,
      photos: mainRef,
      contact: footerRef,
    };
    const sectionRef = sectionRefs[itemId];

    if (!sectionRef) {
      return;
    }

    event.preventDefault();
    scrollToRef(sectionRef);
  }, []);

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <SkipLink targetId="main" />
              <Home
                loggedIn={loggedIn}
                ref={homeRef}
                onMenuClick={onMenuClick}
                onLogout={handleSignout}
                onScrollHintClick={() => scrollToRef(mainRef)}
                onSubsectionClick={handleGallerySubsectionClick}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
              />
              <Main
                photos={photosToRender}
                loggedIn={loggedIn}
                ref={mainRef}
                onPhotoClick={handlePhotoOpen}
                onDeleteBtnClick={handleDeletePhotoModalOpen}
                onHashtagClick={handlePhotoHashtagClick}
                hashtag={hashtag}
                photoHashtags={lastHashtags || []}
                hashtagSetter={setHashtag}
                onSearch={handlePhotoSearch}
                onClearSearch={handleClearPhotoSearch}
                photosQuantity={currentPhotosNumber}
                hasMorePhotos={hasMorePhotos}
                onShowMore={showMorePhotos}
                areHashtagsEditing={false}
                onEditHashtags={handleEditHashtags}
                isSendingReq={isLoading}
                isPhotosLoading={isPhotosLoading}
                hashtagsNumber={10}
                onMenuClick={onMenuClick}
                onLogout={handleSignout}
                onSubsectionClick={handleGallerySubsectionClick}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
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
                onMenuClick={onMenuClick}
                isSendingReq={isLoading}
                onAddPhotoViaLink={handleAddPhotoViaLink}
                onUploadPhotoToServer={handleAddPhotoFromPc}
                onLogout={handleSignout}
                isMenuOpen={isMenuOpen}
                menuId="app-main-menu"
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
