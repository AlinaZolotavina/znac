import { useState, useEffect } from "react";
import api from "../../../shared/utils/api";
import * as messages from "../../../shared/utils/messages";
import postUploadActions from "../utils/postUploadActions";
import {
  LARGE_SCREEN_WIDTH,
  MIDDLE_SCREEN_WIDTH,
} from "../../../shared/utils/constants";
import { useNavigate } from "react-router-dom";

export default function usePosts({
  screenWidth,
  isAlinaRoute,
  query,
  setQuery,
  activePostHashtag,
  setActivePostHashtag,
  startLoading,
  stopLoading,
  openModal,
  closeAllBlogPopups,
  setIsEditPostPopupOpen,
  setIsDeletePostModalOpen,
  setRedirectAfterDelete,
  redirectAfterDelete,
}) {
  const navigate = useNavigate();
  const [allPosts, setAllPosts] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [postsToRender, setPostsToRender] = useState([]);
  const [currentPostsNumber, setCurrentPostsNumber] = useState(3);

  const [postsToAdd, setPostsToAdd] = useState(0);
  const [postsPage, setPostsPage] = useState(1);
  const [postsPages, setPostsPages] = useState(1);
  const [postToEdit, setPostToEdit] = useState({});
  const [postToDelete, setPostToDelete] = useState({});
  const [postVersion, setPostVersion] = useState(0);

  const hasMorePosts =
    currentPostsNumber < allPosts.length || postsPage < postsPages;

  const { handlePostUpload } = postUploadActions({
    startLoading,
    stopLoading,
    prependPosts,
    openModal,
    closeAllBlogPopups,
  });

  useEffect(() => {
    setPostsToRender(allPosts.slice(0, currentPostsNumber));
  }, [allPosts, currentPostsNumber]);

  useEffect(() => {
    if (!isAlinaRoute || allPosts.length > 0) {
      return;
    }
    loadPosts();
  }, [isAlinaRoute, loadedPosts.length]);

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

  function prependPosts(newPosts) {
    setAllPosts((posts) => [...newPosts, ...posts]);
    setPostsToRender((posts) => [...newPosts, ...posts]);
  }

  function replacePost(updatedPost) {
    setAllPosts((posts) =>
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
    );

    setPostsToRender((posts) =>
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
    );
  }

  function removePost(postId) {
    setAllPosts((posts) => posts.filter((post) => post._id !== postId));

    setPostsToRender((posts) => posts.filter((post) => post._id !== postId));
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

  function handlePostHashtagClick(theme) {
    setActivePostHashtag(theme);
    loadPosts({
      page: 1,
      search: query,
      theme,
    });
  }

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

  function handleEditPostPopupOpen(post) {
    setIsEditPostPopupOpen(true);
    setPostToEdit(post);
  }

  function createPostUpdateRequest(postId, props, photoData = {}) {
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
  }

  async function uploadPostImage(file) {
    const formData = new FormData();
    formData.append("images", file);

    const response = await api.uploadPhoto(formData, "/posts/image");

    return response.data[0].filename;
  }

  function handleEditPost(postId, props) {
    startLoading();

    const request = props.photoData[0]?.length
      ? uploadPostImage(props.photoData[0][0]).then((filename) =>
          createPostUpdateRequest(postId, props, {
            newPhotoFilename: filename,
          }),
        )
      : createPostUpdateRequest(postId, props);

    request
      .then((updatedPost) => {
        replacePost(updatedPost);

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
        removePost(post._id);
        if (redirectAfterDelete) {
          navigate("/alina/posts");
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

  return {
    allPosts,
    postsToRender,
    setPostsToRender,
    currentPostsNumber,
    hasMorePosts,
    calculatePostsCount,
    showMorePosts,
    handlePostHashtagClick,
    handlePostsSearch,
    handleAddPost: handlePostUpload,
    handleEditPostPopupOpen,
    postToEdit,
    handleEditPost,
    handleDeletePostModalOpen,
    handlePostDelete,
    postToDelete,
    postVersion,
  };
}
