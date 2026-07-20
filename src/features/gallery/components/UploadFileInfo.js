function UploadFileInfo({ fileName, onRemove }) {
  return (
    <li className="upload-file__item">
      <div className="upload-file__image-icon" />

      <span className="upload-file__name">{fileName}</span>

      <button
        type="button"
        className="upload-file__remove-btn"
        onClick={onRemove}
        aria-label={`Remove ${fileName}`}
      >
        ✕
      </button>
    </li>
  );
}

export default UploadFileInfo;
