import React from 'react';
import Button from '@mui/material/Button';

export default function MainTemplate(props) {
    const { schema, content, onSubmit } = props;

    return (
        <div className="d-flex flex-column w-100">
            <header className="text-center mb-4">
                <h3>{schema.title}</h3>
                <p style={{fontSize: '15px', fontStyle: 'normal', fontWeight: 'normal'}}>{schema.description}</p>
            </header>

            <form
                onSubmit={onSubmit}
                className="bg-light d-flex flex-column align-items-center justify-content-center p-5 border border-dark border-opacity-25 rounded-4 shadow needs-validation"
                style={{ overflow: 'auto' }}
            >
                {content}
                {/* <Button
                    variant="contained"
                    className="mt-3"
                    color="primary"
                    type="submit"
                    style={{
                        borderRadius: '10px',
                        padding: '5px 20px',
                        fontWeight: '500', 
                        textTransform: 'none', 
                        transition: 'all 0.3s ease', 
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'} 
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'} 
                >Submit</Button> */}
                <button type='submit' className="primaryButton">Submit</button>
            </form>

            <footer className="mt-4 text-center">
                {schema.footerContent}
            </footer>
        </div>
    );
}
