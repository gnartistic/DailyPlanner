import React, { useState } from 'react';
import {Link} from'react-router-dom'
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import './index.scss'

const Login = ( props ) =>
{
  const [ formState, setFormState ] = useState( { email: '', password: '' } );
  const [ login, { error } ] = useMutation( LOGIN_USER );

  // update state based on form input changes
  const handleChange = ( event ) =>
  {
    const { name, value } = event.target;

    setFormState( {
      ...formState,
      [ name ]: value,
    } );
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
  };

  return (
    <>
      <div className='login-form'>
        <div className='header'>
          <h1>Welcome back!</h1>
        </div>
        <form onSubmit={handleFormSubmit} className="login-container">
          <input
            placeholder="Email"
            name="email"
            type="email"
            id="email"
            value={formState.email}
            onChange={handleChange}
          />
          <input
            placeholder="Password"
            name="password"
            type="password"
            id="password"
            value={formState.password}
            onChange={handleChange}
          />
          <div className='footer'>
            <button type="submit">Login</button>
          </div>
          {error && <div className='errorText'>Invalid email or password, please try again or <Link to='/signup'>create an account</Link>.</div>}
        </form>
      </div>
    </>
  )
}

export default Login