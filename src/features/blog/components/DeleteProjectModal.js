import Form from "./BlogForm";
import CloseButton from "./BlogCloseButton";

function DeleteProjectModal({ project, isOpen, onClose, onDeleteProject }) {
    function handleProjectDelete(e) {
        e.preventDefault();
        onDeleteProject(project);
    }
    return (
        <div className={`popup popup_type_delete-post ${isOpen && 'popup_is-opened'}`}>
            <div className="popup__container">
                <Form
                    formName='delete-project'
                    formClassname='popup__form'
                    titleClassname='popup__title'
                    title='Are you sure you want to delete the project?'
                    buttonClassname='popup__submit-btn delete-project-submit-btn'
                    buttonText='Delete'
                    isFormValid={true}
                    isSendingReq={false}
                    onSubmit={handleProjectDelete}

                />
                <CloseButton classname="close-btn popup__close-btn" onClick={onClose}/>
            </div>
        </div>
    );
}

export default DeleteProjectModal;