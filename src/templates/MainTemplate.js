    import React from 'react';
    import CustomContentTemplate from './CustomContentTemplate';
    import Button from '@mui/material/Button';

    export default function MainTemplate(props) {
        const { schema, uiSchema, fields, onSubmit, onError, onSuccess, onChange, formData, errors } = props;

        return (
            <div className="d-flex flex-column mw-70 ">
                <header className="text-center mb-4">
                    <h3>{schema.title || 'Default title'}</h3>
                    <p>{schema.description || 'This is default description of form'}</p>
                </header>

                <form
                    onSubmit={onSubmit}
                    className="d-flex mw-70 flex-column bg-light align-items-center justify-content-center p-5 border border-dark border-opacity-25 rounded-4"
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
