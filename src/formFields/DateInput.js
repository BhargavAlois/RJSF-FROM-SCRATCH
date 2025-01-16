import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {format} from 'date-fns';

export default function DateInput(props) {
    const {schema, uiSchema, formData, errors, title, field, uiFieldSchema, layoutClass, fieldClass, handleChange, fieldName} = props;
  const formatOfDate =
    uiSchema[fieldName]?.["ui:options"]?.format || "MM/dd/yyyy";

    const handleDateChange = (fieldName, date, formatString) => {
        let formattedDate;
  
        // Use the current date if the selected date is invalid
        if (!date || isNaN(date.getTime())) {
          date = new Date(); // Fallback to current date
        }
  
        // Format the date as per the provided formatString
        if (formatString) {
          try {
            formattedDate = format(date, formatString);
          } catch (error) {
            formattedDate = date.toISOString(); // Fallback to ISO format if formatting fails
          }
        } else {
          formattedDate = new Date(date).toISOString(); // Default to ISO format
        }
  
        handleChange(fieldName, formattedDate);
      };

  return (
    <div key={fieldName} className={`${layoutClass} `}>
      <label className="form-label">{title || fieldName}</label>
      <DatePicker
        selected={formData[fieldName]}
        onChange={(date) => handleDateChange(fieldName, date, formatOfDate)}
        className={`${fieldClass} ${
          errors[fieldName] ? "is-invalid" : ""
        } form-control`}
        dateFormat={formatOfDate}
        placeholderText={uiFieldSchema["ui:placeholder"]}
      />
      {errors[fieldName] &&
        errors[fieldName].map((error, index) => (
          <p key={index} className="invalid-feedback m-0">
            {error}
          </p>
        ))}
    </div>
  );
}
