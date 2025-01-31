import React from 'react'

export default function RadioInput(props) {
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

  const { oneOf, enum: enumValues, enumNames } = field
  const isColumnLayout = uiFieldSchema['ui:layout'] === 'column'

  const renderEnumNamesOption = (enumValues, enumNames) => {
    return enumValues.map((value, index) => (
      <div key={index} className="form-check">
        <input
          type="radio"
          className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
          name={fieldName}
          value={value}
          checked={formData[fieldName] === value}
          onChange={() => handleChange(fieldName, value)}
        />
        <label className="form-check-label">{enumNames[index] || value}</label>
      </div>
    ))
  }

  const renderEnumOptions = (enumValues) => {
    return enumValues.map((value, index) => (
      <div key={index} className="form-check">
        <input
          type="radio"
          className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
          name={fieldName}
          value={value}
          checked={formData[fieldName] === value}
          onChange={() => handleChange(fieldName, value)}
        />
        <label className="form-check-label">{value}</label>
      </div>
    ))
  }

  const renderOneOfOptions = (oneOfOptions) => {
    return oneOfOptions.map((option, index) => {
      const value = typeof option === 'object' ? option.const : option
      const label = typeof option === 'object' ? option.title || value : value

      return (
        <div key={index} className="form-check">
          <input
            type="radio"
            className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            name={fieldName}
            value={value}
            checked={formData[fieldName] === value}
            onChange={() => handleChange(fieldName, value)}
          />
          <label className="form-check-label">{label}</label>
        </div>
      )
    })
  }

  return (
    <div key={fieldName} className={`${layoutClass}`}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <div className={`form-check ${isColumnLayout ? 'd-flex flex-column' : 'd-flex flex-row'}`}>
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
  )
}
