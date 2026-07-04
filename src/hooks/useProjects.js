import { useState, useEffect } from "react";
import api from "../utils/api";
import * as messages from "../utils/messages";
import { LARGE_SCREEN_WIDTH, MIDDLE_SCREEN_WIDTH } from "../utils/constants";

export default function useProjects({ screenWidth, isAlinaRoute, openModal }) {
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

  useEffect(() => {
    setProjectsToRender(allProjects.slice(0, currentProjectsNumber));
  }, [allProjects, currentProjectsNumber]);

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

  return {
    allProjects,
    setAllProjects,
    loadedProjects,
    projectsToRender,
    setProjectsToRender,
    currentProjectsNumber,
    setCurrentProjectsNumber,
    visibleLoadedProjectsCount,
    setVisibleLoadedProjectsCount,
    projectsToAdd,
    projectsPage,
    setProjectsPage,
    projectsPages,
    setProjectsPages,
    hasMoreProjects,
    getProjectsLayout,
    calculateProjectsCount,
    loadProjects,
  };
}
