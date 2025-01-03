import React from "react";

export default function RadioInput(props) {
  const {schemaModel, formData, errors, title, field, uiField, fieldClass, colClass, handleChange, fieldName} = props;
  const isColumnLayout = uiField["ui:layout"] === "column";
  const {oneOf, enum: enumValues} = field;
  console.log("Inside radio input");

  return (
    <div key={fieldName} className={`${colClass} `}>
      <label className="form-label">{title || fieldName}</label>
      <div
        className={`form-check ${
          isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"
        }`}
      >
        {(oneOf || enumValues) &&
          (oneOf || enumValues).map((value, index) => (
            <div key={index} className="form-check">
              <input
                type="radio"
                className={`${fieldClass} ${
                  errors[fieldName] ? "is-invalid" : ""
                }`}
                name={fieldName}
                value={value}
                checked={formData[fieldName] === value}
                onChange={() => handleChange(fieldName, value)}
              />
              <label className="form-check-label">{value}</label>
            </div>
          ))}
      </div>
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="invalid-feedback m-0">
            {error}
          </p>
        ))}
    </div>
  );
}
