import validator from "validator";
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight} from '@fortawesome/free-solid-svg-icons';

function PersonalInfo ( { nextStep, handleFormData, values } )
{

    // creating functional component ans getting props from app.js and destucturing them

    //creating error state for validation
    const [ error, setError ] = useState( false );

    // after form submit validating the form data using validator
    const submitFormData = ( e ) =>
    {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to step 2
        if(
            validator.isEmpty( values.firstName ) ||
            validator.isEmpty( values.lastName )
        ) {
            setError( true );
        } else {
            nextStep();
        }
    };

    return (

        <div className="form-container">
            <form className="body" onSubmit={submitFormData}>
                <div className="header">
                    <h1>What's your name?</h1>
                </div>
                <div className="personal-info-container">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        defaultValue={values.firstName}
                        onChange={handleFormData( "firstName" )}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name='lastName'
                        defaultValue={values.lastName}
                        onChange={handleFormData( "lastName" )}
                    />
                    {error ? (
                        <p className="errorText">
                            Please provide your first and last name.
                        </p>
                    ) : (
                        ""
                    )}
                </div>
                <div className="footer">
                    <button className="next" type="submit">
                        <FontAwesomeIcon icon={faCircleArrowRight} size="lg" color="#3cccff" />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PersonalInfo;