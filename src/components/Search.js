import { useEffect, useState } from "react";

function Search({ onSubmit, isSendingReq, hashtag, hashtagSetter }) {
    const [hashtagError, setHashtagError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    function handleHashtagChange(e) {
        const regex = /^[A-Za-zА-Яа-я0-9_]*$/;
        if (e.target.value.length === 0) {
            setHashtagError('Field must not be empty');
        } else if (!regex.test(e.target.value)) {
            setHashtagError('Only letters, numbers and underscores are allowed');
        } else {
            setHashtagError('');
        }
        hashtagSetter(e.target.value);
    }

    useEffect(() => {
        if (hashtag && !hashtagError) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [hashtag, hashtagError]);

    function handleSearch(e) {
        e.preventDefault();
        onSubmit(hashtag);
    }
    return (
        <section className="search">
            <form className="search__form" onSubmit={handleSearch}>
                <label className="search__field">
                    <input
                        className="search__input"
                        placeholder="enter hashtag"
                        type='text'
                        value={hashtag}
                        onChange={handleHashtagChange}
                        required
                    />
                </label>
                <button
                    className={`search__submit-btn ${isFormValid ? '' : 'search__submit-btn_disabled'}`}
                    type='submit'
                    disabled={!isFormValid || isSendingReq}
                />
            </form>
            <span className='search__error'>{hashtagError}</span>
        </section>
    );
}

export default Search;