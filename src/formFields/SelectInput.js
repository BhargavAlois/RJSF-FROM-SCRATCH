import React from "react";

export default function SelectInput(props) {
  const {
    schemaModel,
    formData,
    errors,
    title,
    field,
    uiField,
    fieldClass,
    colClass,
    handleChange,
    fieldName,
  } = props;

  const { oneOf, enum: enumValues } = field;

  return (
    <div key={fieldName} className={`${colClass}`}>
      <label className="form-label">{title || fieldName}</label>
      <select
        name={fieldName}
        className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
        value={formData[fieldName] || ""}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        placeholder={uiField["ui:placeholder"]}
      >
        <option value="">Select an option</option>
        {enumValues &&
          enumValues.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        {oneOf &&
          oneOf.map((value, index) => (
            <option key={index} value={value.const}>
              {value.title || value.const}
            </option>
          ))}
      </select>
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="invalid-feedback m-0">
            {error}
          </p>
        ))}
    </div>
  );
}
