function BlogForm ({
    formName,
    formClassname,
    titleClassname,
    titleId,
    title,
    buttonClassname,
    buttonText,
    isFormValid,
    isSendingReq,
    onSubmit,
    children
}) {
    return (
        <section className={formClassname}>
            <h2 className={titleClassname} id={titleId}>{title}</h2>
            <form
                name={formName}
                className='blog-form'
                onSubmit={onSubmit}
                noValidate
            >
                {children}
                <button
                    className={`blog-submit-btn ${buttonClassname} ${!isFormValid ? `${buttonClassname}_disabled` : ''}`}
                    type='submit'
                    disabled={!isFormValid || isSendingReq}
                >{buttonText}</button>
            </form>
        </section>
    )
}

export default BlogForm;
