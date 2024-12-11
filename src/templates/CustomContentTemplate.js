import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../widgets/ButtonWidget";

const CustomContentTemplate = ({ formData, handleChange, uiSchema, schema, errors }) => {
  const [preview, setPreview] = useState();
  const [fileDetails, setFileDetails] = useState(null);
  const renderField = (field, fieldName) => {
    const { title, enum: enumValues } = field;
    const uiField = uiSchema[fieldName] || {};
    const widget = uiField["ui:widget"] || "text";
    const errorMessage = errors[fieldName];
    const fieldClass = uiField["ui:classNames"] || "form-control";
    const errorMessageClass = uiField["ui:errorMessageClass"] || "text-danger";
    const layoutClass = uiField["ui:layout"] === "row" ? "form-group row" : "form-group";
    const colClass = uiField["ui:col"] ? `col-${uiField["ui:col"]}` : "col-12";
    const isColumnLayout = uiField["ui:layout"] === "column";

    const handleFileChange = (fieldName, e) => {
      const file = e.target.files[0];

      if (file && file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setFileDetails(null);
      } else if (file) {
        setPreview(null);
        setFileDetails({
          name: file.name,
          type: file.type,
          size: file.size,
        });
      }
      handleChange(fieldName, file);
    };


    switch (widget) {
      case "password":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="password"
              name={fieldName}
              className={fieldClass}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "email":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="email"
              name={fieldName}
              className={fieldClass}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "select":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <select
              name={fieldName}
              className={fieldClass}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            >
              <option value="">Select an option</option>
              {enumValues &&
                enumValues.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
            </select>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "checkboxes":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <div
              className={`form-check ${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}
              style={{ flexWrap: "wrap", gap: "10px", overflow: "hidden" }}
            >
              {field.items.enum &&
                field.items.enum.map((value, index) => (
                  <div key={index} className="form-check" style={{ flexBasis: "48%" }}>
                    <input
                      type="checkbox"
                      className={fieldClass}
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
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "radio":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <div
              className={`form-check ${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}
            >
              {enumValues &&
                enumValues.map((value, index) => (
                  <div key={index} className="form-check">
                    <input
                      type="radio"
                      className={fieldClass}
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
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "daterange":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
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
                className={fieldClass}
              />
              <DatePicker
                selected={formData.dateRange?.endDate || new Date()}
                onChange={(date) => handleChange("dateRange", { ...formData.dateRange, endDate: date })}
                selectsEnd
                startDate={formData.dateRange?.startDate}
                endDate={formData.dateRange?.endDate}
                minDate={formData.dateRange?.startDate}
                placeholderText="End Date"
                className={fieldClass}
              />
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "date":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title || fieldName}</label>
            <DatePicker
              selected={formData[fieldName] || new Date()}
              onChange={(date) => handleChange(fieldName, date)}
              className="form-control"
              dateFormat="yyyy/MM/dd"
              placeholderText="Select date"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "progress":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <div className="progress" style={{ height: "30px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${formData[fieldName] || 0}%` }}
                aria-valuenow={formData[fieldName] || 0}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {formData[fieldName] || 0}%
              </div>
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className="text-danger mb-0">{error}</p>
            ))}
          </div>
        );


      case "time":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="time"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-control"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "datetime":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="datetime-local"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-control"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "calendar":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="date"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-control"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "year":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="number"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              min="1900"
              max="2100"
              className="form-control"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "month":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="month"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-control"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "day":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="date"
              value={formData[fieldName] || ''}
              onChange={(e) => handleChange(fieldName, e.target.value)}
              className="form-control"
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case "file":
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title}</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(fieldName, e)}
              className="form-control"
            />

            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
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
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}

          </div>
        );

      case 'text':
        console.log();
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="text"
              className={fieldClass}
              name={fieldName}
              value={formData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
          </div>
        );

      case 'button':
        return (<Button uiField={uiField} classNames="w-100" />);

      default:
        console.log("No field found");
    }
  };

  return (
    <>
      {Object.keys(schema.properties).map((fieldName) => {
        const field = schema.properties[fieldName];
        return renderField(field, fieldName);
      })}
    </>
  );
};

export default CustomContentTemplate;
