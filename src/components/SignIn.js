import Form from './Form';
import Input from './Input';

import { Link } from 'react-router-dom';

function SignIn() {
    return (
        <section className='sign-in'>
            <div className='sign-in__container'>
                <Form
                    formClassname='form'
                    titleClassname='form__title'
                    title='Glad to see you again!'
                    buttonClassname='form__submit-btn'
                    buttonText='Sign in'
                >
                    <Input 
                        inputLabel='E-mail'
                        placeholder='Enter e-mail'
                        classname='input__field'
                    />
                    <Input 
                        inputLabel='Password'
                        placeholder='Enter password'
                        classname='input__field'
                    />
                </Form>
                <div className='form__additional-info'>
                    <p className='form__link-note'>Forgot your password?</p>
                    <Link className='form__link' to='/signin/recovery'>Reset</Link>
                </div>
                
            </div>
            
        </section>
    );
}

export default SignIn;