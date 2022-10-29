import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from 'react-loaders'
import SignUpInfo from './SignUpInfo'
import PersonalInfo from './PersonalInfo'
import PasswordInfo from './PasswordInfo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faCircleArrowLeft, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './index.scss'
        
const Signup = () =>
{
    const navigate = useNavigate();

    const navigateToConfirmation = () =>
    {
        navigate( '/confirmation' );
    }
    const navigateToHome = () =>
    {
        navigate( '/' );
    }

    const [ page, setPage ] = useState( 0 );
    const [ formData, setFormData ] = useState( {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: 'false',
    } );

    const FormTitles = [ "What's your name?", "What's your email?", "Enter a password"];

    const PageDisplay = () =>
    {
        if( page === 0 ) {
            return <PersonalInfo formData={formData} setFormData={setFormData} />;
        } else if( page === 1 ) {
            return <SignUpInfo formData={formData} setFormData={setFormData} />;
        } else {
            return <PasswordInfo formData={formData} setFormData={setFormData} />;
        }
    };


    return (
<>
        <div className="form">
            <div className="progressbar">
                <div
                    style={{ width: page === 0 ? "33.3%" : page === 1 ? "66.6%" : "100%" }}
                ></div>
            </div>
            <div className="form-container">
                {PageDisplay()}
                <div className="footer">
                    <button className='prev'
                        onClick={() =>
                        {
                            if( page === 0 ) {
                                return navigateToHome();
                            }
                            setPage( ( currPage ) => currPage - 1 );
                        }}
                    >
                        <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" color="#3cccff" />
                    </button>
                    <button className='next'
                        onClick={() =>
                        {
                            if( page === FormTitles.length - 1 ) {
                                console.log( formData );
                                return navigateToConfirmation();
                            } else {
                                setPage( ( currPage ) => currPage + 1 );
                            }
                        }}
                    >
                        {page === FormTitles.length - 1 ? <FontAwesomeIcon icon={faCheckCircle} size="lg" color="#3cccff" /> : <FontAwesomeIcon icon={faCircleArrowRight} size="lg" color="#3cccff" />}
                    </button>
                </div>
            </div>
            </div>
            <Loader type="ball-scale-ripple-multiple" />
            </>
    )
}

export default Signup