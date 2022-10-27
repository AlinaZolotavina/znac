function Navigation({ className }) {

    return (
        <div className={className}>
            <button className="nav__link">HOME</button>
            <button className="nav__link">GALLERY</button>
            <button className="nav__link">CONTACT</button>
        </div>
    );
}

export default Navigation;