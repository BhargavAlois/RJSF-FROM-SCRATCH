import React from 'react'

export default function AltDateInput(props) {
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
  const { yearsRange, format: dateFormat } = uiFieldSchema['ui:options'] || {}
  const startYear = yearsRange ? yearsRange[0] : 1900
  const endYear = yearsRange ? yearsRange[1] : 2100
  const isColumnLayout = uiFieldSchema['ui:layout'] === 'column'

  const handleChangeDatePart = (part, value) => {
    const updatedDate = { ...formData[fieldName] }
    updatedDate[part] = value
    handleChange(fieldName, updatedDate)
  }

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate()
  }

  const dayOptions = []
  const monthOptions = months.map((month, index) => (
    <option key={index} value={index + 1}>
      {month}
    </option>
  ))
  const yearOptions = []
  for (let i = startYear; i <= endYear; i++) {
    yearOptions.push(
      <option key={i} value={i}>
        {i}
      </option>,
    )
  }

  const selectedYear = formData[fieldName]?.year || new Date().getFullYear()
  const selectedMonth = formData[fieldName]?.month || new Date().getMonth() + 1
  const selectedDay = formData[fieldName]?.day || new Date().getDate()
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)

  for (let i = 1; i <= daysInMonth; i++) {
    dayOptions.push(
      <option key={i} value={i}>
        {i}
      </option>,
    )
  }

  const isYMD = dateFormat === 'YMD'
  const isMDY = dateFormat === 'MDY'

  return (
    <div key={fieldName} className={`${layoutClass} `}>
      {(title || fieldName) && (showLabel) && <label className="form-label">
        {title || fieldName}
        {isRequired && <span>*</span>}
      </label>}
      <div className={`${isColumnLayout ? 'd-flex flex-column' : 'd-flex flex-row'}`}>
        {isYMD && (
          <>
            <select
              name={`${fieldName}_year`}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={selectedYear}
              onChange={(e) => handleChangeDatePart('year', e.target.value)}
            >
              <option value="">Year</option>
              {yearOptions}
            </select>
            <select
              name={`${fieldName}_month`}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={selectedMonth}
              onChange={(e) => handleChangeDatePart('month', e.target.value)}
            >
              <option value="">Month</option>
              {monthOptions}
            </select>
            <select
              name={`${fieldName}_day`}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={selectedDay}
              onChange={(e) => handleChangeDatePart('day', e.target.value)}
            >
              <option value="">Day</option>
              {dayOptions}
            </select>
          </>
        )}
        {isMDY && (
          <>
            <select
              name={`${fieldName}_month`}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={selectedMonth}
              onChange={(e) => handleChangeDatePart('month', e.target.value)}
            >
              <option value="">Month</option>
              {monthOptions}
            </select>
            <select
              name={`${fieldName}_day`}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={selectedDay}
              onChange={(e) => handleChangeDatePart('day', e.target.value)}
            >
              <option value="">Day</option>
              {dayOptions}
            </select>
            <select
              name={`${fieldName}_year`}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={selectedYear}
              onChange={(e) => handleChangeDatePart('year', e.target.value)}
            >
              <option value="">Year</option>
              {yearOptions}
            </select>
          </>
        )}
      </div>
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="text-danger">
            {error}
          </p>
        ))}
    </div>
  )
}
