import React from 'react'

export default function MyForm(props) {
    const templates = props.templates;
    console.log("Template in templates ", templates);
    console.log("Name in uiSchema", props.uiSchema['ui:layout']);
    const templateName = props.uiSchema['ui:layout'];
    
    const MyTemplate = templates[templateName];

    if (!MyTemplate) {
        return <div>Error: Template not found!</div>;
    }

    console.log("Template to render : ", MyTemplate);
    
    return (
        <MyTemplate {...props} />
    );
}

