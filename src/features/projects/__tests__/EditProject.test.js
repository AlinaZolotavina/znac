import { act, renderHook, waitFor } from "@testing-library/react";
import useProjects from "../../blog/hooks/useProjects";
import { mockApi } from "../../../test/mockApi";
import { projects } from "../../../test/fixtures/project";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function renderUseProjects() {
  const props = {
    screenWidth: 800,
    isAlinaRoute: true,
    openModal: jest.fn(),
    activeProjectHashtag: "",
    setActiveProjectHashtag: jest.fn(),
    startLoading: jest.fn(),
    stopLoading: jest.fn(),
    closeAllBlogPopups: jest.fn(),
    setIsEditProjectPopupOpen: jest.fn(),
    setIsDeleteProjectModalOpen: jest.fn(),
  };

  return {
    props,
    ...renderHook((hookProps) => useProjects(hookProps), {
      initialProps: props,
    }),
  };
}

describe("edit project", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getProjects.mockResolvedValue({ data: projects, page: 1, pages: 1 });
  });

  test("opens edit popup and edits project", async () => {
    const updatedProject = { ...projects[0], title: "Updated project" };
    api.editProject.mockResolvedValue(updatedProject);

    const { result, props } = renderUseProjects();

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(2));

    act(() => {
      result.current.handleEditProjectPopupOpen(projects[0]);
    });

    expect(props.setIsEditProjectPopupOpen).toHaveBeenCalledWith(true);
    expect(result.current.projectToEdit).toEqual(projects[0]);

    await act(async () => {
      result.current.handleEditProject("project-1", {
        title: "Updated project",
        hashtags: ["react"],
        text: "Updated text",
        link: "https://updated.test",
      });
    });

    await waitFor(() => expect(api.editProject).toHaveBeenCalled());
    expect(result.current.projectsToRender).toContainEqual(updatedProject);
  });
});
