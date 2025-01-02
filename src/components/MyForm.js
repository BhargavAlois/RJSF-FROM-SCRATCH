import React, { useState, useEffect } from "react";
import DefaultTemplate from "../templates/DefaultTemplate";
import { format, parseISO } from "date-fns";
import CustomContentTemplate from "../templates/CustomContentTemplate";

export default function MyForm(props) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const {
    schemaModel,
    onSubmit,
    onChange,
    onSuccess,
    onError,
    formData: prefilledFormData,
    errorSchema,
  } = props;
  const templates = props?.templates;
  const templateName = props?.schemaModel.uiSchema["template"];
  var MyTemplate;
  if (templateName) {
    MyTemplate = templates[templateName];
  }
  const prefilledData = prefilledFormData;
  const fields = props?.fields;

  // const convertToSchemaFormat = (schema, data) => {
  //     const formattedData = {};

  //     // Check if schema and properties are defined
  //     if (!schema.schema || !schema.schema.properties) {
  //         console.error("Schema or schema.properties is undefined", schema);
  //         return formattedData;  // Return an empty object if properties are missing
  //     }

  //     // Loop through all properties in the schema
  //     Object.keys(schema.schema.properties).forEach((fieldName) => {
  //         const field = schema.schema.properties[fieldName];
  //         const fieldValue = data ? data[fieldName] : undefined;

  //         console.log("field name : ", fieldName);

  //         // Check if field has properties and if it's an object type
  //         if (field.type === 'string' && field.format === 'date' && fieldValue) {
  //             const formatString = field['ui:options']?.format || 'yyyy-MM-dd';
  //             try {
  //                 let parsedDate;

  //                 // Handle ISO date strings or standard date formats
  //                 if (fieldValue.includes('T') || fieldValue.includes('Z')) {
  //                     parsedDate = parseISO(fieldValue);
  //                 } else {
  //                     parsedDate = new Date(fieldValue);
  //                 }

  //                 formattedData[fieldName] = format(parsedDate, formatString);
  //             } catch (error) {
  //                 formattedData[fieldName] = fieldValue; // If there's an error, return the raw value
  //             }
  //         }
  //         // If the field is a nested object, handle it recursively
  //         else if (field.type === 'object' && field.properties) {
  //             formattedData[fieldName] = convertToSchemaFormat(field, fieldValue || {});  // Recursively handle nested objects
  //         }
  //         // If it's a simple field, just assign the value
  //         else {
  //             formattedData[fieldName] = fieldValue;
  //         }
  //     });

  //     return formattedData;
  // };

  const convertToSchemaFormat = (schemaModel, data) => {
    const formattedData = {};

    Object.keys(prefilledData).map((fieldName) => {
      formData[fieldName] = prefilledData[fieldName];
    });

    console.log("Form data : ", formData);

    // Helper function to process nested objects
    const processProperties = (properties, data, parentPath = "") => {
      Object.keys(properties).forEach((fieldName) => {
        const fieldSchema = properties[fieldName];
        const fieldValue = data?.[fieldName];
        console.log("field Name : ", fieldName);
        const fullPath = parentPath ? `${fieldName}` : fieldName;

        // If the field is an object, recursively process its properties
        if (fieldSchema.type === "object" && fieldSchema.properties) {
          formattedData[fullPath] = processProperties(
            fieldSchema.properties,
            fieldValue,
            fullPath
          );
        } else {
          // For simple fields, handle specific cases (e.g., date formatting)
          if (
            fieldSchema.type === "string" &&
            fieldSchema.format === "date" &&
            fieldValue
          ) {
            const formatString =
              fieldSchema["ui:options"]?.format || "yyyy-MM-dd";
            try {
              let parsedDate;
              if (fieldValue.includes("T") || fieldValue.includes("Z")) {
                parsedDate = parseISO(fieldValue);
              } else {
                parsedDate = new Date(fieldValue);
              }
              formattedData[fullPath] = format(parsedDate, formatString);
            } catch (error) {
              formattedData[fullPath] = fieldValue;
            }
          } else if (
            fieldName === "dateRange" &&
            fieldSchema.type === "object"
          ) {
            // Handle special case for `dateRange` object field
            const dateRange = fieldValue || {};
            formattedData[fullPath] = {
              startDate: dateRange.startDate
                ? formatDate(
                    dateRange.startDate,
                    fieldSchema["ui:options"]?.format
                  )
                : "",
              endDate: dateRange.endDate
                ? formatDate(
                    dateRange.endDate,
                    fieldSchema["ui:options"]?.format
                  )
                : "",
            };
          } else {
            // Default handling for other fields
            formattedData[fullPath] = fieldValue;
          }
        }
      });

      console.log("Formatted data : ", formattedData);
      return formattedData;
    };

    // Process the top-level schema properties
    return processProperties(schemaModel.schema.properties, data);
  };

  //Code working with displaying errors
  // const convertToSchemaFormat = (schema, data) => {
  //     const formattedData = {};

  //     Object.keys(schema.schema.properties).forEach((fieldName) => {
  //         const field = schema.schema.properties[fieldName];
  //         const fieldValue = data[fieldName];

  //         if (field.type === 'string' && field.format === 'date' && fieldValue) {
  //             const formatString = field['ui:options']?.format || 'yyyy-MM-dd';
  //             try {
  //                 let parsedDate;
  //                 if (fieldValue.includes('T') || fieldValue.includes('Z')) {
  //                     parsedDate = parseISO(fieldValue);
  //                 } else {
  //                     parsedDate = new Date(fieldValue);
  //                 }
  //                 formattedData[fieldName] = format(parsedDate, formatString);
  //             } catch (error) {
  //                 formattedData[fieldName] = fieldValue;
  //             }
  //         } else if (field.type === 'object' && fieldName === 'dateRange') {
  //             const dateRange = fieldValue || {};
  //             formattedData[fieldName] = {
  //                 startDate: dateRange.startDate ? formatDate(dateRange.startDate, field['ui:options']?.format) : '',
  //                 endDate: dateRange.endDate ? formatDate(dateRange.endDate, field['ui:options']?.format) : '',
  //             };
  //         } else {
  //             formattedData[fieldName] = fieldValue;
  //         }
  //     });

  //     return formattedData;
  // };

  const formatDate = (date, formatString) => {
    try {
      let parsedDate = date;

      if (
        typeof date === "string" &&
        (date.includes("T") || date.includes("Z"))
      ) {
        parsedDate = parseISO(date);
      } else if (!(date instanceof Date)) {
        parsedDate = new Date(date);
      }

      return format(parsedDate, formatString);
    } catch (error) {
      return date;
    }
  };

  const getRequiredFields = (schemaModel) => {
    let requiredFields = [];

    if (schemaModel.required) {
      requiredFields = requiredFields.concat(schemaModel.required);
    }

    Object.keys(schemaModel.properties).forEach((fieldName) => {
      const field = schemaModel.properties[fieldName];

      if (field.type === "object" && field.properties) {
        // console.log("Searching required field : ", field);
        const nestedRequiredFields = getRequiredFields(field);
        nestedRequiredFields.forEach((nestedField) => {
          // console.log("nested : ", nestedField);
          // console.log("fieldName : ", fieldName);
          requiredFields.push(`${nestedField}`);
        });
      }
    });

    return requiredFields;
  };

  let fieldPath;

  function getFieldUiSchema(fieldName, uiSchema) {
    // Base case: if uiSchema is an object and the field exists at the root level
    if (typeof uiSchema === "object" && uiSchema !== null) {
      if (uiSchema.hasOwnProperty(fieldName)) {
        return uiSchema[fieldName];
      }

      // Recursive case: iterate through nested objects
      for (const key in uiSchema) {
        if (uiSchema[key] && typeof uiSchema[key] === "object") {
          const result = getFieldUiSchema(fieldName, uiSchema[key]);
          if (result) {
            return result;
          }
        }
      }
    }

    // Return null if the field is not found
    return null;
  }

  const validateForm = () => {
    // console.log("form data : ", formData);
    const formErrors = {};

    // Helper function to validate single field
    const validateField = (fieldName, fieldSchema, value, parentPath = "") => {
      console.log("value inside validate field : ", value);
      const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;
      console.log("Full path : ", fullPath);
      const fieldTitle = fieldSchema.title || fieldName;
      const errors = [];
      // console.log("fieldSchema : ", fieldSchema);
      // console.log(`field schema from validate fields for ${fieldName} : ${fieldSchema} and value is ${value}`);
      // Required field validation
      if (
        fieldSchema.required ||
        (getRequiredFields(schemaModel.schema) || []).includes(fieldName)
      ) {
        if (value === undefined || value === "" || value === null) {
          // console.log("Inside required validation");
          errors.push(`${fieldTitle} is required`);
        }
      }

      // String validations
      if (value && fieldSchema.type === "string") {
        // Pattern validation
        if (fieldSchema.pattern) {
          const regex = new RegExp(fieldSchema.pattern);
          if (!regex.test(value)) {
            const fieldUiSchema = getFieldUiSchema(
              fieldName,
              schemaModel.uiSchema
            );
            errors.push(`${fieldTitle} is not in the correct format`);
          }
        }

        // Length validations
        if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
          console.log("Inside minlength");
          errors.push(
            `${fieldTitle} should have at least ${fieldSchema.minLength} characters`
          );
        }
        if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
          errors.push(
            `${fieldTitle} should have no more than ${fieldSchema.maxLength} characters`
          );
        }

        // Date validation
        if (fieldSchema.format === "date" && value) {
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push(`${fieldTitle} must be a valid date`);
          }
          if (
            fieldSchema.minimum &&
            new Date(value) < new Date(fieldSchema.minimum)
          ) {
            errors.push(`${fieldTitle} must be after ${fieldSchema.minimum}`);
          }
          if (
            fieldSchema.maximum &&
            new Date(value) > new Date(fieldSchema.maximum)
          ) {
            errors.push(`${fieldTitle} must be before ${fieldSchema.maximum}`);
          }
        }
      }

      // Number validations
      if (value && fieldSchema.type === "number") {
        if (fieldSchema.minimum !== undefined && value < fieldSchema.minimum) {
          errors.push(
            `${fieldTitle} must be greater than or equal to ${fieldSchema.minimum}`
          );
        }
        if (fieldSchema.maximum !== undefined && value > fieldSchema.maximum) {
          errors.push(
            `${fieldTitle} must be less than or equal to ${fieldSchema.maximum}`
          );
        }
      }

      // File validations
      const uiOptions = schemaModel.uiSchema[fieldName]?.["ui:options"] || {};
      if (uiOptions.accept && value) {
        let fileType;
        if (typeof value === "string" && value.startsWith("data:")) {
          const mimeTypeMatch = value.match(/data:(.*?);base64,/);
          fileType = mimeTypeMatch?.[1];
        } else if (value instanceof Blob) {
          fileType = value.type;
        }
        if (fileType && !uiOptions.accept.includes(fileType)) {
          errors.push(
            `${fieldTitle} must be one of the accepted file types: ${uiOptions.accept.join(
              ", "
            )}`
          );
        }
      }

      const fieldUiSchema = getFieldUiSchema(fieldName, schemaModel.uiSchema);
      if (errors.length > 0) {
        if (
          fieldUiSchema?.pattern_message &&
          Array.isArray(fieldUiSchema.pattern_message)
        ) {
          errors.push(...fieldUiSchema.pattern_message);
        }
        formErrors[fullPath] = errors;
      }

      console.log("Errors from myform : ", formErrors[fullPath]);
    };

    // Recursive function to handle nested objects
    const validateObject = (objectSchema, parentPath = "") => {
      Object.entries(objectSchema.properties || {}).forEach(
        ([fieldName, fieldSchema]) => {
          const fullPath = parentPath
            ? `${parentPath}.${fieldName}`
            : fieldName; // Construct the full path
          const value = formData?.[fullPath]; // Use the full path to access the value

          console.log(`${fullPath} : ${value}`);

          if (fieldSchema.type === "object") {
            // Recursively validate nested objects
            validateObject(fieldSchema, fullPath);
          } else {
            // Validate individual fields
            validateField(fieldName, fieldSchema, value, parentPath);
          }
        }
      );
    };

    // Start validation from root schema
    validateObject(schemaModel.schema);

    // Set errors in state
    setErrors(formErrors);
    console.log("Form errors : ", formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const defaultSubmit = (e) => {
    e.preventDefault();
    window.alert("Default submit called");
  };

  const defaultOnSuccess = (e) => {
    window.alert("Submission successfull!");
  };

  const defaultOnError = (e) => {
    window.alert("Error occurred!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data : ", formData);
    if (onSubmit) {
      if (validateForm()) {
        if (onSuccess) {
          onSuccess();
        } else {
          defaultOnSuccess();
        }
        onSubmit(formData);
        return;
      } else {
        if (onError) {
          onError();
        } else {
          defaultOnError();
        }
        return;
      }
    }
    defaultSubmit(e);
  };

  // const initializeFormData = (schema) => {
  //     const initialData = {};

  //     Object.keys(schema.properties).forEach((fieldName) => {
  //         const field = schema.properties[fieldName];

  //         const prefilledValue = prefilledData?.[fieldName];
  //         if (prefilledValue !== undefined) {
  //             initialData[fieldName] = prefilledValue;
  //         } else if (fieldName === 'dateRange') {
  //             const dateRange = field.properties || {};
  //             initialData['dateRange'] = {
  //                 startDate: prefilledData?.startDate || dateRange.startDate?.default || '',
  //                 endDate: prefilledData?.endDate || dateRange.endDate?.default || ''
  //             };
  //         } else if (field.default !== undefined) {
  //             initialData[fieldName] = field.default;
  //         } else if (field.type === "object" && field.properties) {
  //             initialData[fieldName] = initializeFormData(field);
  //         } else if (field.type === "array" && field.items && field.items.enum) {
  //             initialData[fieldName] = [];
  //         }
  //     });

  //     return initialData;
  // };

  // useEffect(() => {
  //     if (prefilledData) {
  //         const initialFormData = convertToSchemaFormat(schema, prefilledData);
  //         setFormData(initialFormData);
  //     }
  // }, [prefilledData, schema]);

  const handleChange = (fieldName, value) => {
    // const options = uiSchema[fieldName]['ui:options'];
    console.log("Change in field : ", fieldName);
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: "",
    }));

    if (onChange) {
      onChange(fieldName);
    }
  };

  const content = (
    <CustomContentTemplate
      formData={formData}
      schemaModel={schemaModel}
      uiSchema={schemaModel.uiSchema}
      errors={errors}
      fields={fields}
      onSubmit={handleSubmit}
      onError={onError}
      onChange={handleChange}
      onSuccess={onSuccess}
    />
  );

  if (!MyTemplate) {
    return (
      <DefaultTemplate
        schemaModel={schemaModel}
        uiSchema={schemaModel.uiSchema}
        content={content}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    // <MyTemplate schema={schema} uiSchema={uiSchema} fields={fields} onChange={handleChange} onSubmit={handleSubmit} onError={onError} onSuccess={onSuccess} formData={formData} errors={errors} />
    <MyTemplate
      schemaModel={schemaModel}
      uiSchema={schemaModel.uiSchema}
      content={content}
      onSubmit={handleSubmit}
    />
  );
}
