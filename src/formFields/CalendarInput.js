import React from "react";

export default function CalendarInput(props) {
  const {schema, uiSchema, formData, errors, title, field, uiField, fieldClass, colClass, handleChange, fieldName} = props;

  return (
    <div key={fieldName} className={`${colClass} `}>
      <label className="form-label">{title}</label>
      <input
        type="date"
        value={formData[fieldName] || ""}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
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
