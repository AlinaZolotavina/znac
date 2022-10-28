function Form({ title, buttonText, children }) {
    return (
        <section className='form'>
            <h2 className='form__title'>{title}</h2>
            <form className='form__container'>
                {children}
                <button
                    className='form__submit-btn'
                >{buttonText}</button>
            </form>
        </section>
    );
}

export default Form;