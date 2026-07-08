function Hashtag({ hashtag, onClick }) {
    function handleClick() {
        onClick(hashtag);
    }

    return (
        <p
            className="hashtag"
            onClick={handleClick}
        >
            # {hashtag}
        </p>
    );
}

export default Hashtag;