import React, { useState, useEffect } from 'react';
import CustomContentTemplate from '../components/CustomContentTemplate';

export default function MainTemplate(props) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const schema = props.schema;
    const uiSchema = props.uiSchema;
    const onSubmit = props.onSubmit;

    const initializeFormData = (schema) => {
        const initialData = {};
      
        Object.keys(schema.properties).forEach((fieldName) => {
          const field = schema.properties[fieldName];
          
          if (fieldName === 'dateRange') {
            const dateRange = field.properties || {};
            initialData['startDate'] = dateRange.startDate?.default || '';
            initialData['endDate'] = dateRange.endDate?.default || '';
          } else if (field.default) {
            initialData[fieldName] = field.default;
          } else if (field.type === "object" && field.properties) {
            initialData[fieldName] = initializeFormData(field); // Recursively handle nested objects
          } else if (field.type === "array" && field.items && field.items.enum) {
            initialData[fieldName] = [];
          }
        });
      
        return initialData;
      };

    useEffect(() => {
        const initialFormData = initializeFormData(schema);
        setFormData(initialFormData);
    }, [schema]);

    const handleChange = (fieldName, value) => {
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
        const formErrors = {};

        schema.required?.forEach((field) => {
            if (field === 'dateRange') {
                if (!formData.startDate || !formData.endDate) {
                    formErrors['dateRange'] = "Start Date and End Date are required";
                }
            } else if (field === 'preferences' && (!formData[field] || formData[field].length === 0)) {
                formErrors[field] = `${field} is required`;
            } else if (formData[field] === undefined || formData[field] === '') {
                formErrors[field] = `${field} is required`;
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
            }
            return;
        }
        defaultSubmit(e);
    };

    return (
        <div className="d-flex flex-column mh-100">
            <header className="text-center mb-4">
                <h3>{props.schema.title || 'Default title'}</h3>
                <p>{props.schema.description || 'This is default description of form'}</p>
            </header>

            <form 
                onSubmit={handleSubmit}
                className="d-flex flex-column align-items-center justify-content-center p-4 border border-dark rounded"
                style={{ overflow: 'auto' }}
            >
                <div className="d-flex flex-column justify-content-between">
                    <CustomContentTemplate 
                        formData={formData}
                        handleChange={handleChange}
                        uiSchema={uiSchema}
                        schema={schema}
                        errors={errors}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary mt-3 w-25"
                    style={{ maxWidth: '100px'}}
                >
                    Submit
                </button>
            </form>

            <footer className="mt-4 text-center">
                {props.schema.footerContent}
            </footer>
        </div>
    );
}

