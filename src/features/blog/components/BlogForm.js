function BlogForm({
  formName,
  formClassname,
  titleClassname,
  titleId,
  title,
  titleTag = "h2",
  buttonClassname,
  buttonText,
  isFormValid,
  isSendingReq,
  onSubmit,
  children,
}) {
  const Title = titleTag;
  return (
    <section className={formClassname}>
      <Title className={titleClassname} id={titleId}>
        {title}
      </Title>
      <form
        name={formName}
        className="blog-form"
        onSubmit={onSubmit}
        noValidate
      >
        {children}
        <button
          className={`blog-submit-btn ${buttonClassname} ${!isFormValid ? `${buttonClassname}_disabled` : ""}`}
          type="submit"
          disabled={!isFormValid || isSendingReq}
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}

export default BlogForm;
