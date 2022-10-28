import Form from './Form';
import Input from './Input';

import { Link } from 'react-router-dom';

function SignUp() {
    return (
        <section className='sign-up'>
            <div className='sign-up__container'>
                <Form
                    title='Create account'
                    buttonText='Sign up'
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
                    <p className='form__link-note'>Already registered?</p>
                    <Link className='form__link' to='/'>Sign in</Link>
                </div> 
            </div>
            
        </section>
    );
}

export default SignUp;