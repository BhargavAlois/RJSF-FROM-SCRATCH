import React from "react";

export default function RadioInput(props) {
  const {
    schema, uiSchema,
    formData,
    errors,
    title,
    field,
    uiField,
    fieldClass,
    layoutClass,
    handleChange,
    fieldName,
  } = props;

  const isColumnLayout = uiField["ui:layout"] === "column";

  const renderEnumOptions = (enumValues) => {
    return enumValues.map((value, index) => (
      <div key={index} className="form-check">
        <input
          type="radio"
          className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
          name={fieldName}
          value={value}
          checked={formData[fieldName] === value}
          onChange={() => handleChange(fieldName, value)}
        />
        <label className="form-check-label">{value}</label>
      </div>
    ));
  };

  const renderOneOfOptions = (oneOfOptions) => {
    return oneOfOptions.map((option, index) => {
      const value = typeof option === "object" ? option.const : option;
      const label = typeof option === "object" ? option.title : option;

      return (
        <div key={index} className="form-check">
          <input
            type="radio"
            className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
            name={fieldName}
            value={value}
            checked={formData[fieldName] === value}
            onChange={() => handleChange(fieldName, value)}
          />
          <label className="form-check-label">{label}</label>
        </div>
      );
    });
  };

  return (
    <div key={fieldName} className={`${layoutClass}`}>
      <label className="form-label">{title || fieldName}</label>
      <div
        className={`form-check ${
          isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"
        }`}
      >
        {field.enum && renderEnumOptions(field.enum)}
        {field.oneOf && renderOneOfOptions(field.oneOf)}
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
