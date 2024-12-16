import React, { useState, useEffect } from 'react'
import DefaultTemplate from '../templates/DefaultTemplate';

export default function MyForm(props) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const { schema, uiSchema, onSubmit, onChange, onSuccess, onError, formData: prefilledFormData } = props;
    const templates = props.templates;
    const templateName = props.uiSchema['ui:layout'];    
    const MyTemplate = templates[templateName];
    const prefilledData = prefilledFormData;
    const fields = props.fields;

    const validateForm = () => {
        console.log("Validate : ", formData);
        const formErrors = {};

        //Below errors are generated for required validations
        schema.required?.forEach((field) => {
            const fieldTitle = schema.properties[field]['title'];

            if (field === 'dateRange') {
                const { startDate, endDate } = formData.dateRange || {};
                if (!startDate || !endDate) {
                    if (!formErrors['dateRange']) formErrors['dateRange'] = [];
                    formErrors['dateRange'].push("Start Date and End Date are required");
                }
            } else if (field === 'preferences' && (!formData[field] || formData[field].length === 0 || formData[field] === null)) {
                if (!formErrors[field]) formErrors[field] = [];
                formErrors[field].push(`${fieldTitle} is required`);
            } else if (formData[field] === undefined || formData[field] === '') {
                if (!formErrors[field]) formErrors[field] = [];
                formErrors[field].push(`${fieldTitle} is required`);
            }
        });

        //These errors are generated for other validations such as minLength, maxLength, etc..
        Object.keys(formData).forEach((fieldName) => {
            const field = schema.properties[fieldName];
            const fieldTitle = field['title'];

            if (field?.pattern) {
                const regex = new RegExp(field.pattern);
                if (!regex.test(formData[fieldName])) {
                    if (!formErrors[fieldName]) formErrors[fieldName] = [];
                    formErrors[fieldName].push(`${fieldTitle} is not in the correct format`);
                }
            }

            if (field?.minLength && formData[fieldName]?.length < field.minLength) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should have at least ${field.minLength} characters`);
            }

            if (field?.maxLength && formData[fieldName]?.length > field.maxLength) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should have no more than ${field.maxLength} characters`);
            }

            if (field?.minimum && formData[fieldName] < field.minimum) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should be greater than or equal to ${field.minimum}`);
            }

            if (field?.maximum && formData[fieldName] > field.maximum) {
                if (!formErrors[fieldName]) formErrors[fieldName] = [];
                formErrors[fieldName].push(`${fieldTitle} should be less than or equal to ${field.maximum}`);
            }

            const uiOptions = uiSchema[fieldName]?.['ui:options'] || {};

            if (uiOptions?.accept && formData[fieldName]) {
                let fileType;
            
                const file = formData[fieldName];
                
                if (typeof file === "string" && file.startsWith("data:")) {
                    const mimeTypeMatch = file.match(/data:(.*?);base64,/);
                    if (mimeTypeMatch && mimeTypeMatch[1]) {
                        fileType = mimeTypeMatch[1];
                    }
                } else if (file instanceof Blob) {
                    fileType = file.type;
                }
            
                if (fileType && !uiOptions.accept.includes(fileType)) {
                    if (!formErrors[fieldName]) formErrors[fieldName] = [];
                    formErrors[fieldName].push(`${fieldTitle} must be one of the accepted file types: ${uiOptions.accept.join(', ')}`);
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
                else
                {
                    defaultOnError();
                }
                return;
            }
        }
        defaultSubmit(e);
    };

    const initializeFormData = (schema) => {
        const initialData = {};

        Object.keys(schema.properties).forEach((fieldName) => {
            const field = schema.properties[fieldName];

            const prefilledValue = prefilledData?.[fieldName];
            if (prefilledValue !== undefined) {
                initialData[fieldName] = prefilledValue;
            } else if (fieldName === 'dateRange') {
                const dateRange = field.properties || {};
                initialData['dateRange'] = {
                    startDate: prefilledData?.startDate || dateRange.startDate?.default || '',
                    endDate: prefilledData?.endDate || dateRange.endDate?.default || ''
                };
            } else if (field.default !== undefined) {
                initialData[fieldName] = field.default;
            } else if (field.type === "object" && field.properties) {
                initialData[fieldName] = initializeFormData(field);
            } else if (field.type === "array" && field.items && field.items.enum) {
                initialData[fieldName] = [];
            }
        });

        return initialData;
    };

    useEffect(() => {
        const initialFormData = initializeFormData(schema);
        setFormData(initialFormData);
    }, []);

    const handleChange = (fieldName, value) => {
        const options = uiSchema[fieldName]['ui:options'];

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

    if (!MyTemplate) {
        return <DefaultTemplate schema={schema} uiSchema={uiSchema} fields={fields} onChange={handleChange} onSubmit={handleSubmit} onError={onError} onSuccess={onSuccess} formData={formData} errors={errors}/>;
    }
    
    return (
        <MyTemplate schema={schema} uiSchema={uiSchema} fields={fields} onChange={handleChange} onSubmit={handleSubmit} onError={onError} onSuccess={onSuccess} formData={formData} errors={errors} />
    );
}

