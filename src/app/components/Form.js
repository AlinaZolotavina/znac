function Form({ formName, formClassname, titleClassname, title, buttonClassname, buttonText, isFormValid, isSendingReq, onSubmit, children }) {
    return (
        <section className={formClassname}>
            <h2 className={titleClassname}>{title}</h2>
            <form
                name={formName}
                className='form__container'
                onSubmit={onSubmit}
            >
                {children}
                <button
                    className={`${buttonClassname} ${!isFormValid ? `${buttonClassname}_disabled` : ''}`}
                    type='submit'
                    disabled={!isFormValid || isSendingReq}
                >{buttonText}</button>
            </form>
        </section>
    );
}

export default Form;