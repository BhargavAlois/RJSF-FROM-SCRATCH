import React from "react";

export default function CheckboxInput(props) {
  const {
    schemaModel,
    formData,
    errors,
    title,
    field,
    uiFieldSchema,
    fieldClass,
    layoutClass,
    handleChange,
    fieldName,
    isRequired,
    showLabel
  } = props;

  const isColumnLayout = uiFieldSchema["ui:layout"] === "column";
  const { oneOf, enum: enumValues, enumNames } = field;
  const currentValues = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];

  const renderEnumNamesOption = (enumValues, enumNames) => {
    return enumValues.map((value, index) => (
      <div key={index} className="form-check" style={{ flexBasis: "20%" }}>
        <input
          type="checkbox"
          className={`${fieldClass} form-check-input ${errors[fieldName] ? "is-invalid" : ""}`}
          name={fieldName}
          value={value}
          checked={formData[fieldName]?.includes(value)}
          onChange={(e) => {
            const updatedValues = e.target.checked
              ? [...(formData[fieldName] || []), value]
              : (formData[fieldName] || []).filter((val) => val !== value);
            handleChange(fieldName, updatedValues);
          }}
        />
        <label className="form-check-label">{enumNames[index] || value}</label>
      </div>
    ));
  };

  const renderEnumOptions = (enumValues) => {
    return enumValues.map((value, index) => (
      <div key={index} className="form-check" style={{ flexBasis: "20%" }}>
        <input
          type="checkbox"
          className={`${fieldClass} form-check-input ${errors[fieldName] ? "is-invalid" : ""}`}
          name={fieldName}
          value={value}
          checked={formData[fieldName]?.includes(value)}
          onChange={(e) => {
            const updatedValues = e.target.checked
              ? [...(formData[fieldName] || []), value]
              : (formData[fieldName] || []).filter((val) => val !== value);
            handleChange(fieldName, updatedValues);
          }}
        />
        <label className="form-check-label">{value}</label>
      </div>
    ));
  };

  const renderOneOfOptions = (oneOfOptions) => {
    return oneOfOptions.map((option, index) => {
      const value = typeof option === "object" ? option.const : option;
      const label = typeof option === "object" ? option.title || value : value;

      return (
        <div key={index} className="form-check" style={{ flexBasis: "20%" }}>
          <input
            type="checkbox"
            className={`${fieldClass} form-check-input ${errors[fieldName] ? "is-invalid" : ""}`}
            name={fieldName}
            value={value}
            checked={formData[fieldName]?.includes(value)}
            onChange={(e) => {
              const updatedValues = e.target.checked
                ? [...(formData[fieldName] || []), value]
                : (formData[fieldName] || []).filter((val) => val !== value);
              handleChange(fieldName, updatedValues);
            }}
          />
          <label className="form-check-label">{label}</label>
        </div>
      );
    });
  };

  return (
    <div key={fieldName} className={`${layoutClass}`}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <div
        className={`form-check ${
          isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"
        }`}
        style={{ overflow: "hidden" }}
      >
        {(enumNames && enumValues && renderEnumNamesOption(enumValues, enumNames)) ||
          (enumValues && renderEnumOptions(enumValues)) ||
          (field?.items?.enum && renderEnumOptions(field?.items?.enum)) ||
          (oneOf && renderOneOfOptions(oneOf))}
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
