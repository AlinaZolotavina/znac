import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import api from "../../../shared/utils/api";
import {
  DEFAULT_ERROR_MSG,
  POST_EDIT_ERROR_MSG,
  POST_EDITED_SUCCESSFULLY_MSG,
} from "../../../shared/utils/messages";
import postUploadActions from "../utils/postUploadActions";
import { useNavigate } from "react-router-dom";

const POSTS_PAGE_SIZE = 12;
const TABLET_SCREEN_WIDTH = 600;

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
  const initialPostsNumber = screenWidth >= TABLET_SCREEN_WIDTH ? 12 : 6;
  const postsToAdd = screenWidth >= TABLET_SCREEN_WIDTH ? 4 : 2;
  const initialPostsNumberRef = useRef(initialPostsNumber);
  initialPostsNumberRef.current = initialPostsNumber;
  const [allPosts, setAllPosts] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [currentPostsNumber, setCurrentPostsNumber] = useState(initialPostsNumber);

  const [postsPage, setPostsPage] = useState(1);
  const [postsPages, setPostsPages] = useState(1);
  const [postToEdit, setPostToEdit] = useState({});
  const [postToDelete, setPostToDelete] = useState({});
  const [postVersion, setPostVersion] = useState(0);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const lastPostsQueryRef = useRef(null);
  const loadedPostsPaginationRef = useRef({ page: 1, pages: 1 });

  const postsToRender = useMemo(
    () => allPosts.slice(0, currentPostsNumber),
    [allPosts, currentPostsNumber],
  );

  const hasMorePosts =
    currentPostsNumber < allPosts.length || postsPage < postsPages;

  const { handlePostUpload } = postUploadActions({
    startLoading,
    stopLoading,
    prependPosts,
    openModal,
    closeAllBlogPopups,
  });

  const calculatePostsCount = useCallback(() => {
    setCurrentPostsNumber((current) => Math.max(current, initialPostsNumber));
  }, [initialPostsNumber]);

  const loadPosts = useCallback(
    ({ page = 1, append = false, search = "", theme = "All" } = {}) => {
      const normalizedSearch = search.trim();
      const normalizedTheme = theme || "All";
      const hasSearch = Boolean(normalizedSearch);
      const hasThemeFilter = normalizedTheme !== "All";
      const hasFilters = hasSearch || hasThemeFilter;

      const queryKey = `${page}|${normalizedSearch}|${normalizedTheme}|${append}`;

      if (lastPostsQueryRef.current?.key === queryKey) {
        return lastPostsQueryRef.current.promise;
      }

      setIsPostsLoading(true);

      const requestPromise = api
        .getPosts(page, POSTS_PAGE_SIZE, {
          search: normalizedSearch,
          theme: normalizedTheme,
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
            loadedPostsPaginationRef.current = { page: responsePage, pages };
          }

          setPostsPage(responsePage);
          setPostsPages(pages);

          // For a new set of results (search / theme), use an adaptive initial quantity
          if (!append) {
            setCurrentPostsNumber(initialPostsNumberRef.current);
          }

          return response;
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          if (lastPostsQueryRef.current?.key === queryKey) {
            lastPostsQueryRef.current = null;
            setIsPostsLoading(false);
          }
        });

      lastPostsQueryRef.current = {
        key: queryKey,
        promise: requestPromise,
      };

      return requestPromise;
    },
    [],
  );

  useEffect(() => {
    if (!isAlinaRoute) return;

    loadPosts();
  }, [isAlinaRoute, loadPosts]);

  function prependPosts(newPosts) {
    setAllPosts((posts) => [...newPosts, ...posts]);
  }

  function replacePost(updatedPost) {
    setAllPosts((posts) =>
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post)),
    );
  }

  function removePost(postId) {
    setAllPosts((posts) => posts.filter((post) => post._id !== postId));
  }

  function showMorePosts() {
    if (isPostsLoading) return;

    const nextVisibleCount = currentPostsNumber + postsToAdd;

    if (nextVisibleCount <= allPosts.length) {
      setCurrentPostsNumber(nextVisibleCount);
      return;
    }

    if (postsPage >= postsPages) {
      setCurrentPostsNumber(allPosts.length);
      return;
    }

    return loadPosts({
      page: postsPage + 1,
      append: true,
      search: query,
      theme: activePostHashtag,
    }).then((response) => {
      if (!response) return;

      setCurrentPostsNumber(
        Math.min(nextVisibleCount, allPosts.length + response.data.length),
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
        setPostsPage(loadedPostsPaginationRef.current.page);
        setPostsPages(loadedPostsPaginationRef.current.pages);
        setCurrentPostsNumber(initialPostsNumberRef.current);
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
      externalLink: props.externalLink,
      externalLinkButtonText: props.externalLinkButtonText,
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

    const [newPhotoFile] = props.photoData || [];

    const request = newPhotoFile
      ? uploadPostImage(newPhotoFile).then((filename) =>
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
          message: POST_EDITED_SUCCESSFULLY_MSG,
        });
      })
      .catch((err) => {
        console.error(err);

        openModal({
          status: "error",
          message: err.message || POST_EDIT_ERROR_MSG,
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
          navigate("/journal/posts");
        }
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => {
        closeAllBlogPopups();
      });
  }

  return {
    postsToRender,
    totalPosts: allPosts.length,
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
    isPostsLoading,
  };
}
