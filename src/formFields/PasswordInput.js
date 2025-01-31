import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

export default function PasswordInput(props) {
  const {
    schema,
    uiSchema,
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
  } = props

  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (
    <div key={fieldName} className={`${layoutClass} mb-3`}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <div className="input-group has-validation">
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          name={fieldName}
          className={`${fieldClass} form-control ${errors[fieldName] ? 'is-invalid' : ''}`}
          value={formData[fieldName] || ''}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          placeholder={uiFieldSchema['ui:placeholder']}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          aria-label="Toggle password visibility"
          className="btn btn-outline-secondary"
          style={{
            border: '1px solid #ced4da',
            borderLeft: 'none',
            borderRadius: '0.5',
            backgroundColor: 'white',
          }}
        >
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </button>
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
    </div>
  )
}
