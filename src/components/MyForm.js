import React, { useState, useEffect } from 'react'
import DefaultTemplate from '../templates/DefaultTemplate';
import { format, parseISO } from 'date-fns';
import CustomContentTemplate from '../templates/CustomContentTemplate';

export default function MyForm(props) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const { schema, onSubmit, onChange, onSuccess, onError, formData: prefilledFormData, errorSchema } = props;
    const templates = props?.templates;
    const templateName = props?.schema.uiSchema['ui:layout'];
    var MyTemplate;
    if (templateName) {
        MyTemplate = templates[templateName];
    }
    const prefilledData = prefilledFormData;
    const fields = props?.fields;

    function getDeepValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    const convertToSchemaFormat = (schema, data) => {
        const formattedData = {};

        Object.keys(schema.schema.properties).forEach((fieldName) => {
            const field = schema.schema.properties[fieldName];
            console.log("field : ", field);
            const fieldValue = data[fieldName];

            if (field.type === 'string' && field.format === 'date' && fieldValue) {
                const formatString = field['ui:options']?.format || 'yyyy-MM-dd';

                try {
                    let parsedDate;

                    if (fieldValue.includes('T') || fieldValue.includes('Z')) {
                        parsedDate = parseISO(fieldValue);
                    } else {
                        parsedDate = new Date(fieldValue);
                    }

                    formattedData[fieldName] = format(parsedDate, formatString);
                } catch (error) {
                    formattedData[fieldName] = fieldValue;
                }
            } else if (field.type === 'object' && fieldName === 'dateRange') {
                const dateRange = fieldValue || {};

                formattedData[fieldName] = {
                    startDate: dateRange.startDate ? formatDate(dateRange.startDate, field['ui:options']?.format) : '',
                    endDate: dateRange.endDate ? formatDate(dateRange.endDate, field['ui:options']?.format) : '',
                };
            } else {
                formattedData[fieldName] = fieldValue;
            }
        });

        return formattedData;
    };

    const formatDate = (date, formatString) => {
        try {
            let parsedDate = date;

            if (typeof date === 'string' && (date.includes('T') || date.includes('Z'))) {
                parsedDate = parseISO(date);
            } else if (!(date instanceof Date)) {
                parsedDate = new Date(date);
            }

            return format(parsedDate, formatString);
        } catch (error) {
            return date;
        }
    };

    const getRequiredFields = (schema) => {
        let requiredFields = [];

        // If the current schema has required fields, add them to the list
        if (schema.properties.required) {
            requiredFields = requiredFields.concat(schema.required);
        }

        // Recursively check for required fields in nested objects
        Object.keys(schema.properties).forEach((fieldName) => {
            const field = schema.properties[fieldName];
            if (field.type === 'object' && field.properties) {
                requiredFields = requiredFields.concat(getRequiredFields(field));
            }
        });

        return requiredFields;
    };

    const validateForm = () => {
        const formErrors = {};

        // Helper function to validate a single field
        const validateField = (fieldName, field, value, fieldTitle) => {
            // Safeguard: Check if the field exists before accessing its properties
            if (!field) {
                console.warn(`Field '${fieldName}' is missing from the schema. Skipping validation.`);
                return;
            }

            console.log("fieldsssss ------------------", field);
            // Check if the field is required and if it's missing from the form data
            if (field.required && (value === undefined || value === "")) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} is required`);
            }

            // Check pattern for specific fields (e.g., email, phone)
            if (field.pattern && value) {
                const regex = new RegExp(field.pattern);
                if (!regex.test(value)) {
                    if (!formErrors[fieldName]) formErrors[fieldName] = [];
                    formErrors[fieldName].push(`${fieldTitle} is not in the correct format`);
                }
            }

            // Check minLength
            if (field.minLength && value?.length < field.minLength) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should have at least ${field.minLength} characters`);
            }

            // Check maxLength
            if (field.maxLength && value?.length > field.maxLength) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should have no more than ${field.maxLength} characters`);
            }

            // Check minimum value
            if (field.minimum && value < field.minimum) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should be greater than or equal to ${field.minimum}`);
            }

            // Check maximum value
            if (field.maximum && value > field.maximum) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should be less than or equal to ${field.maximum}`);
            }
        };

        // Get all the required fields from the schema (including nested objects)
        const requiredFields = getRequiredFields(schema.schema);

        // Loop through all required fields and validate them
        requiredFields.forEach((field) => {
            const fieldSchema = schema.schema.properties[field];
            const fieldTitle = fieldSchema?.title || field;
            const value = getDeepValue(formData, field);

            validateField(field, fieldSchema, value, fieldTitle);
        });

        // Loop through all fields in the form data for custom validations (non-required fields)
        Object.keys(formData).forEach((fieldName) => {
            const field = schema.schema.properties[fieldName];

            // Check if field exists in the schema before continuing
            if (!field) {
                console.warn(`Field '${fieldName}' not found in schema. Skipping validation.`);
                return;
            }

            const fieldTitle = field.title || fieldName;
            const value = formData[fieldName];

            // Validate nested objects recursively
            if (field.type === 'object' && field.properties) {
                Object.keys(field.properties).forEach((nestedFieldName) => {
                    const nestedField = field.properties[nestedFieldName];
                    const nestedValue = getDeepValue(formData, `${fieldName}.${nestedFieldName}`);
                    const nestedFieldTitle = nestedField.title || nestedFieldName;
                    validateField(`${fieldName}.${nestedFieldName}`, nestedField, nestedValue, nestedFieldTitle);
                });
            } else {
                // Validate normal fields (strings, numbers, etc.)
                validateField(fieldName, field, value, fieldTitle);

                // File type validation for fields with 'ui:options.accept'
                const uiOptions = schema.uiSchema[fieldName]?.['ui:options'] || {};
                if (uiOptions.accept && value) {
                    let fileType;

                    if (typeof value === "string" && value.startsWith("data:")) {
                        const mimeTypeMatch = value.match(/data:(.*?);base64,/);
                        if (mimeTypeMatch && mimeTypeMatch[1]) {
                            fileType = mimeTypeMatch[1];
                        }
                    } else if (value instanceof Blob) {
                        fileType = value.type;
                    }

                    if (fileType && !uiOptions.accept.includes(fileType)) {
                        if (!formErrors[fieldName]) formErrors[fieldName] = [];
                        formErrors[fieldName].push(`${fieldTitle} must be one of the accepted file types: ${uiOptions.accept.join(', ')}`);
                    }
                }
            }
        });

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const defaultSubmit = (e) => {
        e.preventDefault();
        window.alert("Default submit called");
    };

    const defaultOnSuccess = (e) => {
        window.alert("Submission successfull!");
    }

    const defaultOnError = (e) => {
        window.alert("Error occurred!");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            if (validateForm()) {
                if (onSuccess) {
                    onSuccess();
                }
                else {
                    defaultOnSuccess();
                }
                onSubmit(formData);
                return;
            }
            else {
                if (onError) {
                    onError();
                }
                else {
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

    useEffect(() => {
        const initialFormData = convertToSchemaFormat(schema, prefilledData);
        setFormData(initialFormData);
    }, [prefilledData, schema]);

    const handleChange = (fieldName, value) => {
        // const options = uiSchema[fieldName]['ui:options'];
        console.log("value : ", value);
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: ''
        }));

        if (onChange) {
            onChange(fieldName);
        }
    };

    const content = <CustomContentTemplate formData={formData} schema={schema} uiSchema={schema.uiSchema} errors={errors} fields={fields} onSubmit={handleSubmit} onError={onError} onChange={handleChange} onSuccess={onSuccess} />;

    if (!MyTemplate) {
        return <DefaultTemplate schema={schema} uiSchema={schema.uiSchema} content={content} onSubmit={handleSubmit} />;
    }

    return (
        // <MyTemplate schema={schema} uiSchema={uiSchema} fields={fields} onChange={handleChange} onSubmit={handleSubmit} onError={onError} onSuccess={onSuccess} formData={formData} errors={errors} />
        <MyTemplate schema={schema} uiSchema={schema.uiSchema} content={content} onSubmit={handleSubmit} />
    );
}

