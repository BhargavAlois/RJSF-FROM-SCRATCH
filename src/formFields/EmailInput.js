import React from "react";

export default function EmailInput(props) {
  const {schema, uiSchema, formData, errors, title, field, uiField, layoutClass, fieldClass, handleChange, fieldName} = props;
  return (
    <div key={fieldName} className={`${layoutClass} `}>
      <label className="form-label">{title || fieldName}</label>
      <input
        type="text"
        name={fieldName}
        className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
        value={formData[fieldName] || ""}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        placeholder={uiField["ui:placeholder"]}
      />
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="invalid-feedback m-0">
            {error}
          </p>
        ))}
    </div>
  );
}
