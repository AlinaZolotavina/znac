function ShowMoreButton ({ onShowMoreButtonClick, buttonText }) {
    return (
        <button className='show-more-button' onClick={onShowMoreButtonClick}>{buttonText}</button>
    )
}

export default ShowMoreButton;