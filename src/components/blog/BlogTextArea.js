function BlogTextArea({
    placeholder,
    value,
    onChange,
    isSendingReq,
    error,
}) {
    return (
        <label className='blog-input'>
            <textarea
                className="blog-input__field blog-input__field_type_text-area"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                disabled={isSendingReq}
            />
            <span className='blog-input__error'>{error}</span>
        </label>
    )
}

export default BlogTextArea;