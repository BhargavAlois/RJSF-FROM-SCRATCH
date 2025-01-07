import React, { useState } from "react";
import { FaRegEyeSlash, FaEye } from "react-icons/fa6";

export default function PasswordInput(props) {
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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div key={fieldName} className={`${colClass} `}>
      <label className="form-label">{title || fieldName}</label>
      <div className="input-group">
        <input
          type={isPasswordVisible ? "text" : "password"}
          name={fieldName}
          className={`${fieldClass} ${
            errors[fieldName] ? "is-invalid" : ""
          } form-control`}
          value={formData[fieldName] || ""}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          placeholder={uiField["ui:placeholder"]}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
          className="btn"
          style={{
            border: "1px solid #ced4da",
            borderRadius: "0.5",
            backgroundColor: "white",
          }}
        >
          {isPasswordVisible ? <FaEye /> : <FaRegEyeSlash />}
        </button>
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
