import React from 'react';

const DefaultContentTemplate = ({ formData, handleChange, uiSchema, schema, errors }) => {
  return (
    <div className="default-content">
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName || ''}
          onChange={(e) => handleChange('firstName', e.target.value)}
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName || ''}
          onChange={(e) => handleChange('lastName', e.target.value)}
        />
      </div>
    </div>
  );
};

export default DefaultContentTemplate;
