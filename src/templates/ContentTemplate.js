import React, { useState } from 'react'
import { format } from 'date-fns'
import * as formFields from '../formFields/InputFieldsExports'

export default function ContentTemplate({
  formData,
  schema,
  uiSchema,
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
    // console.log("fieldName : ", fieldName);
    const uiField = getDeepValue(uiSchema, fieldPath) || {}
    const fieldClass = `form-control ${uiField['classNames']}`
    const widget = uiField['ui:widget'] || format || 'string'
    // console.log("Widget : ", widget);
    const layoutClass = uiField['ui:layout']
    const isColumnLayout = uiField['ui:layout'] === 'column'
    const colClass = uiField?.['ui:col'] ? `col-${uiField['ui:col']}` : 'w-100';
    const normalizedFieldName = normalizeFieldName(fieldName)

    if (field.type === 'object' && field.properties) {
      return (
        // <div className={`row ${uiField?.classNames}`}>
        <>
          <h5 className="mt-3">{title || fieldName}</h5>
          <p style={{ size: '5px' }}>{field?.description}</p>
          {Object.keys(field.properties).map((nestedFieldName) => {
            const nestedField = field.properties[nestedFieldName]
            const updatedParentSchema = parentSchema.properties[nestedFieldName]
            return renderField(nestedField, `${nestedFieldName}`, updatedParentSchema, fieldPath)
          })}
        </>
        /* </div> */
      )
    }

    // const handleDefaultFieldChange = (e) => {
    //   // if (f_name) {
    //   //   console.log("inside f_name");
    //   //   if (e.target?.files) {
    //   //     handleChange(f_name, e.target.files[0]);
    //   //   }
    //   //   else {
    //   //     handleChange(f_name, e.target.value);
    //   //   }
    //   // }
    //   const inputType = e.target?.files ? 'file' : 'other';
    //   console.log("input type : ", inputType);
    //   if (inputType === 'file') {
    //     const outputFormat = uiField['ui:options']['output'];
    //     const file = e.target.files[0];
    //     if (outputFormat === 'base64') {
    //       convertToBase64(file);
    //     } else {
    //       handleChange(fieldName, file);
    //     }
    //   } else {
    //     console.log("Inside default handle");
    //     handleChange(e.target.name, e.target.value);
    //   }

    // };

    //Implementation of handleDefaultFieldChange where only target value is accepted as parameter
    const handleDefaultFieldChange = (value) => {
      console.log(`${normalizedFieldName} : ${value}`);
      handleChange(normalizedFieldName, value)
    }

    const inputFields = {
      string: formFields.TextInput,
      text: formFields.TextInput,
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
      updown: formFields.UpDownInput,
      year: formFields.YearInput,
      numberEnum: formFields.RadioInput,
      textarea: formFields.TextArea,
    }

    const Component = inputFields[widget]
    if (Component) {
      return (
        <Component
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
          field={field}
          uiField={uiField}
          errors={errors}
          handleChange={handleChange}
          fieldName={normalizedFieldName}
          colClass={colClass}
          title={title}
          fieldClass={fieldClass}
        />
      )
    } else {
      if (fields) {
        const CustomField = fields[widget]
        if (CustomField) {
          console.log(`Value for ${normalizedFieldName} : ${formData[normalizedFieldName]}`);
          // return <CustomField schema={schema.properties[fieldName]} uiSchema={uiSchema[fieldName]} fieldName={fieldName} onChange={(e) => handleChange(fieldName, e)} errors={errors[fieldName]}/>;
          return (
            <div className={`${colClass}`}>
              <label className='form-label'>{field?.title}</label>
              <CustomField
                schema={field}
                uiSchema={uiField}
                fieldName={normalizedFieldName}
                value={formData[normalizedFieldName]}
                onChange={handleDefaultFieldChange}
                errors={errors[normalizedFieldName]}
                placeholder={uiField?.['ui:placeholder']}
              />
              {errors[normalizedFieldName] && (
                <div>
                  {errors[normalizedFieldName].map((error, index) => (
                    <p key={index} className="text-danger" style={{fontSize: '0.875rem'}}>
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        }
      }
      // return <p className="text-danger" style={{fontSize: '0.875em'}}>No such component available</p>;
    }
  }

  const renderSections = () => {
    const layout = uiSchema.layout || []

    if (!layout || layout.length === 0) {
      // Fallback to normal rendering when layout is not provided
      return Object.keys(schema.properties || {}).map((fieldName, index) => {
        const field = getFieldSchemaByName(schema, fieldName)
        return field ? renderField(field, fieldName) : null
      })
    }

    return layout.map((section, index) => {
      const { title, classNames, fields } = section
      return (
        <div key={index} className="section-container w-100">
          {title && <h5 className="section-title">{title}</h5>}
          <div className={`fields-container ${classNames}`}>
            {fields.map((fieldPathOrSection, fieldIndex) => {
              if (typeof fieldPathOrSection === 'string') {
                const fieldName = fieldPathOrSection.split('.').pop()
                const field = getFieldSchemaByName(schema, fieldName)
                if (field) {
                  return renderField(field, fieldPathOrSection)
                }
              } else if (
                typeof fieldPathOrSection === 'object' &&
                fieldPathOrSection.type === 'section'
              ) {
                return (
                  <div key={fieldIndex} className={`${fieldPathOrSection.classNames}`}>
                    {fieldPathOrSection.title && <h6>{fieldPathOrSection.title}</h6>}
                    {fieldPathOrSection.fields.map((nestedField) => {
                      const nestedFieldName = nestedField.split('.').pop()
                      const nestedFieldSchema = getFieldSchemaByName(schema, nestedFieldName)
                      return nestedFieldSchema ? renderField(nestedFieldSchema, nestedField) : null
                    })}
                  </div>
                )
              }
              console.warn(`Unknown field type: ${fieldPathOrSection}`)
            })}
          </div>
        </div>
      )
    })
  }

  return renderSections()
}
