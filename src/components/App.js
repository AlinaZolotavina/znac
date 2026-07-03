import React, { useState, useEffect, useRef } from "react";

import useAuth from "../hooks/useAuth";
import useRequestState from "../hooks/useRequestStatus";
import usePhotos from "../hooks/usePhotos.js";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Home from "./Home";
import Main from "./Main";
import Footer from "./Footer";
import PhotoPopup from "./PhotoPopup";
import DeletePhotoModal from "./DeletePhotoModal";
import ProtectedRoute from "./ProtectedRoute";
import SignIn from "./SignIn";
import Profile from "./Profile";
import ForgotPassword from "./ForgotPassword";
import AddPhoto from "./AddPhoto";
import EditEmailModal from "./EditEmailModal";
import EditPasswordModal from "./EditPasswordModal";
import Menu from "./Menu";
import Modal from "./Modal";
import ConfirmEmailUpdate from "./ConfirmEmailUpdate";
import api from "../utils/api";
import scrollToRef from "../utils/scrollToRef";
import * as auth from "../utils/auth.js";

import { Switch, Route, useLocation, useHistory } from "react-router-dom";

import {
  LARGE_SCREEN_WIDTH,
  MIDDLE_SCREEN_WIDTH,
  LARGE_SCREEN_PHOTOS_NUMBER,
  LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  MIDDLE_SCREEN_PHOTOS_NUMBER,
  MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
  SMALL_SCREEN_PHOTOS_NUMBER,
  SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
} from "../utils/constants";
import * as messages from "../utils/messages";

import ResetPassword from "./ResetPassword";
import PasswordChanged from "./PasswordChanged";
import NotFound from "./NotFound";

import BlogMainPage from "./blog/BlogMainPage.js";
import PostsPage from "./blog/PostsPage.js";
import ProjectsPage from "./blog/ProjectsPage.js";
import AboutPage from "./blog/AboutPage.js";
import BlogMenu from "./blog/BlogMenu.js";
import GetInTouchPopup from "./blog/GetInTouchPopup.js";
import NewProjectPopup from "./blog/NewProjectPopup.js";
import NewPostPopup from "./blog/NewPostPopup.js";
import EditPostPopup from "./blog/EditPostPopup.js";
import EditProjectPopup from "./blog/EditProjectPopup.js";
import DeletePostModal from "./blog/DeletePostModal.js";
import DeleteProjectModal from "./blog/DeleteProjectModal.js";

import getCurrentActivePage from "../utils/getCurrentActivePage.js";

import CurrentPostPage from "./blog/CurrentPostPage.js";
import GamesPage from "./blog/GamesPage.js";

