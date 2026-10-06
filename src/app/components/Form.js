function Form({
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
  const isSubmitDisabled = !isFormValid || isSendingReq;

  return (
    <section className={formClassname}>
      <Title className={titleClassname} id={titleId}>
        {title}
      </Title>
      <form name={formName} className="form__container" onSubmit={onSubmit}>
        {children}
        <button
          className={`${buttonClassname} ${isSubmitDisabled ? `${buttonClassname}_disabled` : ""}`}
          type="submit"
          disabled={isSubmitDisabled}
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}

export default Form;
