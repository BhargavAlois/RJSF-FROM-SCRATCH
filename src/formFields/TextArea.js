import React from 'react'

export default function TextArea(props) {
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
  const rows = uiFieldSchema?.['ui:options']?.rows
  const cols = uiFieldSchema?.['ui:options']?.cols

  return (
    <div key={fieldName} className={`${layoutClass}`}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <textarea
        className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
        name={fieldName}
        value={formData[fieldName] || ''}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        rows={rows}
        cols={cols}
        placeholder={uiFieldSchema['ui:placeholder']}
      />
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="invalid-feedback m-0">
            {error}
          </p>
        ))}
    </div>
  )
}
