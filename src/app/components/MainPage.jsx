import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../shared/utils/api";
import LatestPosts from "../../features/blog/components/LatestPosts";
import DeletePostModal from "../../features/blog/components/DeletePostModal";
import EditPostPopup from "../../features/blog/components/EditPostPopup";
import usePosts from "../../features/blog/hooks/usePosts";
import DeletePhotoModal from "../../features/gallery/components/DeletePhotoModal";
import PhotoPopup from "../../features/gallery/components/PhotoPopup";
import ContentLoader from "./ContentLoader";
import MainNav from "./MainNav";
import MainMenu from "./MainMenu";
import ScrollHintMouse from "./ScrollHintMouse";
import SkipLink from "./SkipLink";
import NotFoundContent from "./NotFoundContent";
import isValidUrl from "../../shared/utils/isValidUrl";
import homeBackground from "../assets/main-hero.webp";
import errorImage from "../assets/image-error.svg";
import {
  DELETE_PHOTO_ERROR_MSG,
  EDIT_HASHTAGS_ERROR_MSG,
  SUCCESSFUL_PHOTO_DELETE_MSG,
} from "../../shared/utils/messages";

function formatPhotoHashtags(hashtags) {
  const tags = Array.isArray(hashtags)
    ? hashtags.flatMap((tag) => String(tag).split(/\s+/))
    : String(hashtags || "").split(/\s+/);

  return tags
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .join(" ");
}

