import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../../shared/utils/api";
import LatestPosts from "../../features/blog/components/LatestPosts";
import ContentLoader from "./ContentLoader";
import MainNav from "./MainNav";
import MainMenu from "./MainMenu";
import ScrollHintMouse from "./ScrollHintMouse";
import NotFoundContent from "./NotFoundContent";
import isValidUrl from "../../shared/utils/isValidUrl";
import homeBackground from "../../features/gallery/assets/home-background.jpg";
import errorImage from "../assets/image-error.svg";

function MainPage({ loggedIn, currentUser, handleSignout }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isPhotosLoading, setIsPhotosLoading] = useState(true);
  const [hasPostsError, setHasPostsError] = useState(false);
  const [hasPhotosError, setHasPhotosError] = useState(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    api
      .getPosts(1, 4)
      .then(({ data }) => {
        if (isMounted) {
          setPosts(data);
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setHasPostsError(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsPostsLoading(false);
        }
      });

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

  function handleLogout() {
    setIsMainMenuOpen(false);
    handleSignout(currentUser.email);
  }

  function handleScrollHintClick() {
    document.getElementById("photos")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="main-page">
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

      <main className="main-page__content">
        <section className="main-page__section" id="photos">
          <div className="main-page__section-heading">
            <h2 className="main-page__section-title">Latest Photos</h2>
            <Link className="main-page__view-all" to="/gallery">
              View all <span aria-hidden="true">&#8594;</span>
            </Link>
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

                  return (
                    <li className="main-page__photo" key={photo._id}>
                      <button
                        className="main-page__photo-button"
                        type="button"
                        onClick={() => navigate("/gallery")}
                        aria-label={`Open photo ${photo.hashtags}`}
                      >
                        <img
                          className="main-page__photo-image"
                          src={imageSrc}
                          alt={photo.hashtags}
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
                      <p className="main-page__photo-hashtags">
                        {photo.hashtags}
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
            loggedIn={false}
            posts={hasPostsError ? [] : posts}
            postsQuantity={4}
            isThereMoreContent
            onPostClick={handlePostClick}
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
      />
    </div>
  );
}

export default MainPage;
