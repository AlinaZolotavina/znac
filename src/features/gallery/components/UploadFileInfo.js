function UploadFileInfo({ fileName }) {
    return (
        <li
            className='upload-file__item'
        >
            <div className='upload-file__image-icon' />
            {fileName}
        </li>
    )
}

export default UploadFileInfo;