function MainPage({
  loggedIn,
  handleSignout,
  isLoading,
  openModal,
  startLoading,
  stopLoading,
}) {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [hasPhotosError, setHasPhotosError] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isEditPostPopupOpen, setIsEditPostPopupOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [photoToPreview, setPhotoToPreview] = useState(null);
  const [arePhotoHashtagsEditing, setArePhotoHashtagsEditing] =
    useState(false);
  const [query, setQuery] = useState("");
  const [activePostHashtag, setActivePostHashtag] = useState("All");
  const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);

  const closePostPopups = useCallback(() => {
    setIsEditPostPopupOpen(false);
    setIsDeletePostModalOpen(false);
    setRedirectAfterDelete(false);
  }, []);

  const {
    postsToRender,
    handleEditPostPopupOpen,
    postToEdit,
    handleEditPost,
    handleDeletePostModalOpen,
    handlePostDelete,
    postToDelete,
    isPostsLoading,
  } = usePosts({
    screenWidth: window.innerWidth,
    isAlinaRoute: true,
    query,
    setQuery,
    activePostHashtag,
    setActivePostHashtag,
    startLoading,
    stopLoading,
    openModal,
    closeAllBlogPopups: closePostPopups,
    setIsEditPostPopupOpen,
    setIsDeletePostModalOpen,
    setRedirectAfterDelete,
    redirectAfterDelete,
  });

  useEffect(() => {
    let isMounted = true;

    api
      .getPhotos(1, 4)
      .then(({ data }) => {
        if (isMounted) {
          setPhotos(data);
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setHasPhotosError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsPhotosLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handlePostClick(post) {
    navigate(`/journal/posts/${post._id}`);
  }

  function handlePhotoClick(photo) {
    setPhotoToPreview(photo);
    setArePhotoHashtagsEditing(false);
    setIsPhotoPopupOpen(true);

    api
      .increaseViews(photo._id)
      .then((updatedPhoto) => {
        setPhotos((currentPhotos) =>
          currentPhotos.map((currentPhoto) =>
            currentPhoto._id === photo._id ? updatedPhoto : currentPhoto,
          ),
        );
        setPhotoToPreview(updatedPhoto);
      })
      .catch(console.error);
  }

  function closePhotoPopup() {
    setIsPhotoPopupOpen(false);
    setArePhotoHashtagsEditing(false);
    setPhotoToPreview(null);
  }

  function handlePhotoHashtagsEdit() {
    setArePhotoHashtagsEditing((isEditing) => !isEditing);
  }

  function handlePhotoHashtagsUpdate(photoId, hashtags) {
    startLoading();

    api
      .editHashtags(photoId, hashtags)
      .then((updatedPhoto) => {
        setPhotos((currentPhotos) =>
          currentPhotos.map((currentPhoto) =>
            currentPhoto._id === photoId ? updatedPhoto : currentPhoto,
          ),
        );
        setPhotoToPreview(updatedPhoto);
        setArePhotoHashtagsEditing(false);
      })
      .catch((error) => {
        openModal({
          status: "error",
          message: error.message || EDIT_HASHTAGS_ERROR_MSG,
        });
      })
      .finally(stopLoading);
  }

  function handleLogout() {
    setIsMainMenuOpen(false);
    handleSignout();
  }

  function handleDeletePhotoModalOpen(photo) {
    setSelectedPhoto(photo);
    setIsDeletePhotoModalOpen(true);
  }

  function closeDeletePhotoModal() {
    setIsDeletePhotoModalOpen(false);
    setSelectedPhoto(null);
  }

  function handlePhotoDelete(photo) {
    api
      .deletePhoto(photo._id)
      .then(() => {
        setPhotos((currentPhotos) =>
          currentPhotos.filter(
            (currentPhoto) => currentPhoto._id !== photo._id,
          ),
        );
        openModal({
          status: "success",
          message: SUCCESSFUL_PHOTO_DELETE_MSG,
        });
      })
      .catch((error) => {
        openModal({
          status: "error",
          message: error.message || DELETE_PHOTO_ERROR_MSG,
        });
      })
      .finally(closeDeletePhotoModal);
  }

  function handleScrollHintClick() {
    document.getElementById("photos")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="main-page">
      <SkipLink targetId="main-content" />
      <section
        className="main-page__hero"
        style={{ backgroundImage: `url(${homeBackground})` }}
      >
        <header className="main-page__header">
          <MainNav
            activeSection="main"
            loggedIn={loggedIn}
            onLogout={handleLogout}
            onMenuClick={() => setIsMainMenuOpen(true)}
            isMenuOpen={isMainMenuOpen}
            menuId="main-page-menu"
          />
        </header>

        <div className="main-page__hero-content" id="about">
          <h1 className="main-page__title">WELCOME TO ZNAC</h1>
          <p className="main-page__description">
            A space for photographs, thoughts and things in progress. From
            everyday life and travels to web design, React experiments and
            frontend projects.
          </p>
          <div className="main-page__hero-actions">
            <Link
              className="main-page__hero-link main-page__hero-link_primary"
              to="/gallery"
            >
              Dive into Gallery <span aria-hidden="true">&#8594;</span>
            </Link>
            <Link
              className="main-page__hero-link main-page__hero-link_secondary"
              to="/journal"
            >
              Explore Journal <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
        </div>
        <ScrollHintMouse
          onClick={handleScrollHintClick}
          ariaLabel="Scroll to latest photos"
        />
      </section>

      <main className="main-page__content" id="main-content">
        <section className="main-page__section" id="photos">
          <div className="main-page__section-heading">
            <h2 className="main-page__section-title">Latest Photos</h2>
            {photos.length > 0 && (
              <Link className="main-page__view-all" to="/gallery">
                View all <span aria-hidden="true">&#8594;</span>
              </Link>
            )}
          </div>
          <div className="main-page__photos-content">
            {isPhotosLoading ? (
              <ContentLoader label="Loading latest photos" tone="gallery" />
            ) : hasPhotosError || photos.length === 0 ? (
              <NotFoundContent />
            ) : (
              <ul className="main-page__photos">
                {photos.map((photo) => {
                  const imageSrc = isValidUrl(photo.thumbnail)
                    ? photo.thumbnail
                    : photo.link;
                  const photoHashtags = formatPhotoHashtags(photo.hashtags);

                  return (
                    <li className="main-page__photo" key={photo._id}>
                      <button
                        className="main-page__photo-button"
                        type="button"
                        onClick={() => handlePhotoClick(photo)}
                        aria-label={`Open photo ${photoHashtags || "photo"}`}
                      >
                        <img
                          className="main-page__photo-image"
                          src={imageSrc}
                          alt={photoHashtags}
                          loading="lazy"
                          onError={(event) => {
                            const image = event.currentTarget;

                            if (
                              imageSrc !== photo.link &&
                              isValidUrl(photo.link) &&
                              !image.dataset.fallbackApplied
                            ) {
                              image.dataset.fallbackApplied = "true";
                              image.src = photo.link;
                            } else {
                              image.onerror = null;
                              image.src = errorImage;
                            }
                          }}
                        />
                      </button>
                      {loggedIn && (
                        <button
                          className="main-page__photo-delete-btn"
                          type="button"
                          onClick={() => handleDeletePhotoModalOpen(photo)}
                          aria-label={`Delete photo ${photoHashtags}`}
                        />
                      )}
                      <p className="main-page__photo-hashtags">
                        {photoHashtags}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="main-page__posts-section" id="posts">
          <LatestPosts
            loggedIn={loggedIn}
            posts={postsToRender}
            postsQuantity={4}
            isThereMoreContent
            onPostClick={handlePostClick}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            onViewAllClick={() => navigate("/journal/posts")}
            isLoading={isPostsLoading}
            notFoundContent={<NotFoundContent />}
          />
        </section>
      </main>

      <footer className="main-page__footer" id="contact">
        <div className="main-page__footer-column">
          <p>&copy; {new Date().getFullYear()} All rights reserved | ZNAC</p>
          <p>
            Website design &amp; development
            <br />
            by Alina Zolotavina
          </p>
        </div>
        <div className="main-page__footer-column">
          <a href="mailto:znacompany@gmail.com">
            <span
              className="main-page__footer-icon main-page__footer-icon_email"
              aria-hidden="true"
            />
            znacompany@gmail.com
          </a>
          <a
            href="https://www.instagram.com/znac.photo/"
            target="_blank"
            rel="noreferrer"
          >
            <span
              className="main-page__footer-icon main-page__footer-icon_instagram"
              aria-hidden="true"
            />
            znac.photo
          </a>
        </div>
        <div className="main-page__footer-column">
          <a href="mailto:albekmerus@gmail.com">
            <span
              className="main-page__footer-icon main-page__footer-icon_email"
              aria-hidden="true"
            />
            albekmerus@gmail.com
          </a>
          <a
            href="https://github.com/alinazolotavina/"
            target="_blank"
            rel="noreferrer"
          >
            <span
              className="main-page__footer-icon main-page__footer-icon_github"
              aria-hidden="true"
            />
            GitHub
          </a>
        </div>
      </footer>
      <MainMenu
        isOpen={isMainMenuOpen}
        loggedIn={loggedIn}
        onClose={() => setIsMainMenuOpen(false)}
        onLogout={handleLogout}
        menuId="main-page-menu"
      />
      <DeletePhotoModal
        photo={selectedPhoto}
        isOpen={isDeletePhotoModalOpen}
        onClose={closeDeletePhotoModal}
        onDeletePhoto={handlePhotoDelete}
      />
      <PhotoPopup
        loggedIn={loggedIn}
        isOpen={isPhotoPopupOpen}
        photo={photoToPreview}
        photoHashtags={photoToPreview?.hashtags || []}
        views={photoToPreview?.views || 0}
        onClose={closePhotoPopup}
        onHashtagClick={() => {}}
        areHashtagsEditing={arePhotoHashtagsEditing}
        onEditHashtags={handlePhotoHashtagsUpdate}
        isSendingReq={isLoading}
        onEditHashtagsBtnClick={handlePhotoHashtagsEdit}
        onPhotoFlip={() => {}}
        isLeftFlipDisabled
        isRightFlipDisabled
      />
      <EditPostPopup
        isOpen={isEditPostPopupOpen}
        onClose={closePostPopups}
        isSendingReq={isLoading}
        post={postToEdit}
        onEditPost={handleEditPost}
      />
      <DeletePostModal
        post={postToDelete}
        isOpen={isDeletePostModalOpen}
        onClose={closePostPopups}
        onDeletePost={handlePostDelete}
      />
    </div>
  );
}

export default MainPage;
