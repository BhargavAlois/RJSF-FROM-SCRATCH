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
}) {
  const [preview, setPreview] = useState()
  const [fileDetails, setFileDetails] = useState(null)

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
    const uiLayoutClassNames =
      uiFieldSchema['ui:className'] ||
      uiFieldSchema['ui:classNames'] ||
      uiFieldSchema['classNames'] ||
      uiFieldSchema?.['ui:options']?.classNames ||
      uiFieldSchema?.['ui-options']?.classNames
    const layoutClass = uiLayoutClassNames ? `form-group ${uiLayoutClassNames}` : 'form-group'
    const widget = uiFieldSchema['ui:widget'] || format || 'string'
    const fieldClass = 'form-control'
    const normalizedFieldName = normalizeFieldName(fieldName)

    if (fields) {
      
      if (uiFieldSchema['ui:field']) {
        const Component = fields?.[uiFieldSchema?.['ui:field']]
        return (
          <div className={`${layoutClass}`}>
            <Component key={fieldName} uiSchema={uiFieldSchema} />
          </div>
        )
      }
    } else if (uiFieldSchema['ui:field']) {
      const Component = uiFieldSchema['ui:field']
      return (
        <div className={`${layoutClass}`}>
          <Component key={fieldName} uiSchema={uiFieldSchema} />
        </div>
      )
    } else if (field.type === 'object' && field.properties) {
      return (
        // <div className={`row ${uiFieldSchema?.classNames}`}>
        <div id={`root_${normalizedFieldName}`} key={normalizedFieldName}>
          {title && <legend id={`root_${normalizedFieldName}__title`}>{title}</legend>}
          {field.description && <p style={{ size: '5px' }}>{field?.description}</p>}
          {Object.keys(field.properties).map((nestedFieldName) => {
            const nestedField = field.properties[nestedFieldName]
            const updatedParentSchema = parentSchema.properties[nestedFieldName]
            return renderField(nestedField, `${nestedFieldName}`, updatedParentSchema, fieldPath)
          })}
        </div>
        /* </div> */
      )
    }

    //Implementation of handleDefaultFieldChange where only target value is accepted as parameter
    const handleDefaultFieldChange = (value) => {
      handleChange(normalizedFieldName, value)
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
        // console.log("Found custom widget ", CustomWidget);

        // return <CustomWidget schema={schema.properties[fieldName]} uiSchema={uiSchema[fieldName]} fieldName={fieldName} onChange={(e) => handleChange(fieldName, e)} errors={errors[fieldName]}/>;
        return (
          <div key={fieldName} className={`${layoutClass}`}>
            {field?.title && <label className="form-label">{field?.title}</label>}
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
                  className="text-danger mt-0"
                  style={{ fontSize: '0.875rem', marginTop: 0 }}
                >
                  {error}
                </p>
              ))}
          </div>
        )
      }

      // return <p className="text-danger" style={{fontSize: '0.875em'}}>No such component available</p>;
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
