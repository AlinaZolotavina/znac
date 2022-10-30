import { Link } from 'react-router-dom';

function Navigation({ className, firstLink, secondLink, thirdLink }) {

    return (
        <div className={className}>
            <Link
                className="nav__link"
                to='/'
            >
                {firstLink}
            </Link>
            <Link
                className="nav__link"
                to={`/${secondLink.toLowerCase()}`}
            >
                {secondLink}
            </Link>
            <Link
                className="nav__link"
                to={`/${thirdLink.toLowerCase().replace(/ /g,'')}`}
            >   
                {thirdLink}
            </Link>
        </div>
    );
}

export default Navigation;