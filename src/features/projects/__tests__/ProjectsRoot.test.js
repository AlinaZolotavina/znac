import { act, renderHook, waitFor } from "@testing-library/react";
import useProjects from "../../blog/hooks/useProjects";
import { mockApi } from "../../../test/mockApi";
import { projects } from "../../../test/fixtures/project";

jest.mock("../../../shared/utils/api", () => ({
  __esModule: true,
  default: jest.requireActual("../../../test/mockApi").mockApi,
}));

const api = mockApi;

function renderUseProjects(overrides = {}) {
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
    ...overrides,
  };

  return {
    props,
    ...renderHook((hookProps) => useProjects(hookProps), {
      initialProps: props,
    }),
  };
}

describe("projects root logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api.getProjects.mockResolvedValue({ data: projects, page: 1, pages: 1 });
  });

  test("loads projects", async () => {
    const { result } = renderUseProjects();

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(2));

    expect(api.getProjects).toHaveBeenCalledWith(1, 12, { hashtag: "" });
    expect(result.current.hasMoreProjects).toBe(true);
  });

  test("filters projects by hashtag and clears active filter on second click", async () => {
    api.getProjects.mockResolvedValueOnce({ data: projects, page: 1, pages: 1 });
    api.getProjects.mockResolvedValueOnce({
      data: [projects[0], projects[2]],
      page: 1,
      pages: 1,
    });

    const { result, props, rerender } = renderUseProjects();

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(2));

    act(() => {
      result.current.handleProjectHashtagClick("react");
    });

    expect(props.setActiveProjectHashtag).toHaveBeenCalledWith("react");
    await waitFor(() =>
      expect(api.getProjects).toHaveBeenLastCalledWith(1, 12, {
        hashtag: "react",
      }),
    );

    rerender({
      ...props,
      activeProjectHashtag: "react",
    });

    act(() => {
      result.current.handleProjectHashtagClick("react");
    });

    expect(props.setActiveProjectHashtag).toHaveBeenLastCalledWith("");
    expect(result.current.projectsToRender).toHaveLength(2);
  });

  test("shows more projects after responsive count calculation", async () => {
    const { result } = renderUseProjects();

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(2));

    act(() => {
      result.current.calculateProjectsCount();
    });

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(2));

    act(() => {
      result.current.showMoreProjects();
    });

    await waitFor(() => expect(result.current.projectsToRender).toHaveLength(4));
  });
});
