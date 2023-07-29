import React from 'react'
import './index.scss'
import Loader from 'react-loaders';
import { Link } from 'react-router-dom';

const Home = () =>
{

  return (
    <>
      <div className="container home-page">
        <div className="text-zone">
          <h1>Productive<span className='bold'>Mind</span></h1>
        </div>
        <div className='button-zone'>
          <Link to='/login'><button className='login'> Login</button></Link>
          <Link to='/signup'><button className='signup'>Signup</button></Link>
        </div>
      </div>
      <Loader type="line-scale" style={{transform: 'scale(2)'}} />
    </>
  )
}

export default Home