function ContactButton ({ onClick }) {
    function handleClick(e) {
        onClick();
        e.target.blur();
    }
    return (
        <button className='contact-button' onClick={handleClick}>
            <span className='contact-button__text'>Contact me</span>
            <div className='contact-button__icon' />            
        </button>
    )
}

export default ContactButton;