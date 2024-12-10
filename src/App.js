import React, { useState } from 'react';
import MyForm from './components/MyForm';
import { schema } from './schemas/schema';
import { uiSchema } from './schemas/uiSchema';
import MainTemplate from './templates/MainTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
  const [formData, setFormData] = useState({});

  const renderFormData = () => {

    console.log("data submitted : ", formData);

    return Object.keys(formData).map((key) => {
      const value = formData[key];

      if (key === 'startDate' && value) {
        const formattedStartDate = value ? new Date(value).toLocaleDateString() : '';
        return (
          <p key={key}>
            <strong>From :</strong> {formattedStartDate}
          </p>
        );
      }

      if (key === 'endDate' && value) {
        const formattedEndDate = value ? new Date(value).toLocaleDateString() : '';
        return (
          <p key={key}>
            <strong>to :</strong> {formattedEndDate}
          </p>
        );
      }

      if (key === 'date' && value) {
        return (
          <p key={key}>
            <strong>{schema.properties[key]?.title}:</strong> {new Date(value).toLocaleDateString()}
          </p>
        );
      }

      const field = schema.properties[key];
      console.log("Field : ", field);
      return (
        field ? (
          <p key={key}>
            <strong>{field.title}:</strong> {value}
          </p>
        ) : null
      );
    });
  };

  const templates = {
    myCustomRowTemplate: MainTemplate
  }

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  return (
    <div className="App d-flex h-100 flex-column justify-content-center align-items-center">
      <div className="container w-75">
        <MyForm schema={schema}
          uiSchema={uiSchema}
          templates={templates}
          onSubmit={handleFormSubmit}
          formData/>
        {Object.keys(formData).length > 0 && renderFormData()}
      </div>
    </div>
  );
}

export default App;
