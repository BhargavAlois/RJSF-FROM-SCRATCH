import React from 'react'

export default function RangeInput(props) {
  const {
    schema,
    uiSchema,
    formData,
    errors,
    title,
    field,
    uiFieldSchema,
    layoutClass,
    fieldClass,
    handleChange,
    fieldName,
    isRequired,
    showLabel
  } = props
  const min = field.minimum || 0
  const max = field.maximum || 100
  const oneOf = field.oneOf

  const defaultValue = field.default !== undefined && field.default !== null ? field.default : min
  const rangeValue = formData[fieldName] || defaultValue

  return (
    <div key={fieldName} className={`${layoutClass}`}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <input
        type="range"
        name={fieldName}
        className={`${fieldClass} form-range ${errors[fieldName] ? 'is-invalid' : ''}`}
        value={rangeValue}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        min={min}
        max={max}
        step="1"
        placeholder={uiFieldSchema['ui:placeholder']}
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
  )
}
