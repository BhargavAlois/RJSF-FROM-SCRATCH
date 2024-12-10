import React, { useState } from 'react';
import CustomContentTemplate from '../components/CustomContentTemplate';

export default function MainTemplate(props) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const schema = props.schema;
    const uiSchema = props.uiSchema;
    const onSubmit = props.onSubmit;

    const handleChange = (fieldName, value) => {
        console.log("Handle change from CustomForm");
        
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
            }
            else if (field === 'preferences' && (!formData[field] || formData[field].length === 0)) {
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
                className="d-flex flex-column align-items-center justify-content-center w-100 p-4 border border-dark rounded"
                style={{ overflow: 'auto' }}
            >
                <div className="w-100 d-flex flex-column justify-content-between">
                    <CustomContentTemplate 
                        formData={formData}
                        handleChange={handleChange}
                        uiSchema={uiSchema}
                        schema={schema}
                        errors={errors}
                    />
                </div>
                
                {/* Submit button in center */}
                <button 
                    type="submit" 
                    className="btn btn-primary mt-3 w-100 w-md-auto text-center"
                    style={{ maxWidth: '200px' }}
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
