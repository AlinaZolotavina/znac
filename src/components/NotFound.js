import { Link } from 'react-router-dom';
import notFoundIcon from '../images/not-found-icon.svg';

function NotFound() {
    return (
        <div className='not-found'>
            <div className='not-found__container'>
                <img className='not-found__image' src={notFoundIcon} alt='Not found icon'/>
                <p className='not-found__text'>Nothing was found!</p>
                <p className='not-found__text'>Сheck your request and try again.</p>
                <Link className='not-found__link' to='/'>Back to Home</Link>
            </div>
        </div>
    )
};

export default NotFound;