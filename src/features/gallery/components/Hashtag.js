function Hashtag({ hashtag, onClick }) {
    function handleClick() {
        onClick(hashtag);
    }

    return (
        <button
            type="button"
            className="hashtag"
            onClick={handleClick}
        >
            # {hashtag}
        </button>
    );
}

export default Hashtag;
