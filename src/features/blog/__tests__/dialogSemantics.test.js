import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders";
import { posts } from "../../../test/fixtures/post";
import { projects } from "../../../test/fixtures/project";
import NewPostPopup from "../components/NewPostPopup";
import EditPostPopup from "../components/EditPostPopup";
import DeletePostModal from "../components/DeletePostModal";
import NewProjectPopup from "../components/NewProjectPopup";
import EditProjectPopup from "../components/EditProjectPopup";
import DeleteProjectModal from "../components/DeleteProjectModal";
import ProjectDetailsPopup from "../components/ProjectDetailsPopup";
import GetInTouchPopup from "../components/GetInTouchPopup";

function expectLabelledDialog(name) {
  const dialog = screen.getByRole("dialog", { name });
  const labelledBy = dialog.getAttribute("aria-labelledby");
  const heading = document.getElementById(labelledBy);

  expect(dialog).toHaveAttribute("aria-modal", "true");
  expect(labelledBy).toBeTruthy();
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveTextContent(name);
  expect(heading.tagName).toBe("H2");
}

describe("blog dialog semantics", () => {
  test("NewPostPopup is labelled by its visible heading", () => {
    renderWithProviders(
      <NewPostPopup
        isOpen
        onClose={jest.fn()}
        isSendingReq={false}
        onAddPost={jest.fn()}
      />,
    );

    expectLabelledDialog("New post");
  });

  test("EditPostPopup is labelled by its visible heading", () => {
    renderWithProviders(
      <EditPostPopup
        isOpen
        onClose={jest.fn()}
        isSendingReq={false}
        post={posts[0]}
        onEditPost={jest.fn()}
      />,
    );

    expectLabelledDialog("Edit post");
  });

  test("DeletePostModal is labelled by its visible heading", () => {
    renderWithProviders(
      <DeletePostModal
        isOpen
        post={posts[0]}
        onClose={jest.fn()}
        onDeletePost={jest.fn()}
      />,
    );

    expectLabelledDialog("Are you sure you want to delete the post?");
  });

  test("NewProjectPopup is labelled by its visible heading", () => {
    renderWithProviders(
      <NewProjectPopup
        isOpen
        onClose={jest.fn()}
        onAddProject={jest.fn()}
        isSendingReq={false}
      />,
    );

    expectLabelledDialog("New project");
  });

  test("EditProjectPopup is labelled by its visible heading", () => {
    renderWithProviders(
      <EditProjectPopup
        isOpen
        onClose={jest.fn()}
        project={projects[0]}
        onEditProject={jest.fn()}
        isSendingReq={false}
      />,
    );

    expectLabelledDialog("Edit project");
  });

  test("DeleteProjectModal is labelled by its visible heading", () => {
    renderWithProviders(
      <DeleteProjectModal
        isOpen
        project={projects[0]}
        onClose={jest.fn()}
        onDeleteProject={jest.fn()}
      />,
    );

    expectLabelledDialog("Are you sure you want to delete the project?");
  });

  test("ProjectDetailsPopup is labelled by the project title heading", () => {
    renderWithProviders(
      <ProjectDetailsPopup
        isOpen
        project={projects[0]}
        onClose={jest.fn()}
        onHashtagClick={jest.fn()}
      />,
    );

    expectLabelledDialog(projects[0].title);
  });

  test("GetInTouchPopup is labelled by its visible heading", () => {
    renderWithProviders(
      <GetInTouchPopup
        isOpen
        isSendingReq={false}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );

    expectLabelledDialog("Get in touch");
  });
});
