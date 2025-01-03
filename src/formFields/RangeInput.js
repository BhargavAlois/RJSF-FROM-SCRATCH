import React from "react";

export default function RangeInput(props) {
  const {schemaModel, formData, errors, title, field, uiField, fieldClass, colClass, handleChange, fieldName} = props;
  const min = field.minimum || 0;
  const max = field.maximum || 100;
  const oneOf = field.oneOf;
  console.log("Inside range : ");
  
  const defaultValue =
    field.default !== undefined && field.default !== null ? field.default : min;
  const rangeValue = formData[fieldName] || defaultValue;

  return (
    <div key={fieldName} className={`${colClass}`}>
      <label className="form-label">{title || fieldName}</label>
      <input
        type="range"
        name={fieldName}
        className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
        value={rangeValue}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        min={min}
        max={max}
        step="1"
        placeholder={uiField["ui:placeholder"]}
      />
      <div className="range-value">
        <span>{rangeValue}</span>
      </div>
      {errors[fieldName] && (
        <div className="invalid-feedback">
          {errors[fieldName].map((error, index) => (
            <p key={index} className="m-0">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
