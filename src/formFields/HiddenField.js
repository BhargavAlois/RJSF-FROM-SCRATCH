import React from 'react'

export default function HiddenField(props) {
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
  return (
    <div key={fieldName} className={`${layoutClass} `} hidden={true}>
      <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>
      <input
        type="text"
        name={fieldName}
        className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
        value={formData[fieldName] || ''}
        onChange={(e) => handleChange(fieldName, e.target.value)}
        placeholder={uiFieldSchema['ui:placeholder']}
      />
    </div>
  )
}
