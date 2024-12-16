import React from 'react';
import CustomContentTemplate from './CustomContentTemplate';
import Button from '@mui/material/Button';

export default function DefaultTemplate(props) {
    const { schema, uiSchema, fields, onSubmit, onError, onSuccess, onChange, formData, errors } = props;

    return (
        <div className="d-flex flex-column" style={{maxWidth : "60%", width: "60%"}}>
            <header className="text-center mb-4">
                <h3>{schema.title || 'Default title'}</h3>
                <p>{schema.description || 'This is default description of form'}</p>
            </header>

            <form
                onSubmit={onSubmit}
                className="d-flex flex-column bg-light align-items-center align-middle justify-content-center p-5 border border-dark border-opacity-25 rounded-4"
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
                <Button variant="contained" className='mt-3' color='primary' type='submit'>Submit</Button>
            </form>

            <footer className="mt-4 text-center">
                {schema.footerContent}
            </footer>
        </div>
    );
}
