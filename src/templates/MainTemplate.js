import React from 'react';
import Button from '@mui/material/Button';

export default function MainTemplate(props) {
    const { schema, content, onSubmit } = props;

    return (
        <div className="d-flex flex-column" style={{ maxWidth: "60%", width: "60%" }}>
            <header className="text-center mb-4">
                <h3>{schema.title || 'Default title'}</h3>
                <p>{schema.description || 'This is default description of form'}</p>
            </header>

            <form
                onSubmit={onSubmit}
                className="d-flex flex-column bg-light align-items-center align-middle justify-content-center p-5 border border-dark border-opacity-25 rounded-4"
                style={{ overflow: 'auto' }}
            >
                {content}
                <Button
                    variant="contained"
                    className="mt-3"
                    color="primary"
                    type="submit"
                    style={{
                        borderRadius: '20px',
                        padding: '5px 20px',
                        fontWeight: '500', 
                        textTransform: 'none', 
                        transition: 'all 0.3s ease', 
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'} 
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'} 
                >Submit</Button>
            </form>

            <footer className="mt-4 text-center">
                {schema.footerContent}
            </footer>
        </div>
    );
}
