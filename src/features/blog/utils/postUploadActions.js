import api from "../../../shared/utils/api";
import * as messages from "../../../shared/utils/messages";

export default function postUploadActions({
  startLoading,
  stopLoading,
  prependPosts,
  openModal,
  closeAllBlogPopups,
}) {
  async function uploadSingleImage(file) {
    const formData = new FormData();

    formData.append("images", file);

    const response = await api.uploadPhoto(formData, "/posts/image");

    if (!response.data?.length) {
      throw new Error("Upload response is invalid");
    }

    return response.data[0].filename;
  }

  async function createPost(props, photoData = {}) {
    const data = {
      theme: props.theme,
      icon: props.icon,
      title: props.title,
      hashtags: props.hashtags,
      text: props.text,
      ...photoData,
    };

    return api.addPost(data);
  }

  function handlePostUploadSuccess(addedPosts) {
    prependPosts(addedPosts);

    openModal({
      status: "success",
      message:
        addedPosts.length === 1
          ? messages.POST_ADDED_SUCCESSFULLY_MSG
          : `${addedPosts.length} posts were added successfully`,
    });

    closeAllBlogPopups();
  }

  async function handlePostUpload(props) {
    startLoading();

    try {
      const addedPosts = [];

      if (props.photoData[0]?.length) {
        for (const file of props.photoData[0]) {
          const filename = await uploadSingleImage(file);

          const newPost = await createPost(props, {
            photoFilename: filename,
          });

          addedPosts.push(newPost);
        }
      } else {
        const newPost = await createPost(props);
        addedPosts.push(newPost);
      }

      handlePostUploadSuccess(addedPosts);

      return addedPosts;
    } catch (err) {
      console.error(err);

      openModal({
        status: "error",
        message: err.message || messages.POST_ADD_ERROR_MSG,
      });

      throw err;
    } finally {
      stopLoading();
    }
  }

  return {
    handlePostUpload,
  };
}
