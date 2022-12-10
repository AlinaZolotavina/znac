import { Link } from 'react-router-dom';
import passwordChangedIcon from '../images/password-changed-icon.svg';

function PasswordChanged() {
    return (
        <div className='password-changed'>
            <div className='password-changed__container'>
                <img className='password-changed__image' src={passwordChangedIcon} alt='Icon'/>
                <p className='password-changed__text'>Password was successfully changed!</p>
                <Link className='password-changed__link' to='/'>Back to Home</Link>
            </div>
        </div>
    )
};

export default PasswordChanged;