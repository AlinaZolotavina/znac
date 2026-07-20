import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../../shared/utils/api";
import {
  DEFAULT_ERROR_MSG,
  PROJECT_ADDED_SUCCESSFULLY_MSG,
  PROJECT_ADD_ERROR_MSG,
  PROJECT_EDITED_SUCCESSFULLY_MSG,
  PROJECT_EDIT_ERROR_MSG,
} from "../../../shared/utils/messages";
import {
  LARGE_SCREEN_WIDTH,
  MIDDLE_SCREEN_WIDTH,
} from "../../../shared/utils/constants";

export default function useProjects({
  screenWidth,
  isAlinaRoute,
  openModal,
  activeProjectHashtag,
  setActiveProjectHashtag,
  startLoading,
  stopLoading,
  closeAllBlogPopups,
  setIsEditProjectPopupOpen,
  setIsDeleteProjectModalOpen,
}) {
  const [allProjects, setAllProjects] = useState([]);
  const [loadedProjects, setLoadedProjects] = useState([]);
  const [currentProjectsNumber, setCurrentProjectsNumber] = useState(3);
  const [visibleLoadedProjectsCount, setVisibleLoadedProjectsCount] =
    useState(0);
  const [projectsToAdd, setProjectsToAdd] = useState(0);
  const [projectsPage, setProjectsPage] = useState(1);
  const [projectsPages, setProjectsPages] = useState(1);
  const [projectToEdit, setProjectToEdit] = useState({});
  const [projectToDelete, setProjectToDelete] = useState({});

  const projectsToRender = useMemo(
    () => allProjects.slice(0, currentProjectsNumber),
    [allProjects, currentProjectsNumber],
  );

  const hasMoreProjects =
    currentProjectsNumber < allProjects.length || projectsPage < projectsPages;

  const getProjectsLayout = useCallback(() => {
    if (screenWidth >= LARGE_SCREEN_WIDTH) {
      return {
        initialProjectsNumber: 9,
        projectsToAdd: 3,
      };
    }

    if (screenWidth >= MIDDLE_SCREEN_WIDTH) {
      return {
        initialProjectsNumber: 3,
        projectsToAdd: 3,
      };
    }

    return {
      initialProjectsNumber: 2,
      projectsToAdd: 2,
    };
  }, [screenWidth]);

  const calculateProjectsCount = useCallback(() => {
    const { initialProjectsNumber, projectsToAdd } = getProjectsLayout();

    setProjectsToAdd(projectsToAdd);
    setCurrentProjectsNumber((current) =>
      Math.max(current, initialProjectsNumber),
    );
  }, [getProjectsLayout]);

  const loadProjects = useCallback(
    ({ page = 1, append = false, hashtag = "" } = {}) => {
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
            message: err.message || DEFAULT_ERROR_MSG,
          });

          throw err;
        });
    },
    [getProjectsLayout, openModal],
  );

  useEffect(() => {
    if (!isAlinaRoute || loadedProjects.length > 0) {
      return;
    }
    loadProjects({
      page: 1,
      append: false,
      hashtag: "",
    });
  }, [isAlinaRoute, loadedProjects.length, loadProjects]);

  function replaceProject(updatedProject) {
    setAllProjects((projects) =>
      projects.map((project) =>
        project._id === updatedProject._id ? updatedProject : project,
      ),
    );
  }

  function removeProject(projectId) {
    setAllProjects((projects) =>
      projects.filter((project) => project._id !== projectId),
    );
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

  function handleAddProject(newProject) {
    startLoading();
    api
      .addProject(newProject)
      .then((createdProject) => {
        openModal({
          status: "success",
          message: PROJECT_ADDED_SUCCESSFULLY_MSG,
        });
        setAllProjects((prev) => [createdProject, ...prev]);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || PROJECT_ADD_ERROR_MSG,
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
          message: PROJECT_EDITED_SUCCESSFULLY_MSG,
        });
        replaceProject(newProject);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || PROJECT_EDIT_ERROR_MSG,
        });
      })
      .finally(() => {
        stopLoading();
        closeAllBlogPopups();
      });
  }

  function handleEditProjectPopupOpen(project) {
    setIsEditProjectPopupOpen(true);
    setProjectToEdit(project);
  }

  function handleProjectDelete(project) {
    api
      .deleteProject(project._id)
      .then(() => {
        removeProject(project._id);
      })
      .catch((err) => {
        openModal({
          status: "error",
          message: err.message || DEFAULT_ERROR_MSG,
        });
      })
      .finally(() => closeAllBlogPopups());
  }

  function handleDeleteProjectModalOpen(project) {
    setIsDeleteProjectModalOpen(true);
    setProjectToDelete(project);
  }

  return {
    projectsToRender,
    totalProjects: allProjects.length,
    currentProjectsNumber,
    hasMoreProjects,
    calculateProjectsCount,
    showMoreProjects,
    handleProjectHashtagClick,
    handleAddProject,
    handleEditProject,
    handleEditProjectPopupOpen,
    projectToEdit,
    handleProjectDelete,
    handleDeleteProjectModalOpen,
    projectToDelete,
  };
}
