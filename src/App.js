import React, { useState } from 'react';
import MyForm from './components/MyForm';
import { schema } from './schemas/schema';
import { uiSchema } from './schemas/uiSchema';
import MainTemplate from './templates/MainTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import MyPasswordWidget from './fields/MyPasswordWidget';
import CustomFileWidget from './fields/CustomFileWidget';

function App() {
  const [formData, setFormData] = useState({});
  // const [formData, setFormData] = useState({});
  const prefilledFormData = {"firstName" : "Johnew", "lastName" : "Doe", "password" : "hello1", "date": "2024-12-17T12:08:24Z", "dateRange" : { startDate : "2024/08/16", endDate: "2024/09/16"}, file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAq1BMVEX///995/8AAAAtvOgcHBwWFhYYGBjx8fHS09U/P0DZ2tvP0NJvb26UlJaA7v8bGBchNTg4Zm6goKBEREV41+gbBQBhrbcSBgGC6/93d3fm5ubFxcZlZWcXDQhe1fQQKzFRze4trNFs3vcmj60iEAUQUGJHxuolJSUTDw8yMjK7u7uLi4uxsbELHCMaJygmf5tbw91KutlcnqZNn7E6lKsJOUknXmuBgYNbW1wkv2SRAAADWklEQVR4nO2afXeaMBSHVQRfWtgmW4danbMvCLit29rq9/9kA6GOQULzuyRsO+c+fylJ8PGShNyc9HoMwzAMwzAMwzAMwzAMw/y/jDoBc1pGgw6IlojTdBBNQtuBsMH6jp1qTQGp2W4ycYYQThiCLYap1AyRsmEpOwxt41L+G5DdDmyAS/nhl085bwk0Nnwp/IpL3X77nPMe5yFr99BU+D398IMgdWOd2AYw66zdRlK4PRV6QeBdkaW2fZTCSVJ4croP0o90KXNOdCmDTmQpslMgLi07UaUITlvVOFGlYKXmOOWFZyeS1IcrD3YC4tSVVHOcqk7B+qYDKSxO/bXVgVTzuFtX47SxOpCC49SBFNifNlYHUgrz+KYSJ8v6aVYKmp+KC1ZgdkpQf9+dyJ22ZucpcNwVToYnT1KczM7oKuPOq9Q+vepNSkHj7sWJuvJUk8L6eNnJoBSpP9FXnipStDgVX01JUebx83LWjFSL/mRMCnvf5e/g8rLfhBQWJ68aJyNS4LpgU3MyINVq3BmSoqzprP6f1XVL1R8PHCftUgprulKhV8Spil4pLEeQxEmzlMrat7RWkcRJrxQhlxJv32iUAnMEaZx0SmnqT1qlSONOss2lS4qUc8q23jRJkXJOiZI2qRZrX1NS6J5Y47PTJaU3TlqkyDmnSSmd406TVMscwYyU7v6kQaoxTn183GmRIvWnV+LUUqp1LmVAipZLvarUSkpDLiXjkSrVPueUQt5HNzPucieqlI6cU+pElMJyTg+LE1UKWvvW93pecaJJkXIE1WdHk7p9zBquPU90DMMrzmGcC/Oo3veFtSttCyeK1PDpLuWdhOdqYfb97llWvd425Ylwfmq3SvkoYVUtXNWuyMnrrnaolDPx0XNjOCpSizOjJIuUrYKjfLFOKuWOfv+qyMmd+GeiYRgq/lvREcCBaqycqPSbrkBqHvd6o/EUY+HPljVm/gK8zTiO42QukDpkUhcgYze6rhG5Y/Q+8T4+HGRS4D9MiWc1Yvgm42W8TIRSxySZX8LMBeB3yeIrkpoeB9f7eO/+BZLk4A+O4tOxF5fHw3KxGHdL2p/co399IVTKWOwP2eicdEgURsdkL5ykSnRz6Jt+AJxhGIZhGIZhGIZhGIZhmH+EX6/i/e24e+XTAAAAAElFTkSuQmCC"};

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

  const customFields = {
    myPasswordWidget : MyPasswordWidget,
    customFileWidget : CustomFileWidget
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
      <div className="d-flex flex-column justify-content-center align-items-center align-middle">
        <MyForm schema={schema}
          uiSchema={uiSchema}
          templates={templates}
          fields={customFields}
          onSubmit={handleFormSubmit}
          onChange={handleOnChange}
          onSuccess={handleOnSuccess}
          onError={handleOnError}
          formData={prefilledFormData} />
        {/* {Object.keys(formData).length > 0 && renderFormData()} */}
     </div>
  );
}

export default App;
