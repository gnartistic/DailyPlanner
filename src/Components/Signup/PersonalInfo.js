import React from "react";

function PersonalInfo ( { formData, setFormData } )
{
    return (
        <div className="body">
        <div className="header">
                    <h1>What's your name?</h1>
                </div>
        <div className="personal-info-container">
            <input
                type="text"
                    placeholder="First Name"
                    required='true'
                value={formData.firstName}
                onChange={( e ) =>
                {
                    setFormData( { ...formData, firstName: e.target.value } );
                }}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={( e ) =>
                {
                    setFormData( { ...formData, lastName: e.target.value } );
                }}
            />
            </div>
            </div>
    );
}

export default PersonalInfo;