import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Main from "./Main";
import Footer from "./Footer";
import Profile from "./Profile";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
import AddPhoto from "./AddPhoto";
import ProtectedRoute from "./ProtectedRoute";

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
  photosToRender,
  handlePhotoOpen,
  handleDeletePhotoModalOpen,
  handlePhotoHashtagClick,
  hashtag,
  lastHashtags,
  setHashtag,
  handlePhotoSearch,
  handleClearPhotoSearch,
  currentPhotosNumber,
  hasMorePhotos,
  showMorePhotos,
  handleEditHashtags,
  handleEditEmailBtnClick,
  handleEditPasswordBtnClick,
  handleUpdateEmail,
  handleAddPhotoViaLink,
  handleAddPhotoFromPc,
}) {
  return (
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
              nGalleryClick={handleGalleryClick}
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
    </Routes>
  );
}

export default GalleryRoot;
