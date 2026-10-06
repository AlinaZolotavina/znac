const STATUS_LABELS = {
  ready: "Ready to upload",
  uploading: "Uploading",
  success: "Uploaded",
  error: "Upload failed",
};

function UploadFileInfo({ photo, onRemove, isDisabled }) {
  const { name, previewUrl, status, error } = photo;
  const statusLabel = STATUS_LABELS[status] || STATUS_LABELS.ready;
  const shouldShowStatus = status !== "ready";

  return (
    <li
      className={`upload-file__item upload-file__item_status_${status}`}
      aria-label={`${name}: ${statusLabel}`}
    >
      <img className="upload-file__preview" src={previewUrl} alt="" />

      <span className="visually-hidden">
        {name}
        {error ? `: ${error}` : ""}
      </span>

      <button
        type="button"
        className={`upload-file__remove-btn ${
          isDisabled ? "upload-file__remove-btn_disabled" : ""
        }`}
        onClick={onRemove}
        disabled={isDisabled}
        aria-label={`Remove ${name}`}
      >
        x
      </button>

      {shouldShowStatus && (
        <div className="upload-file__status-overlay" aria-hidden="true">
          <span
            className={`upload-file__status-icon upload-file__status-icon_type_${status}`}
          />
        </div>
      )}
    </li>
  );
}

export default UploadFileInfo;
