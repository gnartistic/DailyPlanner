/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState } from "react";
import {Link} from 'react-router-dom'
import validator from "validator";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import Auth from '../../utils/auth'
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';

function PasswordInfo ( { nextStep, handleFormData, prevStep, values } )
{
    //creating error state for validation
    const [ errorPassword, setErrorPassword ] = useState( false );
    const [ addUser, { error } ] = useMutation( ADD_USER );

    const [ passReqMessage, setPassReqMessage ] = useState( false );


    // after form submit validating the form data using validator
    const submitFormData = ( e ) =>
    {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to next step
        if( validator.isEmpty( values.password ) ) {
            setErrorPassword( true );
        } else if( validator.isStrongPassword( values.password, [] ) ) {
            handleFormSubmit();
            console.log( values )
            
            } else {
                setErrorPassword( true );
            }
    };

    const handleFormSubmit = async ( event ) =>
    {
        try {
            const { data } = await addUser( {
                variables: { ...values },
            } );
            
                Auth.login( data.addUser.token );
            
        } catch( e ) {
            console.error( e );
        }
    };

    return (
        <div className="form-container">
            <form className="body" onSubmit={submitFormData}>
                <div className="header">
                    <h1>Enter a password.</h1>
                </div>
                <div className="other-info-container">
                    {passReqMessage &&<p className="passwordText">Password must contain 8-12 characters,<br /> minimum of one uppercase character (A-Z),<br />minimum of one lowercase character (a-z), <br />and one non-alphanumeric character ($%&!).</p> }
                    <input
                        className="password"
                        placeholder="Password"
                        name="password"
                        type="password"
                        id="pwd"
                        onClick={() => { setPassReqMessage( true ); }}
                        defaultValue={values.password}
                        onChange={handleFormData( "password" )}
                    />
                    {errorPassword ? (
                        <div>
                            <p className="errorText" style={{ bottom:'-20px', position:'relative' }}>Please enter a valid password.</p>
                            </div>
                    ) : (
                        ""
                    )}
                    {error && <p className="errorText" style={{textAlign:'center'}}>An account already exists with your chosen username or email.<br/> Please try again or <Link to='/login'>login</Link></p>}
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