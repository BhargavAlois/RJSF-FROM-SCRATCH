import React from "react";

export default function TextInput(props) {
  const {schemaModel, formData, errors, title, field, uiField, fieldClass, colClass, handleChange, fieldName} = props;
  console.log("inside text fieldName : ", fieldName);
  console.log("Inside text field : ", formData[fieldName]);
  return (
    <div key={fieldName} className={`${colClass} `}>
      <label className="form-label">{title || fieldName}</label>
      <input
        type="text"
        className={`${fieldClass} ${errors[fieldName] ? "is-invalid" : ""}`}
        name={fieldName}
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
