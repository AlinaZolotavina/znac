import Form from './Form';
import Input from './Input';

import { Link } from 'react-router-dom';

function SignIn() {
    return (
        <section className='sign-in'>
            <div className='sign-in__container'>
                <Form
                    title='Glad to see you again!'
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
                    <Link className='form__link' to='/'>Reset</Link>
                </div>
                
            </div>
            
        </section>
    );
}

export default SignIn;