import React from 'react';
import CustomContentTemplate from './CustomContentTemplate';

export default function MainTemplate(props) {
    const { schema, uiSchema, fields, onSubmit, onError, onSuccess, onChange, formData, errors } = props;

    return (
        <div className="d-flex flex-column mh-100">
            <header className="text-center mb-4">
                <h3>{schema.title || 'Default title'}</h3>
                <p>{schema.description || 'This is default description of form'}</p>
            </header>

            <form
                onSubmit={onSubmit}
                className="w-full d-flex flex-column align-items-center justify-content-center p-4 border border-dark rounded"
                style={{ overflow: 'auto' }}
            >
                <CustomContentTemplate
                    formData={formData}
                    uiSchema={uiSchema}
                    schema={schema}
                    fields={fields}
                    errors={errors}
                    onChange={onChange}
                    onSuccess={onSuccess}
                    onError={onError}
                />
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
