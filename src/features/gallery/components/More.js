function More({ onShowMore }) {
    return (
        <section className="more">
            <button
                className="more__btn"
                onClick={onShowMore}
            >
                Show more
            </button>
        </section>
    );
}

export default More;