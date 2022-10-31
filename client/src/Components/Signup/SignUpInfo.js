import React, { useState } from "react";
import validator from "validator";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';


function SignUpInfo ( { nextStep, handleFormData, prevStep, values } )
{
    //creating error state for validation
    const [ error, setError ] = useState( false );
    const [ errorEmail, setErrorEmail ] = useState( false );

    // after form submit validating the form data using validator
    const submitFormData = ( e ) =>
    {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to next step
        if( validator.isEmpty( values.email ) || validator.isEmpty( values.username ) ) {
            setError( true );
        } else {
            if( validator.isEmail( values.email ) ) {
                nextStep();
            } else {
                setErrorEmail( true );
            }
        }

    };

    return (
        <div className="form-container">
            <form className="body" onSubmit={submitFormData}>
                <div className="header">
                    <h1>Enter a username and email.</h1>
                </div>
                <div className="sign-up-container">
                    <input
                        type="username"
                        name="username"
                        placeholder="Username"
                        defaultValue={values.username}
                        onChange={handleFormData( "username" )}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        defaultValue={values.email}
                        onChange={handleFormData( "email" )}
                    />
                    {error || errorEmail ? (
                        <p className="errorText">
                            Please enter a username and valid email.
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <div className="footer">
                    <button className="next" type="submit">
                        <FontAwesomeIcon icon={faCircleArrowRight} size="lg" color="#3cccff" />
                    </button>
                    <button className="prev" onClick={prevStep}>
                        <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" color="#3cccff" />
                    </button>
                </div>
            </form>
        </div >
    );
}

export default SignUpInfo;