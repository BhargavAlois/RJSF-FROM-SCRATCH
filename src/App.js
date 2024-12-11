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

      if (key === 'file') {
        console.log(value);
        return (
          <div className='d-flex flex-column'>
            <strong> File Details : </strong>
            <strong>File Name: </strong>
            <p>{value['name']}</p>
            <strong>File size: </strong>
            <p>{value['size']}</p>
            <strong>File Type: </strong>
            <p>{value['type']}</p>
          </div>
        )
      }

      if (key === 'alt-date') {
        return (<div>
          <p><strong>From (alt-date) </strong></p>
          <strong>Day</strong><p>{value['day']}</p>
          <strong>Month</strong><p>{value['month']}</p>
          <strong>Year</strong><p>{value['year']}</p>
        </div>)
      }

      if (key === 'date' && value) {
        return (
          <p key={key}>
            <strong>{schema.properties[key]?.title}:</strong> {new Date(value).toLocaleDateString()}
          </p>
        );
      }

      if (key === 'dateRange' && value) {
        const { startDate, endDate } = value;
        const formattedStartDate = startDate ? new Date(startDate).toLocaleDateString() : '';
        const formattedEndDate = endDate ? new Date(endDate).toLocaleDateString() : '';

        return (
          <p>
            <strong>From :</strong> {formattedStartDate}
            <strong> To : </strong>{formattedEndDate}
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

  const handleOnError = () => {
    console.log("Error occured");
  }

  const handleOnSuccess = () => {
    window.alert("Form Submitted");
  }

  const handleOnChange = (fieldName) => {
    console.log("Change occurred in : ", fieldName);
  } 

  return (
    <div className="App d-flex h-100 flex-column justify-content-center align-items-center">
      <div className="container w-75">
        <MyForm schema={schema}
          uiSchema={uiSchema}
          templates={templates}
          onSubmit={handleFormSubmit}
          onChange={handleOnChange}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
          formData />
        {Object.keys(formData).length > 0 && renderFormData()}
      </div>
    </div>
  );
}

export default App;
