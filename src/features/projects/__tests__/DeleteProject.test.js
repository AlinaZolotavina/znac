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
    screenWidth: 500,
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

  return renderHook((hookProps) => useProjects(hookProps), {
    initialProps: props,
  });
}

describe("delete project", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getProjects.mockResolvedValue({ data: projects, page: 1, pages: 1 });
    api.deleteProject.mockResolvedValue({});
  });

  test("deletes project and removes it from list", async () => {
    const { result } = renderUseProjects();

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(2));

    await act(async () => {
      result.current.handleProjectDelete(projects[0]);
    });

    await waitFor(() =>
      expect(api.deleteProject).toHaveBeenCalledWith("project-1"),
    );
    expect(result.current.projectsToRender).not.toContainEqual(
      expect.objectContaining({ _id: "project-1" }),
    );
  });
});
