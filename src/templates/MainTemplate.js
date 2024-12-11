import React, { useState, useEffect } from 'react';
import CustomContentTemplate from './CustomContentTemplate';

export default function MainTemplate(props) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const { schema, uiSchema, onSubmit, onChange, onSuccess, onError } = props;

    const prefilledData = {
        email: "alice.smith@example.com",
        preferences: ["Music", "Reading"],
        // firstName: "Alice",
        // lastName: "Smith",
        // startDate: "2024-01-01",
        // endDate: "2024-12-31"
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
        console.log("handle change ", formData);
        onChange(fieldName);
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: ''
        }));
    };

    const validateForm = () => {
        console.log("Validate : ", formData);
        const formErrors = {};
    
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
    
        Object.keys(formData).forEach((fieldName) => {
            const field = schema.properties[fieldName];
            const fieldTitle = field['title'];
            console.log("Main temp field : ", field);
    
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
        });
    
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };
    

    const defaultSubmit = (e) => {
        e.preventDefault();
        window.alert("Default called");
    };

    const handleSubmit = (e) => {
        console.log("submit clicked");
        e.preventDefault();
        if (onSubmit) {
            if (validateForm()) {
                onSubmit(formData);
                onSuccess();
            }
            else
            {
                onError();
                return;
            }
        }
        defaultSubmit(e);
    };

    return (
        <div className="d-flex flex-column mh-100">
            <header className="text-center mb-4">
                <h3>{schema.title || 'Default title'}</h3>
                <p>{schema.description || 'This is default description of form'}</p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="w-full d-flex flex-column align-items-center justify-content-center p-4 border border-dark rounded"
                style={{ overflow: 'auto' }}
            >
                {/* <div className="d-flex flex-column justify-content-between"> */}
                    <CustomContentTemplate
                        formData={formData}
                        handleChange={handleChange}
                        uiSchema={uiSchema}
                        schema={schema}
                        errors={errors}
                        onChange={onChange}
                        onSuccess={onSuccess}
                        onError={onError}
                    />
                {/* </div> */}
                <button
                    type="submit"
                    className="btn btn-primary mt-3 w-25"
                    style={{ maxWidth: '100px' }}
                >
                    Submit
                </button>
            </form>

            <footer className="mt-4 text-center">
                {schema.footerContent}
            </footer>
        </div>
    );
}
