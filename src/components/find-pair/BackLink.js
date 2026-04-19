function BackLink ({ linkText, href }) {
    return (
        <a className='find-pair__back-link' href={href} >{linkText}</a>
    )
}

export default BackLink;