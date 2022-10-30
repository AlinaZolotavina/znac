function Form({ formClassname, titleClassname, title, buttonClassname, buttonText, children }) {
    return (
        <section className={formClassname}>
            <h2 className={titleClassname}>{title}</h2>
            <form className='form__container'>
                {children}
                <button
                    className={buttonClassname}
                >{buttonText}</button>
            </form>
        </section>
    );
}

export default Form;