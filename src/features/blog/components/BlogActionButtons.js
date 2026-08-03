function BlogActionButtons({
  onEdit,
  onDelete,
  editId,
  deleteId,
  editLabel,
  deleteLabel,
}) {
  return (
    <>
      <button
        id={editId}
        className="blog-edit-btn"
        type="button"
        aria-label={editLabel}
        onClick={onEdit}
      />
      <button
        id={deleteId}
        className="blog-delete-btn"
        type="button"
        aria-label={deleteLabel}
        onClick={onDelete}
      />
    </>
  );
}

export default BlogActionButtons;
