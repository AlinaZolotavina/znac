function Navigation({ className, firstLink, secondLink, thirdLink }) {

    return (
        <div className={className}>
            <button className="nav__link">{firstLink}</button>
            <button className="nav__link">{secondLink}</button>
            <button className="nav__link">{thirdLink}</button>
        </div>
    );
}

export default Navigation;