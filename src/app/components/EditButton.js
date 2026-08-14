function EditButton({ classname, onClick, ariaLabel = "Edit" }) {
    return (
        <button className={classname} onClick={onClick} aria-label={ariaLabel} />
    )
}

export default EditButton;
