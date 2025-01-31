import React, { useState } from 'react'
import { format } from 'date-fns'
import * as formFields from '../formFields/InputFieldsExports'

export default function ContentTemplate({
  formData,
  schema,
  uiSchema = {},
  widgets,
  fields,
  errors,
  onChange: handleChange,
  onSuccess,
  onError,
  onSubmit,
  requiredFields,
}) {

  const getDeepValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  const normalizeFieldName = (fieldName) => {
    const parts = fieldName.split('.')
    return parts[parts.length - 1] // Return the last part of the path
  }

  const getFieldSchemaByName = (schema, fieldName) => {
    // Recursive function to find the field by its name
    const findField = (currentSchema, currentFieldName) => {
      // If the current schema is an object with properties, check each property
      if (currentSchema.type === 'object' && currentSchema.properties) {
        // Iterate through all properties to find the one that matches currentFieldName
        for (const [key, value] of Object.entries(currentSchema.properties)) {
          // If the key matches the field name, return the field
          if (key === currentFieldName) {
            return value
          }

          // If the field is an object, recurse into it
          if (value.type === 'object') {
            const result = findField(value, currentFieldName)
            if (result) return result // Return the field if found in nested object
          }
        }
      }
      // If the field is not found, return null
      return null
    }

    return findField(schema, fieldName)
  }

  const renderField = (field, fieldName, parentSchema = schema, fieldPath) => {
    const { title, enum: enumValues, oneOf, format } = field
    fieldPath = fieldPath ? `${fieldPath}.${fieldName}` : fieldName
    const uiFieldSchema = getDeepValue(uiSchema, fieldPath) || {}
    const uiOptions = uiFieldSchema?.['ui:options'] || uiFieldSchema?.['ui-options']
    const divClassName = uiFieldSchema['ui:className'] || uiFieldSchema['ui:classNames'] || uiFieldSchema['classNames'] || uiOptions?.classNames
    const divClass = divClassName ? `${divClassName}` : ''
    const layoutClass = divClass ? `form-group ${divClass}` : 'form-group'
    const widget = uiFieldSchema['ui:widget'] || format || 'string'
    const fieldClass = 'form-control'
    const normalizedFieldName = normalizeFieldName(fieldName)
    const isRequired = requiredFields.includes(fieldName)
    const showLabel = (uiOptions?.label !== undefined) ? (uiOptions?.label) : (true);

    //Implementation of handleDefaultFieldChange where only target value is accepted as parameter (for custom widgets and fields only)
    const handleDefaultFieldChange = (value) => {
      handleChange(normalizedFieldName, value)
    }

    if (field.type === 'object' && field.properties) {
      return (
        <>
          {title && (
            <legend id={`root_${normalizedFieldName}__title`} className="mt-2">
              {title}
              {isRequired && <span>*</span>}
            </legend>
          )}
          {field.description && <p style={{ size: '5px' }}>{field?.description}</p>}
          <div
            id={`root_${normalizedFieldName}`}
            key={normalizedFieldName}
            className={`${divClass}`}
          >
            {Object.keys(field.properties).map((nestedFieldName) => {
              const nestedField = field.properties[nestedFieldName]
              const updatedParentSchema = parentSchema.properties[nestedFieldName]
              return renderField(nestedField, `${nestedFieldName}`, updatedParentSchema, fieldPath)
            })}
          </div>
        </>
      )
    } else if (fields) {
      if (uiFieldSchema['ui:field']) {
        const Component = fields?.[uiFieldSchema?.['ui:field']]
        return (
          <div className={`${layoutClass}`}>
            <Component
              key={fieldName}
              uiSchema={uiFieldSchema}
              onChange={handleDefaultFieldChange}
            />
          </div>
        )
      }
    } else if (uiFieldSchema['ui:field']) {
      const Component = uiFieldSchema['ui:field']
      return (
        <div className={`${layoutClass}`}>
          <Component key={fieldName} uiSchema={uiFieldSchema} onChange={handleDefaultFieldChange} />
        </div>
      )
    }

    const inputFields = {
      string: formFields.TextInput,
      text: formFields.TextInput,
      TextWidget: formFields.TextInput,
      'alt-date': formFields.AltDateInput,
      password: formFields.PasswordInput,
      email: formFields.EmailInput,
      file: formFields.FileInput,
      button: formFields.ButtonInput,
      calendar: formFields.CalendarInput,
      checkboxes: formFields.CheckboxInput,
      date: formFields.DateInput,
      daterange: formFields.DateRangeInput,
      datetime: formFields.DateTimeInput,
      day: formFields.DayInput,
      month: formFields.MonthInput,
      progress: formFields.ProgressInput,
      radio: formFields.RadioInput,
      range: formFields.RangeInput,
      select: formFields.SelectInput,
      time: formFields.TimeInput,
      UpDownWidget: formFields.UpDownInput,
      updown: formFields.UpDownInput,
      year: formFields.YearInput,
      numberEnum: formFields.RadioInput,
      textarea: formFields.TextArea,
      hidden: formFields.HiddenField,
    }

    const Component = inputFields[widget]
    if (Component) {
      return (
        <Component
          key={fieldName}
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          field={field}
          uiFieldSchema={uiFieldSchema}
          errors={errors}
          handleChange={handleChange}
          fieldName={normalizedFieldName}
          fieldClass={fieldClass}
          title={title}
          layoutClass={layoutClass}
          isRequired={isRequired}
          showLabel={showLabel}
        />
      )
    } else {
      let CustomWidget
      if (widgets) {
        CustomWidget = widgets[widget]
      }
      if (!CustomWidget && uiFieldSchema?.['ui:widget']) {
        CustomWidget = uiFieldSchema?.['ui:widget']
      }
      if (CustomWidget) {
        return (
          <div key={fieldName} className={`${layoutClass} m-0`}>
            {showLabel && field?.title && (
              <label className="form-label">
                {title}
                {isRequired && <span>*</span>}
              </label>
            )}
            <CustomWidget
              schema={field}
              uiSchema={uiFieldSchema}
              fieldName={normalizedFieldName}
              value={formData[normalizedFieldName]}
              onChange={handleDefaultFieldChange}
              errors={errors[normalizedFieldName]}
              placeholder={uiFieldSchema?.['ui:placeholder']}
            />
            {errors[normalizedFieldName] &&
              errors[normalizedFieldName].map((error, index) => (
                <p
                  key={index}
                  className="text-danger"
                  style={{ fontSize: '0.875rem', marginTop: 0 }}
                >
                  {error}
                </p>
              ))}
          </div>
        )
      }
    }
  }

  return (
    <div className="w-100 row justify-content-around">
      {Object.keys(schema.properties || {}).map((fieldName, index) => {
        const field = getFieldSchemaByName(schema, fieldName)
        return field ? renderField(field, fieldName) : null
      })}
    </div>
  )
}
