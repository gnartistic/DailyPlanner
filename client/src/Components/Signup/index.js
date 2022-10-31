import React, { useState } from 'react'
import Loader from 'react-loaders'
import SignUpInfo from './SignUpInfo'
import PersonalInfo from './PersonalInfo'
import PasswordInfo from './PasswordInfo'
import './index.scss'

const Signup = () =>
{
    const [ step, setStep ] = useState( 1 );
    const [ formData, setFormData ] = useState( {
        username:'',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    } );

    // function for going to next step by increasing step state by 1
    const nextStep = () =>
    {
        setStep( step + 1 );
    };

    // function for going to previous step by decreasing step state by 1
    const prevStep = () =>
    {
        setStep( step - 1 );
    };

    // handling form input data by taking onchange value and updating our previous form data state
    const handleInputData = input => e =>
    {
        // input value from the form
        const { value } = e.target;

        //updating for data state taking previous state and then adding new value to create new object
        setFormData( prevState => ( {
            ...prevState,
            [ input ]: value
        } ) );
    }

    // javascript switch case to show different form in each step
    switch( step ) {
        // case 1 to show stepOne form and passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
        case 1:
            return (

                <>
                    <div id='signupForm' className="form">
                        <div className="progressbar">
                            <div
                                style={{ width: "33.3%" }}
                            ></div>
                        </div>
                        <div className="form-container">
                            <PersonalInfo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                        </div>
                    </div>
                    <Loader type="ball-scale-ripple-multiple" />
                </>
            );
        // case 2 to show stepTwo form passing nextStep, prevStep, and handleInputData as handleFormData method as prop and also formData as value to the fprm
        case 2:
            return (
                <>
                    <div id='signupForm' className="form">
                        <div className="progressbar">
                            <div
                                style={{ width: "66.6%" }}
                            ></div>
                        </div>
                        <div className="form-container">
                            <SignUpInfo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                        </div>
                    </div>
                    <Loader type="ball-scale-ripple-multiple" />
                </>
            );
        // Only formData is passed as prop to show the final value at form submit
        case 3:
            return (
                <>
                    <div id='signupForm' className="form">
                        <div className="progressbar">
                            <div
                                style={{ width: "100%" }}
                            ></div>
                        </div>
                        <div className="form-container">
                            <PasswordInfo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                        </div>
                    </div>
                    <Loader type="ball-scale-ripple-multiple" />
                </>
            );
        // default case to show nothing
        default:
            return (
                <div className="App">
                </div>
            );
    }
}


export default Signup