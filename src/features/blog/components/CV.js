function CV ({ cvVerssion, onCvClick }) {
    return (
        <li className='cv__item'>
            <div className='cv__icon' />
            <p className='cv__version'>{cvVerssion}</p>
            <button className='cv__download-button' onClick={onCvClick}>Download</button>
        </li>
    )
}

export default CV;