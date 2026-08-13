import { useState } from "react";

function EditingHashtags({ editingHashtags, onSubmit, isSendingReq, photoId }) {
  const [hashtags, setHashtags] = useState(editingHashtags);
  const [hashtagsError, setHashtagsError] = useState();
  const fieldId = `edit-photo-hashtags-${photoId}`;
  const errorId = `${fieldId}-error`;
  const hasError = Boolean(hashtagsError);

  function handleHashtagsChange(e) {
    const regex = /^[A-Za-zА-Яа-я0-9 _]*$/;
    if (e.target.value.length === 0) {
      setHashtagsError("You must add at least one hashtag");
    } else if (!regex.test(e.target.value)) {
      setHashtagsError("Only letters, numbers and underscores are allowed");
    } else {
      setHashtagsError("");
    }
    setHashtags(e.target.value);
  }

  function handleEditHashtags(e) {
    e.preventDefault();
    onSubmit(photoId, hashtags);
  }
  return (
    <form
      name="edit-hashtags"
      className="edit-hashtags"
      onSubmit={handleEditHashtags}
    >
      <label className="edit-hashtags__input">
        <input
          id={fieldId}
          type="text"
          value={hashtags}
          onChange={handleHashtagsChange}
          className="edit-hashtags__field"
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={hasError ? errorId : undefined}
        />
        <span className="input__error" id={errorId}>
          {hashtagsError}
        </span>
      </label>
      <button
        className="edit-hashtags__submit-btn"
        type="submit"
        aria-label="Save photo hashtags"
      />
    </form>
  );
}

export default EditingHashtags;