function App() {
  const { isLoading, startLoading, stopLoading } = useRequestState();
  const {
    isLoading: isContactSending,
    startLoading: startContactSending,
    stopLoading: stopContactSending,
  } = useRequestState();

  const openModal = ({ status, message, type = "default" }) => {
    setModalState({
      isOpen: true,
      status,
      type,
      message,
    });
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      status: null,
      type: "default",
      message: "",
    });
  };

  // history & location
  const history = useHistory();
  const location = useLocation();
  const isAlinaRoute = location.pathname.startsWith("/alina");

  // everything related to photos (including screen width, on which depends the photos to render count)
  const [allPhotos, setAllPhotos] = useState([]);
  const [photosToRender, setPhotosToRender] = useState([]);
  const [loadedPhotos, setLoadedPhotos] = useState([]);
  const [visibleLoadedPhotosCount, setVisibleLoadedPhotosCount] = useState(0);
  const [photosToAdd, setPhotosToAdd] = useState(0);
  const [photosPage, setPhotosPage] = useState(1);
  const [photosPages, setPhotosPages] = useState(1);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [currentPhotosNumber, setCurrentPhotosNumber] = useState(0);
  const hasMorePhotos =
    currentPhotosNumber < allPhotos.length || photosPage < photosPages;

  // popups & modals
  const [isPhotoPopupOpen, setIsPhotoPopupOpen] = useState(false);
  const [isEditEmailModalOpen, setIsEditEmailModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [isDeletePhotoModalOpen, setIsDeletePhotoModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    status: null, // 'success' | 'error' | null
    type: "default", // 'default' | 'email'
    message: "",
  });
  const [hashtag, setHashtag] = useState(""); // search input
  const [lastHashtags, setLastHashtags] = useState([]);

  const [isBlogMenuOpen, setIsBlogMenuOpen] = useState(false);
  const [isGetInTouchPopupOpen, setIsGetInTouchPopupOpen] = useState(false);
  const [isPostPopupOpen, setIsPostPopupOpen] = useState(false);
  const [isEditPostPopupOpen, setIsEditPostPopupOpen] = useState(false);
  const [isEditProjectPopupOpen, setIsEditProjectPopupOpen] = useState(false);
  const [isNewProjectPopupOpen, setIsNewProjectPopupOpen] = useState(false);
  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);
  const [query, setQuery] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [postsToRender, setPostsToRender] = useState([]);
  const [currentPostsNumber, setCurrentPostsNumber] = useState(3);
  const [postsToAdd, setPostsToAdd] = useState(0);
  const [postsPage, setPostsPage] = useState(1);
  const [postsPages, setPostsPages] = useState(1);
  const hasMorePosts =
    currentPostsNumber < allPosts.length || postsPage < postsPages;
  const [postToEdit, setPostToEdit] = useState({});
  const [postToDelete, setPostToDelete] = useState({});
  const [postVersion, setPostVersion] = useState(0);
  const [redirectAfterDelete, setRedirectAfterDelete] = useState(false);

  const [allProjects, setAllProjects] = useState([]);
  const [loadedProjects, setLoadedProjects] = useState([]);
  const [projectsToRender, setProjectsToRender] = useState([]);
  const [currentProjectsNumber, setCurrentProjectsNumber] = useState(2);
  const [visibleLoadedProjectsCount, setVisibleLoadedProjectsCount] =
    useState(0);
  const [projectsToAdd, setProjectsToAdd] = useState(0);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsPages, setProjectsPages] = useState(1);
  const hasMoreProjects =
    currentProjectsNumber < allProjects.length || projectsPage < projectsPages;
  const [projectToEdit, setProjectToEdit] = useState({});
  const [projectToDelete, setProjectToDelete] = useState({});

  const [projectHashtags, setProjectHashtags] = useState([]);
  const [activePostHashtag, setActivePostHashtag] = useState("All");
  const [activeProjectHashtag, setActiveProjectHashtag] = useState("All");
  const [activeBlogPage, setActiveBlogPage] = useState("Home");

  useEffect(() => {
    if (loadedPhotos.length > 0) {
      return;
    }
    loadPhotos({
      page: 1,
      append: false,
      hashtag: "",
    });
  }, [loadedPhotos.length]);

  useEffect(() => {
    if (lastHashtags.length > 0) {
      return;
    }
    api
      .getHashtags(1, 10)
      .then((response) => {
        setLastHashtags(response.data);
      })
      .catch(console.error);
  }, [lastHashtags.length]);

  useEffect(() => {
    setPhotosToRender(allPhotos.slice(0, currentPhotosNumber));
  }, [allPhotos, currentPhotosNumber]);

  useEffect(() => {
    if (!isAlinaRoute || allPosts.length > 0) {
      return;
    }
    loadPosts();
  }, [isAlinaRoute, loadedPosts.length]);

  useEffect(() => {
    setPostsToRender(allPosts.slice(0, currentPostsNumber));
  }, [allPosts, currentPostsNumber]);

  useEffect(() => {
    if (!isAlinaRoute || loadedProjects.length > 0) {
      return;
    }
    loadProjects({
      page: 1,
      append: false,
      hashtag: "",
    });
  }, [isAlinaRoute, loadedProjects.length]);

  useEffect(() => {
    setProjectsToRender(allProjects.slice(0, currentProjectsNumber));
  }, [allProjects, currentProjectsNumber]);

  useEffect(() => {
    if (!isAlinaRoute || projectHashtags.length > 0) {
      return;
    }
    api
      .getProjectHashtags()
      .then((hashtags) => {
        setProjectHashtags(hashtags);
      })
      .catch(console.error);
  }, [isAlinaRoute, projectHashtags.length]);

  // calculate photos count depending on screen demensions
  // (including when changing the screen resolution)
  useEffect(() => {
    window.addEventListener("resize", updateDemensions);
    return () => window.removeEventListener("resize", updateDemensions);
  }, []);

  useEffect(() => {
    calculatePhotosCount();
    calculatePostsCount();
    calculateProjectsCount();
  }, [screenWidth]);

  const updateDemensions = () => {
    let resizeTimeout;
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function () {
        resizeTimeout = null;
        setScreenWidth(window.innerWidth);
      }, 150);
    }
  };

  const getPhotosLayout = () => {
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      return {
        initialPhotosNumber: LARGE_SCREEN_PHOTOS_NUMBER,
        photosToAdd: LARGE_SCREEN_PHOTOS_TO_ADD_NUMBER,
      };
    }

    if (screenWidth >= MIDDLE_SCREEN_WIDTH) {
      return {
        initialPhotosNumber: MIDDLE_SCREEN_PHOTOS_NUMBER,
        photosToAdd: MIDDLE_SCREEN_PHOTOS_TO_ADD_NUMBER,
      };
    }

    return {
      initialPhotosNumber: SMALL_SCREEN_PHOTOS_NUMBER,
      photosToAdd: SMALL_SCREEN_PHOTOS_TO_ADD_NUMBER,
    };
  };

  const calculatePhotosCount = () => {
    const { initialPhotosNumber, photosToAdd: nextPhotosToAdd } =
      getPhotosLayout();
    setPhotosToAdd(nextPhotosToAdd);
    setCurrentPhotosNumber((current) => Math.max(current, initialPhotosNumber));
  };

  const calculatePostsCount = () => {
    let initialPostsNumber;
    let nextPostsToAdd;
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      initialPostsNumber = 6;
      nextPostsToAdd = 4;
    } else if (screenWidth >= MIDDLE_SCREEN_WIDTH) {
      initialPostsNumber = 3;
      nextPostsToAdd = 3;
    } else {
      initialPostsNumber = 3;
      nextPostsToAdd = 2;
    }
    setPostsToAdd(nextPostsToAdd);
    setCurrentPostsNumber((current) => Math.max(current, initialPostsNumber));
  };

  const getProjectsLayout = () => {
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      return {
        initialProjectsNumber: 9,
        projectsToAdd: 3,
      };
    }

    if (screenWidth >= MIDDLE_SCREEN_WIDTH) {
      return {
        initialProjectsNumber: 4,
        projectsToAdd: 2,
      };
    }

    return {
      initialProjectsNumber: 2,
      projectsToAdd: 2,
    };
  };

  const calculateProjectsCount = () => {
    const { initialProjectsNumber, projectsToAdd } = getProjectsLayout();
    setProjectsToAdd(projectsToAdd);
    setCurrentProjectsNumber((current) =>
      Math.max(current, initialProjectsNumber),
    );
  };

  function loadPhotos({ page = 1, append = false, hashtag = "" } = {}) {
    const normalizedHashtag = hashtag.trim().toLowerCase();
    const hasFilter = Boolean(normalizedHashtag);

    const request = hasFilter
      ? api.findPhoto(normalizedHashtag, page, 20)
      : api.getPhotos(page, 20);

    return request
      .then((response) => {
        const { data, page: responsePage, pages } = response;
        setAllPhotos((previousPhotos) =>
          append ? [...previousPhotos, ...data] : data,
        );
        // Кэшируем только обычную галерею
        if (!hasFilter) {
          setLoadedPhotos((previousPhotos) =>
            append ? [...previousPhotos, ...data] : data,
          );
        }
        setPhotosPage(responsePage);
        setPhotosPages(pages);

        if (!append) {
          const { initialPhotosNumber } = getPhotosLayout();
          const visibleCount = Math.min(initialPhotosNumber, data.length);
          setCurrentPhotosNumber(visibleCount);
          if (!hasFilter) {
            setVisibleLoadedPhotosCount(visibleCount);
          }
        }

        return response;
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DEFAULT_ERROR_MSG,
        });

        throw err;
      });
  }

  function showMorePhotos() {
    const nextVisibleCount = currentPhotosNumber + photosToAdd;
    const isFiltered = Boolean(hashtag.trim());

    if (nextVisibleCount <= allPhotos.length) {
      setCurrentPhotosNumber(nextVisibleCount);
      if (!isFiltered) {
        setVisibleLoadedPhotosCount(nextVisibleCount);
      }
      return;
    }

    if (photosPage >= photosPages) {
      setCurrentPhotosNumber(allPhotos.length);
      if (!isFiltered) {
        setVisibleLoadedPhotosCount(allPhotos.length);
      }
      return;
    }

    loadPhotos({
      page: photosPage + 1,
      append: true,
      hashtag,
    })
      .then((response) => {
        const nextCount = Math.min(
          nextVisibleCount,
          allPhotos.length + response.data.length,
        );
        setCurrentPhotosNumber(nextCount);
        if (!isFiltered) {
          setVisibleLoadedPhotosCount(nextCount);
        }
      })
      .catch(console.error);
  }

  function loadProjects({ page = 1, append = false, hashtag = "" } = {}) {
    const normalizedHashtag = hashtag === "All" ? "" : hashtag.trim();
    const hasFilter = Boolean(normalizedHashtag);
    return api
      .getProjects(page, 12, {
        hashtag: normalizedHashtag,
      })
      .then((response) => {
        const { data, page: responsePage, pages } = response;
        setAllProjects((previousProjects) =>
          append ? [...previousProjects, ...data] : data,
        );

        if (!hasFilter) {
          setLoadedProjects((previousProjects) =>
            append ? [...previousProjects, ...data] : data,
          );
        }
        setProjectsPage(responsePage);
        setProjectsPages(pages);

        if (!append) {
          const { initialProjectsNumber } = getProjectsLayout();
          const visibleCount = Math.min(initialProjectsNumber, data.length);
          setCurrentProjectsNumber(visibleCount);
          if (!hasFilter) {
            setVisibleLoadedProjectsCount(visibleCount);
          }
        }

        return response;
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DEFAULT_ERROR_MSG,
        });

        throw err;
      });
  }

  function showMoreProjects() {
    const nextVisibleCount = currentProjectsNumber + projectsToAdd;

    if (nextVisibleCount <= allProjects.length) {
      setCurrentProjectsNumber(nextVisibleCount);
      if (!activeProjectHashtag) {
        setVisibleLoadedProjectsCount(nextVisibleCount);
      }
      return;
    }

    if (projectsPage >= projectsPages) {
      setCurrentProjectsNumber(allProjects.length);
      if (!activeProjectHashtag) {
        setVisibleLoadedProjectsCount(allProjects.length);
      }
      return;
    }

    loadProjects({
      page: projectsPage + 1,
      append: true,
      hashtag: activeProjectHashtag,
    }).then(() => {
      setCurrentProjectsNumber((current) =>
        Math.min(current + projectsToAdd, allProjects.length),
      );
      if (!activeProjectHashtag) {
        setVisibleLoadedProjectsCount(allProjects.length);
      }
    });
  }

  function loadPosts({
    page = 1,
    append = false,
    search = "",
    theme = "All",
  } = {}) {
    const normalizedSearch = search.trim();
    const hasSearch = Boolean(normalizedSearch);
    const hasThemeFilter = theme && theme !== "All";
    const hasFilters = hasSearch || hasThemeFilter;

    return api
      .getPosts(page, 8, {
        search: normalizedSearch,
        theme,
      })
      .then((response) => {
        const { data, page: responsePage, pages } = response;

        // The current list is standard or filtering results
        setAllPosts((previousPosts) =>
          append ? [...previousPosts, ...data] : data,
        );

        // Update the source list cache only there are no filters
        if (!hasFilters) {
          setLoadedPosts((previousPosts) =>
            append ? [...previousPosts, ...data] : data,
          );
        }

        setPostsPage(responsePage);
        setPostsPages(pages);

        // For a new set of results (search / theme), use an adaptive initial quantity
        if (!append) {
          setCurrentPostsNumber((current) => Math.max(current, 3));
        }

        return response;
      })
      .catch(console.error);
  }

  function showMorePosts() {
    const nextVisibleCount = currentPostsNumber + postsToAdd;

    if (nextVisibleCount <= allPosts.length) {
      setCurrentPostsNumber(nextVisibleCount);
      return;
    }

    if (postsPage >= postsPages) {
      setCurrentPostsNumber(allPosts.length);
      return;
    }

    loadPosts({
      page: postsPage + 1,
      append: true,
      search: query,
      theme: activePostHashtag,
    }).then(() => {
      setCurrentPostsNumber((current) =>
        Math.min(current + postsToAdd, allPosts.length),
      );
    });
  }

  // password reset
  function handleReceiveResetPasswordLink(email) {
    startLoading();
    auth
      .forgotPassword(email)
      .then(() => {
        openModal({
          status: "success",
          type: "email",
          message: messages.RESET_PASSWORD_EMAIL_SENT_MSG,
        });
      })
      .then(() => history.push("/"))
      .catch(() => {
        openModal({
          status: "error",
          message: messages.DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  function handleResetPassword(
    newPassword,
    confirmPassword,
    resetPasswordLink,
  ) {
    startLoading();
    auth
      .resetPassword(newPassword, confirmPassword, resetPasswordLink)
      .then(() => {
        history.push("/password-changed");
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  // e-mail change
  function handleEditEmailBtnClick() {
    setIsEditEmailModalOpen(!isEditEmailModalOpen);
  }

  function handleEmailChangeRequest(newEmail) {
    startLoading();
    localStorage.setItem("email", JSON.stringify(newEmail));
    api
      .requestEmailUpdate(newEmail.email, currentUser.email)
      .then(() => {
        openModal({
          status: "success",
          message: messages.UPDATE_EMAIL_EMAIL_SENT_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.EMAIL_UPDATE_REQUEST_ERROR_MSG,
        });
      })
      .finally(() => stopLoading());
  }

  function handleUpdateEmail(updateEmailLink, newEmail) {
    api
      .updateEmail(updateEmailLink, newEmail)
      .then((data) => {
        updateUser(data.user);
        history.push("/profile");
        openModal({
          status: "success",
          message: messages.EMAIL_UPDATED_SUCCESSFULLY_MSG,
        });
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.EMAIL_UPDATE_ERROR_MSG,
        });
      });
  }

  async function handlePhotoUpload(photoData, hashtags, views) {
    startLoading();

    try {
      const addedPhotos = [];

      for (const file of photoData) {
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

        const newPhoto = await api.addPhoto(photoDataToSave);

        addedPhotos.push(newPhoto);
      }

      setAllPhotos((prev) => [...addedPhotos, ...prev]);

      setPhotosToRender((prev) => [...addedPhotos, ...prev]);

      openModal({
        status: "success",
        message:
          addedPhotos.length === 1
            ? messages.PHOTO_ADDED_SUCCESSFULLY_MSG
            : messages.PHOTOS_ADDED_SUCCESSFULLY_MSG(addedPhotos.length),
      });

      return addedPhotos;
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: messages.DEFAULT_ERROR_MSG,
      });

      throw err;
    } finally {
      stopLoading();
    }
  }

  /////// NEW PHOTO LOGIC
  const {
    selectedPhoto,
    setSelectedPhoto,
    hashtagsOfSelectedPhoto,
    viewsOfSelectedPhoto,
    areHashtagsEditing,
    setAreHashtagsEditing,
    handleEditHashtags,
    isLeftFlipDisabled,
    isRightFlipDisabled,
    handlePhotoClick,
    handlePhotoFlip,
    handleAddPhotoViaLink,
    handlePhotoDelete,
  } = usePhotos({
    openModal,
    startLoading,
    stopLoading,
    closeAllPopups,
    setAllPhotos,
    allPhotos,
    setPhotosToRender,
  });

  // open photo popup
  const handlePhotoOpen = (photo) => {
    console.log("Selected photo:", photo);
    handlePhotoClick(photo);
    setIsPhotoPopupOpen(true);
  };
  // delete photo
  const handleDeletePhotoModalOpen = (photo) => {
    setSelectedPhoto(photo); // или selectPhoto
    setIsDeletePhotoModalOpen(true);
  };

  // edit photo hashtags
  function handleEditHashtagsBtnClick() {
    setAreHashtagsEditing(!areHashtagsEditing);
  }

  // handle app navigation & mark active navigation block / page
  const homeRef = useRef(null);
  const mainRef = useRef(null);
  const footerRef = useRef(null);

  function handleHomeClick() {
    history.push("/");

    requestAnimationFrame(() => {
      scrollToRef(homeRef);
    });
  }

  function handleGalleryClick() {
    scrollToRef(mainRef);
  }

  function handleContactClick() {
    scrollToRef(footerRef);
  }

  function handleProfileClick() {
    closeMenu();
    history.push("/profile");
  }

  function handleAddPhotoClick() {
    closeMenu();
    history.push("/addphoto");
  }

  function handleEditPasswordBtnClick() {
    setIsEditPasswordModalOpen(!isEditPasswordModalOpen);
  }

  function handleMenuClick(e) {
    setIsMenuOpen(!isMenuOpen);
    e.target.blur();
  }

  // close popups and modals by close btn, ESC and overlay click;
  // flip photos by keyboard arrows;
  // close menu;
  const handleKeyPress = (e) => {
    const { keyCode } = e;
    if (keyCode === 27) {
      closeAllPopups();
      closeAllBlogPopups();
      closeMenu();
      closeBlogMenu();
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
  };

  const handleOverlayClickClose = (e) => {
    if (
      e.target.classList.contains("popup_is-opened") ||
      e.target.classList.contains("popup__close-btn")
    ) {
      closeAllPopups();
      closeAllBlogPopups();
    }
  };

  useEffect(
    (e) => {
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("mousedown", handleOverlayClickClose);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
        window.removeEventListener("mousedown", handleOverlayClickClose);
      };
    },
    [
      photosToRender,
      selectedPhoto,
      isLeftFlipDisabled,
      isRightFlipDisabled,
      isPhotoPopupOpen,
      isDeletePhotoModalOpen,
    ],
  );

  function closeAllPopups() {
    setIsPhotoPopupOpen(false);
    setIsDeletePhotoModalOpen(false);
    setIsEditEmailModalOpen(false);
    setIsEditPasswordModalOpen(false);
    // setIsModalOpen(false);
    closeModal();
    // setIsEmailSentModalOpen(false);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  // handle photo search (also by hashtag's click)
  useEffect(() => {
    setHashtag("");
  }, [location.pathname]);

  function checkUniqueness(hashtag, hashtags) {
    return !hashtags.some((item) => item.name === hashtag);
  }

  function handlePhotoSearch(nextValue) {
    const normalizedHashtag = nextValue.trim().toLowerCase();

    setHashtag(nextValue);

    // Поиск очищен: возвращаем нефильтрованный кэш без нового запроса.
    if (!normalizedHashtag) {
      const { initialPhotosNumber } = getPhotosLayout();

      const restoredVisibleCount = Math.min(
        visibleLoadedPhotosCount || initialPhotosNumber,
        loadedPhotos.length,
      );

      setAllPhotos(loadedPhotos);
      setPhotosPage(1);
      setPhotosPages(Math.max(1, Math.ceil(loadedPhotos.length / 20)));
      setCurrentPhotosNumber(restoredVisibleCount);

      return;
    }

    loadPhotos({
      page: 1,
      append: false,
      hashtag: normalizedHashtag,
    })
      .then((response) => {
        if (response.data.length === 0) {
          return;
        }

        const isHashtagUniq = checkUniqueness(normalizedHashtag, lastHashtags);

        if (isHashtagUniq) {
          return api.addHashtag(normalizedHashtag).then((data) => {
            setLastHashtags((prev) => [
              {
                name: data.name,
                _id: data._id,
                __v: data.__v,
                createdAt: data.createdAt,
              },
              ...prev,
            ]);
          });
        }

        return api.updateHashtag(normalizedHashtag).then((data) => {
          setLastHashtags((prev) => [
            {
              name: data.name,
              _id: data._id,
              __v: data.__v,
              createdAt: data.createdAt,
            },
            ...prev.filter((h) => h.name !== normalizedHashtag),
          ]);
        });
      })
      .catch(console.error);
  }

  function handleClearPhotoSearch() {
    const { initialPhotosNumber } = getPhotosLayout();

    const restoredVisibleCount = Math.min(
      visibleLoadedPhotosCount || initialPhotosNumber,
      loadedPhotos.length,
    );

    setHashtag("");
    setAllPhotos(loadedPhotos);
    setPhotosPage(1);
    setPhotosPages(Math.max(1, Math.ceil(loadedPhotos.length / 20)));
    setCurrentPhotosNumber(restoredVisibleCount);
  }

  function handlePhotoHashtagClick(nextHashtag) {
    closeAllPopups();
    handlePhotoSearch(nextHashtag);
  }

  ////////////////////////////  BLOG  ///////////////////////////////////////

  function viewAllPostsClick() {
    history.push("./alina/posts");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function viewAllProjectsClick() {
    history.push("./alina/projects");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleNewPostPopupOpen() {
    setIsPostPopupOpen(true);
  }

  function handleEditPostPopupOpen(post) {
    setIsEditPostPopupOpen(true);
    setPostToEdit(post);
  }

  function handleNewProjectPopupOpen() {
    setIsNewProjectPopupOpen(true);
  }

  function handleEditProjectPopupOpen(project) {
    setIsEditProjectPopupOpen(true);
    setProjectToEdit(project);
  }

  function handleBlogContactClick() {
    setIsGetInTouchPopupOpen(true);
  }

  function closeAllBlogPopups() {
    setIsPostPopupOpen(false);
    setIsEditPostPopupOpen(false);
    setIsEditProjectPopupOpen(false);
    setIsNewProjectPopupOpen(false);
    setIsDeletePostModalOpen(false);
    setIsDeleteProjectModalOpen(false);
    setRedirectAfterDelete(false);
  }

  const closeGetInTouchPopup = () => {
    setIsGetInTouchPopupOpen(false);
  };

  function handleBlogMenuClick(e) {
    setIsBlogMenuOpen(!isBlogMenuOpen);
    e.target.blur();
  }

  function closeBlogMenu() {
    setIsBlogMenuOpen(false);
  }

  useEffect(() => {
    setQuery("");
    setActivePostHashtag("All");
    setActiveProjectHashtag("All");
  }, [location.pathname]);

  useEffect(() => {
    if ((query === "" || !query) && activePostHashtag === "All") {
      setPostsToRender(allPosts);
    } else if ((query === "" || !query) && activePostHashtag !== "All") {
      setPostsToRender(
        allPosts.filter((post) => post.theme === activePostHashtag),
      );
    }
  }, [query, activePostHashtag]);

  function handlePostsSearch(nextQuery) {
    const normalizedQuery = nextQuery.trim();
    const hasThemeFilter = activePostHashtag && activePostHashtag !== "All";

    setQuery(nextQuery);

    if (!normalizedQuery && !hasThemeFilter) {
      if (loadedPosts.length > 0) {
        setAllPosts(loadedPosts);
        setPostsPage(1);
        setPostsPages(Math.ceil(loadedPosts.length / 8));
        setCurrentPostsNumber(loadedPosts.length);
      } else {
        loadPosts({
          page: 1,
          search: "",
          theme: "All",
        });
      }

      return;
    }

    loadPosts({
      page: 1,
      search: normalizedQuery,
      theme: activePostHashtag,
    });
  }

  function handleProjectHashtagClick(hashtag) {
    const isAll = hashtag === "All";
    const isSameHashtag = activeProjectHashtag === hashtag;

    const nextHashtag = isAll || isSameHashtag ? "" : hashtag;

    setActiveProjectHashtag(nextHashtag);

    if (!nextHashtag) {
      const { initialProjectsNumber } = getProjectsLayout();

      const restoredVisibleCount = Math.min(
        visibleLoadedProjectsCount || initialProjectsNumber,
        loadedProjects.length,
      );

      setAllProjects(loadedProjects);
      setProjectsPage(1);
      setProjectsPages(Math.max(1, Math.ceil(loadedProjects.length / 12)));
      setCurrentProjectsNumber(restoredVisibleCount);

      return;
    }

    loadProjects({
      page: 1,
      append: false,
      hashtag: nextHashtag,
    });
  }

  function handlePostHashtagClick(theme) {
    setActivePostHashtag(theme);
    loadPosts({
      page: 1,
      search: query,
      theme,
    });
  }

  function handleAddProject(newProject) {
    startLoading();
    api
      .addProject(newProject)
      .then((createdProject) => {
        openModal({
          status: "success",
          message: messages.PROJECT_ADDED_SUCCESSFULLY_MSG,
        });
        setAllProjects((prev) => [createdProject, ...prev]);
        setProjectsToRender((prev) => [createdProject, ...prev]);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.PROJECT_ADD_ERROR_MSG,
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  function handleEditProject(projectId, props) {
    startLoading();
    const data = {
      title: props.title,
      hashtags: props.hashtags,
      text: props.text,
      link: props.link,
    };
    api
      .editProject(projectId, data)
      .then((newProject) => {
        openModal({
          status: "success",
          message: messages.PROJECT_EDITED_SUCCESSFULLY_MSG,
        });
        setAllProjects((state) =>
          state.map((p) => (p._id === projectId ? newProject : p)),
        );
        setProjectsToRender((state) =>
          state.map((p) => (p._id === projectId ? newProject : p)),
        );
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.PROJECT_EDIT_ERROR_MSG,
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  async function handleAddPost(props) {
    startLoading();

    try {
      const addedPosts = [];

      const createPost = async (photoData = {}) => {
        const data = {
          theme: props.theme,
          icon: props.icon,
          title: props.title,
          hashtags: props.hashtags,
          text: props.text,
          ...photoData,
        };

        const newPost = await api.addPost(data);

        addedPosts.push(newPost);
      };

      if (props.photoData[0]?.length) {
        for (const file of props.photoData[0]) {
          const formData = new FormData();
          formData.append("images", file);

          const response = await api.uploadPhoto(formData, "/posts/image");

          const [{ filename }] = response.data;

          await createPost({
            photoFilename: filename,
          });
        }
      } else {
        await createPost();
      }

      setAllPosts((prev) => [...addedPosts, ...prev]);
      setPostsToRender((prev) => [...addedPosts, ...prev]);

      openModal({
        status: "success",
        message:
          addedPosts.length === 1
            ? messages.POST_ADDED_SUCCESSFULLY_MSG
            : `${addedPosts.length} posts were added successfully`,
      });

      closeAllBlogPopups();
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: err.message || messages.POST_ADD_ERROR_MSG,
      });
    } finally {
      stopLoading();
    }
  }

  function handleEditPost(postId, props) {
    startLoading();

    const updatePost = (photoData = {}) => {
      const data = {
        theme: props.theme,
        icon: props.icon,
        title: props.title,
        hashtags: props.hashtags,
        text: props.text,
        ...photoData,
      };

      if (props.removePhoto && !data.newPhotoFilename && !data.newPhotoLink) {
        data.removePhoto = true;
      }

      return api.editPost(postId, data);
    };

    const request = props.photoData[0]?.length
      ? (() => {
          const formData = new FormData();
          formData.append("images", props.photoData[0][0]);

          return api.uploadPhoto(formData, "/posts/image").then((response) =>
            updatePost({
              newPhotoFilename: response.data[0].filename,
            }),
          );
        })()
      : updatePost();

    request
      .then((updatedPost) => {
        setAllPosts((prev) =>
          prev.map((p) => (p._id === postId ? updatedPost : p)),
        );

        setPostsToRender((prev) =>
          prev.map((p) => (p._id === postId ? updatedPost : p)),
        );

        setPostVersion((v) => v + 1);

        openModal({
          status: "success",
          message: messages.POST_EDITED_SUCCESSFULLY_MSG,
        });
      })
      .catch((err) => {
        console.error(err);

        openModal({
          status: "error",
          message: err.message || messages.POST_EDIT_ERROR_MSG,
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  function handleDeletePostModalOpen(post, shouldRedirect = false) {
    setPostToDelete(post);
    setRedirectAfterDelete(shouldRedirect);
    setIsDeletePostModalOpen(true);
  }

  function handlePostDelete(post) {
    api
      .deletePost(post._id)
      .then(() => {
        setPostsToRender((state) =>
          state.filter((p) => p._id !== post._id && p),
        );
        setAllPosts((state) => state.filter((p) => p._id !== post._id && p));
        if (redirectAfterDelete) {
          history.replace("/alina/posts");
        }
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => {
        closeAllBlogPopups();
      });
  }

  function handlePostClick(post) {
    history.push(`/alina/posts/${post._id}`);
  }

  function handleDeleteProjectModalOpen(project) {
    setIsDeleteProjectModalOpen(!isDeleteProjectModalOpen);
    setProjectToDelete(project);
  }

  function handleProjectDelete(project) {
    api
      .deleteProject(project._id)
      .then(() => {
        setProjectsToRender((state) =>
          state.filter((p) => p._id !== project._id && p),
        );
        setAllProjects((projects) =>
          projects.filter((p) => p._id !== project._id),
        );
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || messages.DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => closeAllBlogPopups());
  }

  useEffect(() => {
    const currentPage = getCurrentActivePage(location.pathname);
    if (currentPage === "alina") {
      setActiveBlogPage("Home");
    } else {
      setActiveBlogPage(currentPage);
    }
  }, [location.pathname]);

  function moveToHomePage() {
    history.push("/alina");
    closeBlogMenu();
  }
  function moveToPostsPage() {
    closeBlogMenu();
  }
  function moveToProjectsPage() {
    closeBlogMenu();
  }

  function moveToAboutPage() {
    closeBlogMenu();
  }
  function moveToPreviousPage() {
    history.goBack();
  }

  function handleBlogClick() {
    window.scrollTo(0, 0);
    closeMenu();
  }
  function handleGamesClick() {
    history.push("/alina/games");
  }

  function moveToTicTacToePage() {
    history.push("/alina/games/tic-tac-toe");
  }

  function handleMusicClick() {
    window.open(
      "https://open.spotify.com/playlist/6jhUvEAvi9laleDSaEenSK?si=m-_cgJDpRH-buMRqXpS6WA&pi=e-5IWoIJ-1TL-8",
      "_blank",
      "noopener,noreferrer",
    );
  }

  const handleSendContactMessage = ({ name, email, message }) => {
    startContactSending();

    return api
      .sendContactMessage({ name, email, message })
      .then(() => {
        setModalState({
          isOpen: true,
          status: "success",
          type: "default",
          message: messages.CONTACT_MESSAGE_SENT_MSG,
        });

        return true;
      })
      .catch((err) => {
        setModalState({
          isOpen: true,
          status: "error",
          type: "default",
          message: err.message || messages.CONTACT_MESSAGE_ERROR_MSG,
        });

        return false;
      })
      .finally(() => {
        stopContactSending();
      });
  };

  const { currentUser, loggedIn, handleSignin, handleSignout, updateUser } =
    useAuth({
      history,
      location,
      openModal,
      startLoading,
      stopLoading,
    });

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Switch>
        <Route exact path="/">
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
        </Route>

        <Route exact path="/alina">
          <BlogMainPage
            loggedIn={loggedIn}
            postsToRender={postsToRender}
            projectsToRender={projectsToRender}
            projectsQuantity={2}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onNewPostClick={handleNewPostPopupOpen}
            onNewProjectClick={handleNewProjectPopupOpen}
            onViewAllPostsClick={viewAllPostsClick}
            onViewAllProjectsClick={viewAllProjectsClick}
            onPostClick={handlePostClick}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            onEditProjectButtonClick={handleEditProjectPopupOpen}
            onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
            onHomeClick={moveToHomePage}
            onPostsClick={moveToPostsPage}
            onProjectsClick={moveToProjectsPage}
            onAboutClick={moveToAboutPage}
          />
        </Route>

        <Route exact path="/alina/posts">
          <PostsPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            postsToRender={postsToRender}
            onNewPostClick={handleNewPostPopupOpen}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onPostsSearch={handlePostsSearch}
            onPostClick={handlePostClick}
            hasMorePosts={hasMorePosts}
            postsQuantity={currentPostsNumber}
            onShowMorePosts={showMorePosts}
            isLoading={isLoading}
            query={query}
            querySetter={setQuery}
            onPostHashtagClick={handlePostHashtagClick}
            activeHashtag={activePostHashtag}
          />
        </Route>

        <Route exact path="/alina/posts/:id">
          <CurrentPostPage
            activePage="posts"
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onBackButtonClick={moveToPreviousPage}
            onEditPostButtonClick={handleEditPostPopupOpen}
            onDeletePostButtonClick={handleDeletePostModalOpen}
            loggedIn={loggedIn}
            postVersion={postVersion}
            openModal={openModal}
          />
        </Route>

        <Route exact path="/alina/projects">
          <ProjectsPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            hashtags={projectHashtags}
            activeProjectHashtag={activeProjectHashtag}
            projectsToRender={projectsToRender}
            hasMoreProjects={hasMoreProjects}
            onNewProjectClick={handleNewProjectPopupOpen}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            projectsQuantity={currentProjectsNumber}
            onShowMoreProjects={showMoreProjects}
            onEditProjectButtonClick={handleEditProjectPopupOpen}
            onDeleteProjectButtonClick={handleDeleteProjectModalOpen}
            onProjectHashtagClick={handleProjectHashtagClick}
          />
        </Route>

        <Route exact path="/alina/about">
          <AboutPage
            loggedIn={loggedIn}
            activePage={activeBlogPage}
            projectsToRender={projectsToRender}
            onBlogMenuClick={handleBlogMenuClick}
            onContactClick={handleBlogContactClick}
            onAddProjectClick={handleNewProjectPopupOpen}
            onGamesClick={handleGamesClick}
            onMusicClick={handleMusicClick}
          />
        </Route>

        <Route exact path="/alina/games">
          <GamesPage onTicTacToeClick={moveToTicTacToePage} />
        </Route>

        <Route exact path="/signin">
          <SignIn onSignin={handleSignin} isSendingReq={isLoading} />
        </Route>

        {/* New users registration is disabled*/}
        {/* <Route path="/signup">
          <SignUp onSignup={handleSignup} isSendingReq={isLoading} />
        </Route> */}

        <Route path="/signin/recovery">
          <ForgotPassword
            onReceiveEmail={handleReceiveResetPasswordLink}
            isSendingReq={isLoading}
          />
        </Route>

        <Route path="/reset-password/:resetPasswordLink">
          <ResetPassword
            onResetPassword={handleResetPassword}
            isSendingReq={isLoading}
          />
        </Route>

        <Route path="/password-changed">
          <PasswordChanged />
        </Route>

        <ProtectedRoute
          component={Profile}
          exact
          path="/profile"
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

        <ProtectedRoute
          component={ConfirmEmailUpdate}
          path="/profile/update-email/:updateEmailLink"
          loggedIn={loggedIn}
          onUpdateEmail={handleUpdateEmail}
        />

        <ProtectedRoute
          component={AddPhoto}
          path="/addphoto"
          loggedIn={loggedIn}
          onHomeClick={handleHomeClick}
          onBlogClick={handleBlogClick}
          nGalleryClick={handleGalleryClick}
          onContactClick={handleContactClick}
          onMenuClick={handleMenuClick}
          onSignout={handleSignout}
          isSendingReq={isLoading}
          onAddPhotoViaLink={handleAddPhotoViaLink}
          onUploadPhotoToServer={handlePhotoUpload}
          email={currentUser.email}
          onLogout={handleSignout}
        />

        <Route path="/*">
          <NotFound />
        </Route>
      </Switch>

      <PhotoPopup
        loggedIn={loggedIn}
        isOpen={isPhotoPopupOpen}
        photo={selectedPhoto}
        photoHashtags={hashtagsOfSelectedPhoto || []}
        views={viewsOfSelectedPhoto}
        onClose={closeAllPopups}
        onHashtagClick={handlePhotoHashtagClick}
        areHashtagsEditing={areHashtagsEditing}
        onEditHashtags={handleEditHashtags}
        isSendingReq={isLoading}
        onEditHashtagsBtnClick={handleEditHashtagsBtnClick}
        onPhotoFlip={handlePhotoFlip}
        isLeftFlipDisabled={isLeftFlipDisabled}
        isRightFlipDisabled={isRightFlipDisabled}
      />

      <EditEmailModal
        isOpen={isEditEmailModalOpen}
        onClose={closeAllPopups}
        isSendingReq={isLoading}
        onRequestEmailChange={handleEmailChangeRequest}
      />

      <EditPasswordModal
        isOpen={isEditPasswordModalOpen}
        onClose={closeAllPopups}
      />

      <DeletePhotoModal
        photo={selectedPhoto}
        isOpen={isDeletePhotoModalOpen}
        onClose={closeAllPopups}
        onDeletePhoto={handlePhotoDelete}
      />

      <Menu
        isOpen={isMenuOpen}
        loggedIn={loggedIn}
        onHomeClick={handleHomeClick}
        onProfileClick={handleProfileClick}
        onAddPhotoClick={handleAddPhotoClick}
        onGalleryClick={handleGalleryClick}
        onContactClick={handleContactClick}
        onBlogClick={handleBlogClick}
        onClose={closeMenu}
        onLogout={handleSignout}
      />

      <Modal
        isOpen={modalState.isOpen}
        status={modalState.status}
        type={modalState.type}
        onClose={closeAllPopups}
        message={modalState.message}
      />

      <BlogMenu
        isOpen={isBlogMenuOpen}
        activeBlogPage={activeBlogPage}
        onHomeClick={moveToHomePage}
        onPostsClick={moveToPostsPage}
        onProjectsClick={moveToProjectsPage}
        onAboutClick={moveToAboutPage}
        onClose={closeBlogMenu}
      />

      <GetInTouchPopup
        isOpen={isGetInTouchPopupOpen}
        isSendingReq={isContactSending}
        onClose={closeGetInTouchPopup}
        onSubmit={handleSendContactMessage}
      />

      <NewProjectPopup
        isOpen={isNewProjectPopupOpen}
        onClose={closeAllBlogPopups}
        onAddProject={handleAddProject}
        isSendingReq={isLoading}
      />

      <NewPostPopup
        isOpen={isPostPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
        onAddPost={handleAddPost}
      />

      <EditPostPopup
        isOpen={isEditPostPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
        post={postToEdit}
        onEditPost={handleEditPost}
      />
      <EditProjectPopup
        isOpen={isEditProjectPopupOpen}
        onClose={closeAllBlogPopups}
        isSendingReq={isLoading}
        project={projectToEdit}
        onEditProject={handleEditProject}
      />

      <DeletePostModal
        post={postToDelete}
        isOpen={isDeletePostModalOpen}
        onClose={closeAllBlogPopups}
        onDeletePost={handlePostDelete}
      />

      <DeleteProjectModal
        project={projectToDelete}
        isOpen={isDeleteProjectModalOpen}
        onClose={closeAllBlogPopups}
        onDeleteProject={handleProjectDelete}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
