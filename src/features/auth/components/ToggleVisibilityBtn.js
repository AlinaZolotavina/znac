function ToggleVisibilityBtn({
    isPasswordVisible,
    onVisibilityBtnClick,
}) {
    return (
        <button
            className={`visibility-btn ${isPasswordVisible ? 'visibility-btn_state_visible' : 'visibility-btn_state_invisible'}`}
            type='button'
            onClick={onVisibilityBtnClick}
            title={isPasswordVisible ? 'Hide password' : 'Show password'}
        />
    );
}

export default ToggleVisibilityBtn;