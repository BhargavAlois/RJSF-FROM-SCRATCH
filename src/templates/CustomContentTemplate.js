import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../widgets/ButtonWidget";

import { format } from 'date-fns';

const CustomContentTemplate = ({ formData, schema, fields, errors, onChange: handleChange, onSuccess, onError, onSubmit }) => {
  const [preview, setPreview] = useState();
  const [fileDetails, setFileDetails] = useState(null);

  function getDeepValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  const getFieldSchemaByName = (schema, fieldName) => {
    // Recursive function to find the field by its name
    const findField = (currentSchema, currentFieldName) => {
      // If the current schema is an object with properties, check each property
      if (currentSchema.type === 'object' && currentSchema.properties) {
        // Iterate through all properties to find the one that matches currentFieldName
        for (const [key, value] of Object.entries(currentSchema.properties)) {
          // If the key matches the field name, return the field
          if (key === currentFieldName) {
            return value;
          }
          
          // If the field is an object, recurse into it
          if (value.type === 'object') {
            const result = findField(value, currentFieldName);
            if (result) return result;  // Return the field if found in nested object
          }
        }
      }
      
      // If the field is not found, return null
      return null;
    };
    
    return findField(schema, fieldName);
  };

  const renderField = (field, fieldName, parentSchema = schema, fieldPath) => {
    // console.log("field : ", field);
    const { title, enum: enumValues, oneOf, format } = field;
    fieldPath = fieldPath ? `${fieldPath}.${fieldName}` : fieldName;
    const uiField = getDeepValue(schema.uiSchema, fieldPath) || {};
    // console.log(`uiField for : ${fieldName}`, uiField);
    const widget = uiField["ui:widget"] || format || "string";
    const fieldClass = uiField["classNames"];
    const layoutClass = uiField["ui:layout"];
    const isColumnLayout = uiField["ui:layout"] === "column";
    const colClass = uiField["ui:col"] ? `col-${uiField["ui:col"]}` : "col-12";

    const convertToBase64 = (file) => {
      // Convert file to Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64File = reader.result; // This will be a Base64 encoded string
        handleChange(fieldName, base64File); // Pass the Base64 string to the handler
      };
      reader.readAsDataURL(file);
    }

    if (field.type === 'object' && field.properties) {
      return (
        <div key={fieldName} className={`${layoutClass} ${colClass} `}>
          <h5 className="mt-3">{title || fieldName}</h5>
          <p>{field?.description}</p>
          <div className="ms-3">
            {Object.keys(field.properties).map((nestedFieldName) => {
              const nestedField = field.properties[nestedFieldName];
              const updatedParentSchema = parentSchema.schema.properties[nestedFieldName];
              return renderField(nestedField, `${nestedFieldName}`, updatedParentSchema, fieldPath);
            })}
          </div>
        </div>
      );
    }

    const handleFileChange = (fieldName, e) => {
      const file = e.target.files[0];
      setPreview();
      setFileDetails();

      if (file) {
        if (file.type.startsWith("image/")) {
          const objectUrl = URL.createObjectURL(file);
          setPreview(objectUrl);
          setFileDetails(null);
        } else {
          setPreview(null);
          setFileDetails({
            name: file.name,
            type: file.type,
            size: file.size,
          });
        }

        const outputFormat = schema.uiSchema[fieldName]?.['ui:options']?.['output'];
        if (outputFormat === 'base64') {
          convertToBase64(file);
        } else {
          handleChange(fieldName, file);
        }
      }
    };

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

    const handleChangeDatePart = (part, value) => {
      const updatedDate = { ...formData[fieldName] };
      updatedDate[part] = value;
      handleChange(fieldName, updatedDate);
    };

    const handleDefaultFieldChange = (e) => {
      const inputType = e.target?.files ? 'file' : 'other';

      console.log("input type : ", inputType);

      if (inputType === 'file') {
        const outputFormat = uiField['ui:options']['output'];
        const file = e.target.files[0];

        if (outputFormat === 'base64') {
          convertToBase64(file);
        } else {
          handleChange(fieldName, file);
        }
      } else {
        console.log("Inside default handle");
        handleChange(fieldName, e.target.value);
      }
    };

    switch (widget) {
      case "password":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="password"
              name={fieldName}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "email":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="text"
              name={fieldName}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "select":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title || fieldName}</label>
            <select
              name={fieldName}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={uiField["ui:placeholder"]}
            >
              <option value="">Select an option</option>
              {(oneOf || enumValues) &&
                (oneOf || enumValues).map((value, index) => (
                  <option key={index} value={value.const}>
                    {value.title}
                  </option>
                ))}
            </select>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "checkboxes":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title || fieldName}</label>
            <div
              className={`form-check ${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}
              style={{ overflow: "hidden" }}
            >
              {field.items.enum &&
                field.items.enum.map((value, index) => (
                  <div key={index} className="form-check" style={{ flexBasis: "20%" }}>
                    <input
                      type="checkbox"
                      className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                      name={fieldName}
                      value={value}
                      checked={formData[fieldName]?.includes(value)}
                      onChange={(e) => {
                        const updatedValues = e.target.checked
                          ? [...(formData[fieldName] || []), value]
                          : (formData[fieldName] || []).filter(
                            (val) => val !== value
                          );
                        handleChange(fieldName, updatedValues);
                      }}
                    />
                    <label className="form-check-label">{value}</label>
                  </div>
                ))}
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "radio":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title || fieldName}</label>
            <div
              className={`form-check ${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}
            >
              {(oneOf || enumValues) &&
                (oneOf || enumValues).map((value, index) => (
                  <div key={index} className="form-check">
                    <input
                      type="radio"
                      className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                      name={fieldName}
                      value={value}
                      checked={formData[fieldName] === value}
                      onChange={() => handleChange(fieldName, value)}
                    />
                    <label className="form-check-label">{value}</label>
                  </div>
                ))}
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "range":
        const min = field.minimum || 0;
        const max = field.maximum || 100;
        const defaultValue = (field.default !== undefined && field.default !== null) ? field.default : min;
        const rangeValue = formData[fieldName] || defaultValue;

        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <input
              type="range"
              name={fieldName}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              value={rangeValue}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              min={min}
              max={max}
              step="1"
              placeholder={uiField["ui:placeholder"]}
            />
            <div className="range-value">
              <span>{rangeValue}</span>
            </div>
            {errors[fieldName] && (
              <div className="invalid-feedback">
                {errors[fieldName].map((error, index) => (
                  <p key={index} className="m-0">{error}</p>
                ))}
              </div>
            )}
          </div>
        );

      case "daterange":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className='form-label'>{title || fieldName}</label>
            <div className={`${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}>
              <DatePicker
                selected={formData.dateRange?.startDate || new Date()}
                onChange={(date) => handleChange("dateRange", { ...formData.dateRange, startDate: date })}
                selectsStart
                startDate={formData.dateRange?.startDate}
                minDate={new Date()}
                endDate={formData.dateRange?.endDate}
                placeholderText="Start Date"
                dateFormat={schema.uiSchema[fieldName]['ui:options']?.format}
                className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                placeholder={uiField["ui:placeholder"]}
              />
              <DatePicker
                selected={formData.dateRange?.endDate || new Date()}
                onChange={(date) => handleChange("dateRange", { ...formData.dateRange, endDate: date })}
                selectsEnd
                startDate={formData.dateRange?.startDate}
                endDate={formData.dateRange?.endDate}
                minDate={formData.dateRange?.startDate}
                placeholderText="End Date"
                dateFormat={schema.uiSchema[fieldName]['ui:options']?.format}
                className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                placeholder={uiField["ui:placeholder"]}
              />
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "alt-date":
        const { yearsRange, format: dateFormat } = uiField["ui:options"] || {};
        const startYear = yearsRange ? yearsRange[0] : 1900;
        const endYear = yearsRange ? yearsRange[1] : 2100;

        const months = [
          "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ];

        const getDaysInMonth = (month, year) => {
          return new Date(year, month, 0).getDate();
        };

        const dayOptions = [];
        const monthOptions = months.map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
        ));
        const yearOptions = [];
        for (let i = startYear; i <= endYear; i++) {
          yearOptions.push(<option key={i} value={i}>{i}</option>);
        }

        const selectedYear = formData[fieldName]?.year || new Date().getFullYear();
        const selectedMonth = formData[fieldName]?.month || new Date().getMonth() + 1;
        const selectedDay = formData[fieldName]?.day || new Date().getDate();
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

        for (let i = 1; i <= daysInMonth; i++) {
          dayOptions.push(<option key={i} value={i}>{i}</option>);
        }

        const isYMD = dateFormat === "YMD";
        const isMDY = dateFormat === "MDY";

        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title || fieldName}</label>
            <div className={`${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}>
              {isYMD && (
                <>
                  <select
                    name={`${fieldName}_year`}
                    className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                    value={selectedYear}
                    onChange={(e) => handleChangeDatePart("year", e.target.value)}
                  >
                    <option value="">Year</option>
                    {yearOptions}
                  </select>
                  <select
                    name={`${fieldName}_month`}
                    className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                    value={selectedMonth}
                    onChange={(e) => handleChangeDatePart("month", e.target.value)}
                  >
                    <option value="">Month</option>
                    {monthOptions}
                  </select>
                  <select
                    name={`${fieldName}_day`}
                    className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                    value={selectedDay}
                    onChange={(e) => handleChangeDatePart("day", e.target.value)}
                  >
                    <option value="">Day</option>
                    {dayOptions}
                  </select>
                </>
              )}
              {isMDY && (
                <>
                  <select
                    name={`${fieldName}_month`}
                    className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                    value={selectedMonth}
                    onChange={(e) => handleChangeDatePart("month", e.target.value)}
                  >
                    <option value="">Month</option>
                    {monthOptions}
                  </select>
                  <select
                    name={`${fieldName}_day`}
                    className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                    value={selectedDay}
                    onChange={(e) => handleChangeDatePart("day", e.target.value)}
                  >
                    <option value="">Day</option>
                    {dayOptions}
                  </select>
                  <select
                    name={`${fieldName}_year`}
                    className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
                    value={selectedYear}
                    onChange={(e) => handleChangeDatePart("year", e.target.value)}
                  >
                    <option value="">Year</option>
                    {yearOptions}
                  </select>
                </>
              )}
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className="text-danger">{error}</p>
            ))}
          </div>
        );

      case "date":
        const formatOfDate = schema.uiSchema[fieldName]?.['ui:options']?.format || "MM/dd/yyyy";
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title || fieldName}</label>
            <DatePicker
              selected={formData[fieldName]}
              onChange={(date) => handleDateChange(fieldName, date, formatOfDate)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''} form-control`}
              dateFormat={formatOfDate}
              placeholderText={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "progress":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title || fieldName}</label>
            <div className="progress" style={{ height: "30px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${field?.default}%`, backgroundColor: "#007bff" }}
                aria-valuenow={field?.default || 0}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {field?.default || 0}%
              </div>
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className="text-danger mb-0">{error}</p>
            ))}
          </div>
        );

      case "time":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="time"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              placeholder={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "datetime":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="datetime-local"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "calendar":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="date"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "year":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="number"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              min="1900"
              max="2100"
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "month":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="month"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}

          </div>
        );

      case "day":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="date"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "file":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className="form-label">{title}</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(fieldName, e)}
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
            />

            {(formData[fieldName] && typeof formData[fieldName] === 'string' && formData[fieldName].startsWith('data:') || preview) && (
              <div className="mt-2">
                <img
                  src={preview || formData[fieldName]}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                />
              </div>
            )}

            {fileDetails && (
              <div className="mt-2">
                <p><strong>File Name:</strong> {fileDetails.name}</p>
                <p><strong>File Type:</strong> {fileDetails.type}</p>
                <p><strong>File Size:</strong> {Math.round(fileDetails.size / 1024)} KB</p>
              </div>
            )}

            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "string":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="text"
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              name={fieldName}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "updown":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="number"
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              name={fieldName}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );

      case "textarea":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass} `}>
            <label className='form-label'>{title || fieldName}</label>
            <textarea
              type="textarea"
              className={`${fieldClass} ${errors[fieldName] ? 'is-invalid' : ''}`}
              name={fieldName}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              placeholder={uiField["ui:placeholder"]}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='invalid-feedback m-0'>{error}</p>
            ))}
          </div>
        );


      case "button":
        return (<Button uiField={uiField} />);

      default:
        const CustomField = fields[widget];
        if (CustomField) {
          // return <CustomField schema={schema.properties[fieldName]} uiSchema={uiSchema[fieldName]} fieldName={fieldName} onChange={(e) => handleChange(fieldName, e)} errors={errors[fieldName]}/>;
          return <CustomField schema={field} uiSchema={uiField} fieldName={fieldName} onChange={handleDefaultFieldChange} errors={errors[fieldName]} placeholder={schema.uiSchema[fieldName]?.["ui:placeholder"]} />;
        }
        return <p className="text-danger">No such component available</p>;
    }
  };

  return (
    // <div className="row align-items-center justify-content-center">
    Object.keys(schema.schema.properties).map((fieldName) => {
      const field = schema.schema.properties[fieldName];
      return renderField(field, fieldName);
    })
    // </div>
  )
};

export default CustomContentTemplate;