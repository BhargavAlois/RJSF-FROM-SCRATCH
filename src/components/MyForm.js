import React from 'react'
import DefaultTemplate from '../templates/DefaultTemplate';

export default function MyForm(props) {
    const templates = props.templates;
    const templateName = props.uiSchema['ui:layout'];    
    const MyTemplate = templates[templateName];

    if (!MyTemplate) {
        return <DefaultTemplate {...props}/>;
    }
    
    return (
        <MyTemplate {...props} />
    );
}

