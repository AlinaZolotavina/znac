import { useState, useEffect } from "react";
import api from "../utils/api";
import { LARGE_SCREEN_WIDTH, MIDDLE_SCREEN_WIDTH } from "../utils/constants";

export default function usePosts({
  screenWidth,
  isAlinaRoute,
  query,
  setQuery,
  activePostHashtag,
  setActivePostHashtag,
}) {
  const [allPosts, setAllPosts] = useState([]);
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [postsToRender, setPostsToRender] = useState([]);
  const [currentPostsNumber, setCurrentPostsNumber] = useState(3);

  const [postsToAdd, setPostsToAdd] = useState(0);
  const [postsPage, setPostsPage] = useState(1);
  const [postsPages, setPostsPages] = useState(1);
  const hasMorePosts =
    currentPostsNumber < allPosts.length || postsPage < postsPages;

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

  return {
    allPosts,
    setAllPosts,
    postsToRender,
    setPostsToRender,
    currentPostsNumber,
    hasMorePosts,
    calculatePostsCount,
    showMorePosts,
    handlePostHashtagClick,
    handlePostsSearch,
  };
}
