function BlogUploadFileInfo({ fileName }) {
    return (
        <li
            className='blog-upload-file__item'
        >
            <div className='blog-upload-file__image-icon' />
            {fileName.length > 10 ? `${fileName.slice(0, 8)}... .jpg` : fileName}
        </li>
    )
}

export default BlogUploadFileInfo;