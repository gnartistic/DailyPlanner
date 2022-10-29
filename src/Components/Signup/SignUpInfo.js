import React from "react";

function SignUpInfo ( { formData, setFormData } )
{
    return (
        <div className="body">
        <div className="header">
                    <h1>What's your email?</h1>
                </div>
        <div className="sign-up-container">
            <input
                type="text"
                placeholder="Email"
                value={formData.email}
                onChange={( event ) =>
                    setFormData( { ...formData, email: event.target.value } )
                }
            />
            </div>
            </div>
    );
}

export default SignUpInfo;