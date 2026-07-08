function BackButton({ onBackButtonClick}) {
    return (
        <button className='back-button' onClick={onBackButtonClick}>
            <div className="back-button__icon"/>
            Go back
        </button>
    )
}

export default BackButton;