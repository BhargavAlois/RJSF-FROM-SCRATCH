import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function DateRangeInput(props) {
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
  const isColumnLayout = uiFieldSchema['ui:layout'] === 'column'

  return (
    <div key={fieldName} className={`${layoutClass} `}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <div className={`${isColumnLayout ? 'd-flex flex-column' : 'd-flex flex-row'}`}>
        <DatePicker
          selected={formData.dateRange?.startDate || new Date()}
          onChange={(date) =>
            handleChange('dateRange', {
              ...formData.dateRange,
              startDate: date,
            })
          }
          selectsStart
          startDate={formData.dateRange?.startDate}
          minDate={new Date()}
          endDate={formData.dateRange?.endDate}
          placeholderText="Start Date"
          dateFormat={uiSchema[fieldName]['ui:options']?.format}
          className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
          placeholder={uiFieldSchema['ui:placeholder']}
        />
        <DatePicker
          selected={formData.dateRange?.endDate || new Date()}
          onChange={(date) =>
            handleChange('dateRange', {
              ...formData.dateRange,
              endDate: date,
            })
          }
          selectsEnd
          startDate={formData.dateRange?.startDate}
          endDate={formData.dateRange?.endDate}
          minDate={formData.dateRange?.startDate}
          placeholderText="End Date"
          dateFormat={uiSchema[fieldName]['ui:options']?.format}
          className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
          placeholder={uiFieldSchema['ui:placeholder']}
        />
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
