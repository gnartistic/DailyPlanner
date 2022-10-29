import React from "react";

function PasswordInfo ( { formData, setFormData } )
{
    return (
        <div className="body">
        <div className="header">
                    <h1>Enter a password.</h1>
        </div>
        <div className="sign-up-container">
            <input
                type="text"
                placeholder="Password"
                value={formData.password}
                onChange={( event ) =>
                    setFormData( { ...formData, password: event.target.value } )
                }
            />
            <input
                type="text"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={( event ) =>
                    setFormData( { ...formData, confirmPassword: event.target.value } )
                }
            />
            </div>
            </div>
    );
}

export default PasswordInfo;