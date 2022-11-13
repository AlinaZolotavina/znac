function Search() {
    return (
        <section className="search">
            <form className="search__form">
                <label className="search__field">
                    <input className="search__input" placeholder="enter hashtag"/>
                </label>
                <button className="search__submit-btn"></button>
            </form>
        </section>
    );
}

export default Search;