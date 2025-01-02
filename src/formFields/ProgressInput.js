import React from "react";

export default function ProgressInput(props) {
  const {schemaModel, formData, errors, title, field, uiField, fieldClass, colClass, handleChange, fieldName} = props;
  return (
    <div key={fieldName} className={`${colClass} `}>
      <label className="form-label">{title || fieldName}</label>
      <div className="progress" style={{ height: "30px" }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${field?.default}%`,
            backgroundColor: "#007bff",
          }}
          aria-valuenow={field?.default || 0}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {field?.default || 0}%
        </div>
      </div>
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="text-danger mb-0">
            {error}
          </p>
        ))}
    </div>
  );
}
