/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from "react";
import validator from "validator";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';

function PasswordInfo ( { nextStep, handleFormData, prevStep, values } )
{
    //creating error state for validation
    const [ errorPassword, setErrorPassword ] = useState( false );

    // after form submit validating the form data using validator
    const submitFormData = ( e ) =>
    {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to next step
        if( validator.isEmpty( values.password ) ) {
            setErrorPassword( true );
        } else {
            if( validator.isStrongPassword( values.password, [] ) ) {
                nextStep();
            } else {
                setErrorPassword( true );
            }
        }
    };

    return (
        <div className="form-container">
            <form className="body" onSubmit={submitFormData}>
                <div className="header">
                    <h1>Enter a password.</h1>
                </div>
                <div className="sign-up-container">
                    <input
                        placeholder="Password"
                        name="password"
                        type="password"
                        id="pwd"
                        defaultValue={values.password}
                        onChange={handleFormData( "password" )}
                    />
                    {errorPassword ? (
                        <div>
                        <p className="errorText" style={{textAlign:'left'}}>Password must contain:<br/>8-12 characters<br/> Atleast 1 uppercase letter (A-Z) <br/>Atleast 1 lowercase letter (a-z)<br/>Atleast 1 symbol ($%&!)</p>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                <div className="footer">
                    <button className="next" type="submit">
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" color="#3cccff" />
                    </button>
                    <button className="prev" onClick={prevStep}>
                        <FontAwesomeIcon icon={faCircleArrowLeft} size="lg" color="#3cccff" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PasswordInfo;