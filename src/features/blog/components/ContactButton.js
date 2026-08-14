function ContactButton ({ onClick }) {
    function handleClick() {
        onClick();
    }
    return (
        <button
            className='contact-button'
            onClick={handleClick}
            aria-label='Contact me'
        >
            <span className='contact-button__text'>Contact me</span>
            <div className='contact-button__icon' />            
        </button>
    )
}

export default ContactButton;
