function CloseButton({ classname, onClick, ariaLabel }) {
    return (
        <button className={classname} onClick={onClick} aria-label={ariaLabel} />
    );
}

export default CloseButton;
