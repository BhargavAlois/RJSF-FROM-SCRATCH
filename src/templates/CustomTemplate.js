import React from 'react';
import Button from '@mui/material/Button';

export default function MainTemplate(props) {
    const { schema, content, onSubmit } = props;

    return (
        <div className="d-flex flex-column" style={{ maxWidth: "60%", width: "60%" }}>
            <header className="mb-4 text-center">
                <h3>{schema.title}</h3>
                <p>{schema.description}</p>
            </header>

            <form
                onSubmit={onSubmit}
                className="d-flex flex-column align-items-center p-5 border border-dark border-opacity-25 rounded-4 shadow"
                style={{ overflow: 'auto' }}
            >
                {content}
                <button
                    className="mt-3"
                    type="submit"
                    style={{
                        border: '2px solid rgb(0, 79, 162)',
                        borderRadius: '2px',
                        padding: '6px',
                        fontWeight: '600',
                        fontSize: '16px',
                        backgroundColor: 'rgb(0, 79, 162)',
                        color: '#fff',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#0056b3';
                        e.target.style.borderColor = '#0056b3';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#007bff';
                        e.target.style.borderColor = '#007bff';
                    }}
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
