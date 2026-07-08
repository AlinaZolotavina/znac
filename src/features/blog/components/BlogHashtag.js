function BlogHashtag ({ hashtag, isSymbolActive, classname, onHashtagClick }) {
    const handleClick = () => {
        onHashtagClick(hashtag);
    };
    return (
        <p className={classname} onClick={handleClick} >{`${isSymbolActive ? '#' : ''}${hashtag}`}</p>
    )
}

export default BlogHashtag;