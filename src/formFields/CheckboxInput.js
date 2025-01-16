import React from "react";

export default function CheckboxInput(props) {
  const {schemaModel, formData, errors, title, field, uiField, fieldClass, layoutClass, handleChange, fieldName} = props;

  const isColumnLayout = uiField["ui:layout"] === "column";

  console.log(`From checkbox ${fieldName} : ${formData[fieldName]}`);

  // Ensure formData[fieldName] is always an array
  const currentValues = Array.isArray(formData[fieldName]) ? formData[fieldName] : [];
  console.log("current : ", currentValues);

  const renderEnumNamesOption = (enumNames) => {
    return enumNames.map((value, index) => (
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

  const renderEnumOptions = (enumValues) => {
    return enumValues.map((value, index) => (
      <option key={index} value={value}>
        {value}
      </option>
    ));
  };

  const renderCheckboxes = (enumValues) => {
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
      const label = typeof option === "object" ? option.title : option;

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
      <label className="form-label">{title || fieldName}</label>
      <div
        className={`form-check ${
          isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"
        }`}
        style={{ overflow: "hidden" }}
      >
        {(enumNames && renderEnumNamesOption(enumNames)) ||
          (enumValues && renderCheckboxes(enumValues)) ||
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
