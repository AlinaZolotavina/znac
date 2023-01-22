import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import updateEmailIcon from '../images/update-email-icon.svg';

function ConfirmEmailUpdate({ onUpdateEmail }) {
    const email = localStorage.getItem('email');
    let { updateEmailLink } = useParams();
    function handleEmailUpdate() {
        onUpdateEmail(updateEmailLink, JSON.parse(email).email);
    }
    return(
        <div className='confirm-email-update'>
            <div className='confirm-email-update__container'>
                <img className='confirm-email-update__icon' src={updateEmailIcon} alt='Icon'/>
                <p className='confirm-email-update__text'>Do you really want to change your e-mail?</p>
                <button className='confirm-email-update__btn' onClick={handleEmailUpdate}>Confirm</button>
                <Link className='confirm-email-update__link' to='/'>Back to Home</Link>
            </div>
        </div>
    )
};

export default ConfirmEmailUpdate;