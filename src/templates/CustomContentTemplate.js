import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../widgets/ButtonWidget";

const CustomContentTemplate = ({ formData, uiSchema, schema, fields, errors, onChange : handleChange, onSuccess, onError, onSubmit }) => {
  const [preview, setPreview] = useState();
  const [fileDetails, setFileDetails] = useState(null);

  console.log("fields : ", fields);

  const renderField = (field, fieldName) => {
    const { title, enum: enumValues } = field;
    const uiField = uiSchema[fieldName] || {};
    const widget = uiField["ui:widget"] || "text";
    // const errorMessage = errors[fieldName];
    const fieldClass = uiField["ui:classNames"] || "form-control";
    // const errorMessageClass = uiField["ui:errorMessageClass"] || "text-danger";
    const layoutClass = uiField["ui:layout"];
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

    const handleChangeDatePart = (part, value) => {
      const updatedDate = { ...formData[fieldName] };
      updatedDate[part] = value;
      handleChange(fieldName, updatedDate);
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
                dateFormat={uiSchema[fieldName]['ui:options']?.format}
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
                dateFormat={uiSchema[fieldName]['ui:options']?.format}
                className={fieldClass}
              />
            </div>
            {errors[fieldName] && errors[fieldName].map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
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
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <div className={`${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}>
              {isYMD && (
                <>
                  <select
                    name={`${fieldName}_year`}
                    className={fieldClass}
                    value={selectedYear}
                    onChange={(e) => handleChangeDatePart("year", e.target.value)}
                  >
                    <option value="">Year</option>
                    {yearOptions}
                  </select>
                  <select
                    name={`${fieldName}_month`}
                    className={fieldClass}
                    value={selectedMonth}
                    onChange={(e) => handleChangeDatePart("month", e.target.value)}
                  >
                    <option value="">Month</option>
                    {monthOptions}
                  </select>
                  <select
                    name={`${fieldName}_day`}
                    className={fieldClass}
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
                    className={fieldClass}
                    value={selectedMonth}
                    onChange={(e) => handleChangeDatePart("month", e.target.value)}
                  >
                    <option value="">Month</option>
                    {monthOptions}
                  </select>
                  <select
                    name={`${fieldName}_day`}
                    className={fieldClass}
                    value={selectedDay}
                    onChange={(e) => handleChangeDatePart("day", e.target.value)}
                  >
                    <option value="">Day</option>
                    {dayOptions}
                  </select>
                  <select
                    name={`${fieldName}_year`}
                    className={fieldClass}
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
        return (
          <div key={fieldName} className="mt-2">
            <label className="form-label">{title || fieldName}</label>
            <DatePicker
              selected={formData[fieldName] || new Date()}
              onChange={(date) => handleChange(fieldName, date)}
              className="form-control"
              dateFormat={uiSchema[fieldName]['ui:options']?.format}
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

      case "text":
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

      case "button":
        return (<Button uiField={uiField} />);

      default:
        const CustomField = fields[widget];
        if(CustomField)
        {
          console.log("Returning custom field");
          // return <CustomField schema={schema.properties[fieldName]} uiSchema={uiSchema[fieldName]} fieldName={fieldName} onChange={(e) => handleChange(fieldName, e)} errors={errors[fieldName]}/>;
          return <CustomField schema={schema.properties[fieldName]} uiSchema={uiSchema[fieldName]} fieldName={fieldName} onChange={handleChange} errors={errors[fieldName]}/>;
        }
        return <p className="text-danger">No such component available</p>;
    }
  };

  return (
    <div>
      {Object.keys(schema.properties).map((fieldName) => {
        const field = schema.properties[fieldName];
        return renderField(field, fieldName);
      })}
    </div>
  );
};

export default CustomContentTemplate;
