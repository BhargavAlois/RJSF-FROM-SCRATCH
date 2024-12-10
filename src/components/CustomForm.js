import React, { useState } from 'react';
import DefaultHeaderTemplate from './DefaultHeaderTemplate';
import DefaultFooterTemplate from './DefaultFooterTemplate';
import DefaultContentTemplate from './DefaultContentTemplate';
import CustomContentTemplate from './CustomContentTemplate';

function CustomForm({ schema, uiSchema, templates, onSubmit }) {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const title = schema.title;
    

    console.log(templates?.header?.props);

    const handleChange = (fieldName, value) => {
        console.log("Handle change from CustomForm");

        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value
        }));

        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: ''
        }))
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
    }

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
        <div>
            <h3>{schema.title}</h3>
            <form onSubmit={handleSubmit} className="border p-4 border-dark">
                {templates?.HeaderTemplate ? <templates.HeaderTemplate /> : <DefaultHeaderTemplate />}
                {/* {templates?.ContentTemplate ?
                    <templates.ContentTemplate
                        formData={formData}
                        handleChange={handleChange}
                        uiSchema={uiSchema}
                        schema={schema}
                        errors={errors}
                    />
                    : <DefaultContentTemplate
                        formData={formData}
                        handleChange={handleChange}
                        uiSchema={uiSchema}
                        schema={schema}
                        errors={errors}
                    />
                } */}
                <CustomContentTemplate formData={formData}
                    handleChange={handleChange}
                    uiSchema={uiSchema}
                    schema={schema}
                    errors={errors} />
                <div className='text-center'>
                    <button type="submit" className='btn btn-primary'>Submit</button>
                </div>
                {templates?.FooterTemplate ? <templates.FooterTemplate /> : <DefaultFooterTemplate />}
            </form>
        </div>
    );
}

export default CustomForm;
