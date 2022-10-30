import React from 'react'
import './index.scss'

const Login = () => {
  return (
    <>
      <div className='login-form'>
      <div className='header'>
        <h1>Welcome back!</h1>
        </div>
    <div className="login-container">
            <input
                type="text"
                placeholder="Email"
            />
            <input
                type="text"
                placeholder="Password"
          />
          <div className='footer'>
          <button>Login</button>
        </div>
        </div>
      </div>
      </>
  )
}

export default Login