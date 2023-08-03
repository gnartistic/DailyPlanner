import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import './index.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { validateEmail } from '../../utils/helpers';

const Login = ( props ) =>
{
  const [ formState, setFormState ] = useState( { email: '', password: '' } );
  const [ login, { error } ] = useMutation( LOGIN_USER );

  const { email, password } = formState;

  const [ emailErrMsg, setEmailErrMsg ] = useState( '' );

  const [ pwdErrMsg, setPwdErrMsg ] = useState( '' );

  const [ validPassword, setValidPassword ] = useState( '' );

  const [ validEmail, setValidEmail ] = useState( '' );

  // update state based on form input changes
  const handleChange = ( e ) =>
  {
    const { name, value } = e.target;

    setFormState( {
      ...formState,
      [ name ]: value,
    } )

      if( e.target.name === 'email' ) {
        const isEmailValid = validateEmail( e.target.value );

        if( !isEmailValid ) {
          setValidEmail( '' );
          setEmailErrMsg( 'Not a valid email' )
        } else {
          setValidEmail( 'true' );
          setEmailErrMsg( '' );
        }
      }

      if( e.target.name === 'password' ) {
        const isPasswordValid = e.target.value.length > 4;

        if( !isPasswordValid ) {
          setValidPassword( '' );
          setPwdErrMsg( 'Not a valid password' );
        } else {
          setValidPassword( 'true' );
          setPwdErrMsg( '' );
        }
      }

      if( !emailErrMsg || validPassword ) {
        setFormState( { ...formState, [ e.target.name ]: e.target.value } );
      }
  };

  // submit form
  const handleFormSubmit = async ( event ) =>
  {
    event.preventDefault();

    try {
      const { data } = await login( {
        variables: { ...formState },
      } );

      Auth.login( data.login.token );
    } catch( e ) {
      console.error( e );
    }

    // clear form values
    setFormState( {
      email: '',
      password: '',
    } );
  }

  return (
    <>
      <div className="container login-page page">
      <div className='login-form'>
        <form onSubmit={handleFormSubmit}>
        <div className='input-container'>
                            {/* email input container */}
                            <div className='email'>
                                {/* conditional styling based on validation error */}
                                <div className='input-box' style={{ border: emailErrMsg ? '2px solid #f20d17' : '', borderRadius: emailErrMsg ? '5px' : '' }}>
                                    <FontAwesomeIcon icon={faUser} color='#3d3d3d' />
                                    <input
                                        type='email'
                                        name='email'
                                        maxLength={50}
                                        onChange={handleChange}
                                        onBlur={handleChange}
                                        defaultValue={email}
                                        placeholder='Email' />
                                </div>
                                {/* email error message */}
                                {emailErrMsg && (
                                    <p className="error-text">{emailErrMsg}</p>
                                )}
                            </div>
                            {/* password input container */}
                            <div className='password'>
                                {/* conditional styling based on validation error */}
                                <div className='input-box' style={{ border: pwdErrMsg ? '2px solid #f20d17' : '', borderRadius: pwdErrMsg ? '5px' : '' }}>
                                    <FontAwesomeIcon icon={faLock} color='#3d3d3d' />
                                    <input
                                        type='password'
                                        name='password'
                                        maxLength={16}
                                        onChange={handleChange}
                                        onBlur={handleChange}
                                        defaultValue={password}
                                        placeholder='Must be at least 4 characters' />
                                </div>
                                {/* password error message */}
                                {pwdErrMsg && (
                                    <p className="error-text">{pwdErrMsg}</p>
                                )}
                            </div>

                            {/* login button, disabled if inputs do not pass all verification */}
                            <button
                                data-test-id="button"
                                disabled={!password || !email || !validPassword || !validEmail}
                                type='submit'
                                className='signIn'>
                                Login
                            </button>

                            {/* server error message */}
                            {/* {serverErrMsg && (
                                <p className='error-text2'>{serverErrMsg}</p>
                            )} */}
                        </div>
						{/* link to signup component */}
						<div className="createAccount">
							<Link to="/Signup">Create Account</Link>
						</div>

						<p>
							By tapping "Create Account" or "Login", you agree to our Terms
							of Service.
						</p>
        </form>
      </div>
      </div>
    </>
  )
}

export default Login