import React, { useState, useEffect } from 'react'
import DefaultTemplate from '../templates/DefaultTemplate'
import { format, parseISO } from 'date-fns'
import ContentTemplate from '../templates/ContentTemplate'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";
import '../mystyles/myStyle.css'

export default function MyForm(props) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const {
    schema,
    uiSchema = {},
    onSubmit,
    onChange,
    onSuccess,
    onError,
    formData: prefilledFormData,
    errorSchema,
  } = props
  const templates = props?.templates
  const templateName = uiSchema?.['template']
  // console.log('Form data : ', formData)
  var MyTemplate
  if (templateName) {
    MyTemplate = templates[templateName]
  }
  const fields = props?.widgets

  const normalizeFieldName = (fieldName) => {
    const parts = fieldName.split('.')
    return parts[parts.length - 1] // Return the last part of the path
  }

  const normalizeData = (schema, data) => {
    const normalizedData = {}

    const processProperties = (properties, data) => {
      // console.log("Data : ", data);
      // console.log("inside process properties");
      Object.keys(properties).forEach((fieldName) => {
        const fieldSchema = properties[fieldName]
        const fieldValue = data?.[fieldName]

        if (fieldSchema.type === 'string' && fieldSchema.format === 'date') {
          const fieldUiSchema = getFieldUiSchema(fieldName, uiSchema)
          const displayFormat = fieldUiSchema?.['ui:options']?.format || 'yyyy/MM/dd'
          try {
            normalizedData[fieldName] = format(parseISO(fieldValue), displayFormat)
          } catch {
            if (data[fieldName]) {
              normalizedData[fieldName] = fieldValue // Fallback to raw value
            }
          }
        } else if (fieldSchema.type === 'object' && fieldSchema.properties) {
          processProperties(fieldSchema.properties, data)
        } else {
          if (data[fieldName] !== undefined && data[fieldName] !== null) {
            normalizedData[fieldName] = fieldValue
          }
        }
      })

      return normalizedData
    }
    return processProperties(schema.properties, data || {})
  }

  useEffect(() => {
    const flattenData = (data, parentKey = '') => {
      let result = {}

      Object.entries(data || {}).forEach(([key, value]) => {
        // Keep only the final part of the key (leaf node)
        const newKey = parentKey ? key : key // Keep just the field name as key

        if (Array.isArray(value)) {
          // If the value is an array, preserve the array structure
          result[newKey] = value
        } else if (typeof value === 'object' && value !== null) {
          // If the value is an object, recursively flatten its properties
          result = { ...result, ...flattenData(value, newKey) }
        } else {
          // If the value is a primitive (string, number, etc.), assign the value directly
          result[newKey] = value
        }
      })

      return result
    }

    const initializeFormData = () => {
      // Extract default data from schema
      const extractDefaults = (schema) => {
        const defaults = {}

        const processSchema = (properties) => {
          Object.entries(properties || {}).forEach(([key, value]) => {
            if (value.type === 'object' && value.properties) {
              defaults[key] = extractDefaults(value) // Recursively process nested objects
            } else if (value.type === 'array' && value.default) {
              defaults[key] = value.default // Handle default arrays
            } else if (value.default !== undefined) {
              defaults[key] = value.default // Handle primitive defaults
            }
          })
        }

        processSchema(schema?.properties)
        return defaults
      }

      // Get default data from schema
      const defaultData = extractDefaults(schema)

      // console.log('Default data : ', defaultData)

      // Flatten the default data
      const flattenedDefaultData = flattenData(defaultData)

      // console.log("Default flattened data : ", flattenedDefaultData);

      // Flatten the prefilled data
      // console.log("Prefilled form data : ", prefilledFormData);
      const flattenedPrefilledData = flattenData(prefilledFormData)
      // console.log("flattenedPrefilledData : ", flattenedPrefilledData);

      // Merge flattened data: prefilled data takes priority over default data
      const mergedData = {
        ...flattenedDefaultData,
        ...flattenedPrefilledData,
      }

      // Normalize the merged data (if needed)
      const normalizedData = normalizeData(schema, mergedData)

      // console.log("Normalized : ", normalizedData);

      // Set form data
      setFormData(normalizedData)
    }

    initializeFormData()
  }, [prefilledFormData, schema])

  const formatDate = (date, formatString) => {
    try {
      let parsedDate = date

      if (typeof date === 'string' && (date.includes('T') || date.includes('Z'))) {
        parsedDate = parseISO(date)
      } else if (!(date instanceof Date)) {
        parsedDate = new Date(date)
      }

      return format(parsedDate, formatString)
    } catch (error) {
      return date
    }
  }

  const getRequiredFields = (schema) => {
    let requiredFields = []

    if (schema.required) {
      requiredFields = requiredFields.concat(schema.required)
    }

    Object.keys(schema.properties).forEach((fieldName) => {
      const field = schema.properties[fieldName]

      if (field.type === 'object' && field.properties) {
        // console.log("Searching required field : ", field);
        const nestedRequiredFields = getRequiredFields(field)
        nestedRequiredFields.forEach((nestedField) => {
          // console.log("nested : ", nestedField);
          // console.log("fieldName : ", fieldName);
          requiredFields.push(`${nestedField}`)
        })
      }
    })

    return requiredFields
  }

  let fieldPath

  function getFieldUiSchema(fieldName, uiSchema) {
    // Base case: if uiSchema is an object and the field exists at the root level
    if (typeof uiSchema === 'object' && uiSchema !== null) {
      if (uiSchema.hasOwnProperty(fieldName)) {
        return uiSchema[fieldName]
      }

      // Recursive case: iterate through nested objects
      for (const key in uiSchema) {
        if (uiSchema[key] && typeof uiSchema[key] === 'object') {
          const result = getFieldUiSchema(fieldName, uiSchema[key])
          if (result) {
            return result
          }
        }
      }
    }

    // Return null if the field is not found
    return null
  }

  const validateForm = () => {
    // console.log("form data : ", formData);
    const formErrors = {}

    // Helper function to validate single field
    const validateField = (fieldName, fieldSchema, value, parentPath = '') => {
      const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName
      const fieldTitle = fieldSchema.title || fieldName
      const errors = []

      // Required field validation
      if (fieldSchema.required || (getRequiredFields(schema) || []).includes(fieldName)) {
        if (value === undefined || value === '' || value === null) {
          errors.push(`${fieldTitle} is required`)
        }
      }

      // String validations
      if (value && fieldSchema.type === 'string') {
        if (fieldSchema.format === 'email') {
          const emailPattern = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
          if (!emailPattern.test(value)) {
            errors.push(`${fieldTitle} must be a valid email address`)
          }
        }
        // Pattern validation
        if (fieldSchema.pattern) {
          const regex = new RegExp(fieldSchema.pattern)
          if (!regex.test(value)) {
            const fieldUiSchema = getFieldUiSchema(fieldName, uiSchema)
            if (fieldUiSchema?.pattern_message && Array.isArray(fieldUiSchema.pattern_message)) {
              // Add specific pattern_message errors
              errors.push(...fieldUiSchema.pattern_message)
            } else {
              // Default error message for invalid format
              errors.push(`${fieldTitle} is not in the correct format`)
            }
          }
        }

        // Length validations
        if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
          errors.push(`${fieldTitle} should have at least ${fieldSchema.minLength} characters`)
        }
        if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
          errors.push(`${fieldTitle} should have no more than ${fieldSchema.maxLength} characters`)
        }

        // Date validation
        if (fieldSchema.format === 'date' && value) {
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            errors.push(`${fieldTitle} must be a valid date`)
          }
          if (fieldSchema.minimum && new Date(value) < new Date(fieldSchema.minimum)) {
            errors.push(`${fieldTitle} must be after ${fieldSchema.minimum}`)
          }
          if (fieldSchema.maximum && new Date(value) > new Date(fieldSchema.maximum)) {
            errors.push(`${fieldTitle} must be before ${fieldSchema.maximum}`)
          }
        }
      }

      // Number validations
      if (value && fieldSchema.type === 'number') {
        if (fieldSchema.minimum !== undefined && value < fieldSchema.minimum) {
          errors.push(`${fieldTitle} must be greater than or equal to ${fieldSchema.minimum}`)
        }
        if (fieldSchema.maximum !== undefined && value > fieldSchema.maximum) {
          errors.push(`${fieldTitle} must be less than or equal to ${fieldSchema.maximum}`)
        }
      }

      // File validations
      const uiOptions = uiSchema[fieldName]?.['ui:options'] || {}
      if (uiOptions.accept && value) {
        let fileType
        if (typeof value === 'string' && value.startsWith('data:')) {
          const mimeTypeMatch = value.match(/data:(.*?);/)
          fileType = mimeTypeMatch?.[1]
        } else if (value instanceof Blob) {
          fileType = value.type
        } else if (typeof value === 'string') {
          const mimeTypeMatch = value.match(/^[^;]+/)
          fileType = mimeTypeMatch?.[0]
        }

        // console.log('File type : ', fileType)
        if (fileType && !uiOptions.accept.includes(fileType)) {
          errors.push(
            `The selected file type (${fileType}) is not supported.`,
            // `${fieldTitle} must be one of the accepted file types: ${uiOptions.accept.join(', ')}`,
          )
        }
      }

      if (errors.length > 0) {
        const normalizedFieldName = normalizeFieldName(fullPath)
        formErrors[normalizedFieldName] = errors
      }
    }

    // Recursive function to handle nested objects
    const validateObject = (objectSchema, parentPath = '') => {
      Object.entries(objectSchema.properties || {}).forEach(([fieldName, fieldSchema]) => {
        const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName // Construct the full path
        const normalizedFieldName = normalizeFieldName(fullPath)
        const value = formData?.[normalizedFieldName] // Use the full path to access the value

        if (fieldSchema.type === 'object') {
          // Recursively validate nested objects
          validateObject(fieldSchema, fullPath)
        } else {
          // Validate individual fields
          validateField(fieldName, fieldSchema, value, parentPath)
        }
      })
    }

    // Start validation from root schema
    validateObject(schema)

    // Set errors in state
    setErrors(formErrors)
    // console.log('Form errors : ', formErrors)
    return Object.keys(formErrors).length === 0
  }

  const defaultSubmit = (e) => {
    e.preventDefault()
    console.log('Default submit called')
  }

  const defaultOnSuccess = (e) => {
    console.log('Submission successfull!')
  }

  const defaultOnError = (e) => {
    console.log('Error occurred!')
  }

  const transformFormData = (schema, flatData) => {
    const buildNestedData = (schemaProperties, flatData, parentKey = '') => {
      const nestedData = {}

      Object.entries(schemaProperties || {}).forEach(([key, value]) => {
        const fullPath = parentKey ? `${parentKey}.${key}` : key

        if (value.type === 'object' && value.properties) {
          // Recursively build nested objects
          nestedData[key] = buildNestedData(value.properties, flatData, fullPath)
        } else {
          // Map flatData to the nested structure
          const normalizedKey = fullPath.split('.').pop()
          if (flatData.hasOwnProperty(normalizedKey)) {
            nestedData[key] = flatData[normalizedKey]
          }
        }
      })

      return nestedData
    }

    return buildNestedData(schema.properties, flatData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log('Form data : ', formData)
    
      if (validateForm()) {
        if (onSuccess) {
          onSuccess()
        } else {
          defaultOnSuccess()
        }
        const transformedData = transformFormData(schema, formData)
        // console.log('Transformed data : ', transformedData)

        // Wrap transformedData as formData inside data
        const data = { formData: transformedData }
        if(onSubmit)
        {
          onSubmit(data, e)
          return
        }
        else
        {
          defaultSubmit(e)
          return
        }
      } else {
        if (onError) {
          onError()
        } else {
          defaultOnError()
        }
        return
      }
    
  }

  const handleChange = (fieldName, value) => {
    // const options = uiSchema[fieldName]['ui:options'];
    // console.log('Change in field : ', fieldName)

    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }))

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: '',
    }))

    if (onChange) {
      onChange(fieldName)
    }
  }

  const submitBtnOptions = uiSchema?.['ui:submitButtonOptions']
  const content = (
    <ContentTemplate
      formData={formData}
      schema={schema}
      uiSchema={uiSchema}
      errors={errors}
      fields={fields}
      onSubmit={handleSubmit}
      onError={onError}
      onChange={handleChange}
      onSuccess={onSuccess}
    />
  )

  if (!MyTemplate) {
    return (
      <DefaultTemplate
        schema={schema}
        uiSchema={uiSchema}
        content={content}
        onSubmit={handleSubmit}
        submitBtnOptions={submitBtnOptions}
      />
    )
  }

  return (
    <MyTemplate
      schema={schema}
      uiSchema={uiSchema}
      content={content}
      onSubmit={handleSubmit}
      submitBtnOptions={submitBtnOptions}
    />
  )
}
