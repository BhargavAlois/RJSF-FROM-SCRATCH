import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../widgets/ButtonWidget";

const CustomContentTemplate = ({ formData, handleChange, uiSchema, schema, errors }) => {
  console.log(Object.keys(formData).length);
  
  const initializeFormData = (schema) => {
    console.log("Init");
    const initialData = {};
    
    Object.keys(schema.properties).forEach((fieldName) => {
      const field = schema.properties[fieldName];
      console.log("Field default : ", field.default);
      if (field.default) {
        initialData[fieldName] = field.default; 
      } else if (field.type === "object" && field.properties) {
        
        initialData[fieldName] = initializeFormData(field); 
      } else if (field.type === "array" && field.items && field.items.enum) {
        
        initialData[fieldName] = [];
      }
    });

    return initialData;
  };

  const defaultFormData = Object.keys(formData).length > 0 || initializeFormData(schema);

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

    switch (widget) {
      case "password":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="password"
              name={fieldName}
              className={fieldClass}
              value={defaultFormData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
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
              value={defaultFormData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
          </div>
        );

      case "select":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className="form-label">{title || fieldName}</label>
            <select
              name={fieldName}
              className={fieldClass}
              value={defaultFormData[fieldName] || ""}
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
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
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
                      checked={defaultFormData[fieldName]?.includes(value)}
                      onChange={(e) => {
                        const updatedValues = e.target.checked
                          ? [...(defaultFormData[fieldName] || []), value]
                          : (defaultFormData[fieldName] || []).filter(
                            (val) => val !== value
                          );
                        handleChange(fieldName, updatedValues);
                      }}
                    />
                    <label className="form-check-label">{value}</label>
                  </div>
                ))}
            </div>
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
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
                      checked={defaultFormData[fieldName] === value}
                      onChange={() => handleChange(fieldName, value)}
                    />
                    <label className="form-check-label">{value}</label>
                  </div>
                ))}
            </div>
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
          </div>
        );

      case "daterange":
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className='form-label'>{title || fieldName}</label>
            <div className={`${isColumnLayout ? "d-flex flex-column" : "d-flex flex-row"}`}>
              <DatePicker
                selected={defaultFormData.startDate}
                onChange={(date) => handleChange("startDate", date)}
                selectsStart
                startDate={defaultFormData.startDate}
                endDate={defaultFormData.endDate}
                placeholderText="Start Date"
                className={fieldClass}
              />
              <DatePicker
                selected={defaultFormData.endDate}
                onChange={(date) => handleChange("endDate", date)}
                selectsEnd
                startDate={defaultFormData.startDate}
                endDate={defaultFormData.endDate}
                minDate={defaultFormData.startDate}
                placeholderText="End Date"
                className={fieldClass}
              />
            </div>
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
          </div>
        );

      case "date":
        return (
          <div key={fieldName} className="mt-3">
            <label className="form-label">{title || fieldName}</label>
            <DatePicker
              selected={defaultFormData[fieldName] || new Date()}
              onChange={(date) => handleChange(fieldName, date)}
              className="form-control"
              dateFormat="yyyy/MM/dd"
            />
          </div>
        );

      case 'button':
        return (<Button uiField={uiField} classNames="w-100" />);

      default:
        return (
          <div key={fieldName} className={`${layoutClass} ${colClass}`}>
            <label className='form-label'>{title || fieldName}</label>
            <input
              type="text"
              name={fieldName}
              className={fieldClass}
              value={defaultFormData[fieldName] || ""}
              onChange={(e) => handleChange(fieldName, e.target.value)}
            />
            {errorMessage && <div className={errorMessageClass}>{errorMessage}</div>}
          </div>
        );
    }
  };

  const renderFieldsInOrder = () => {
    const order = uiSchema["ui:order"] || Object.keys(schema.properties);
    return order.map((fieldName) => {
      const field = schema.properties[fieldName];
      return renderField(field, fieldName);
    });
  };

  return (
      renderFieldsInOrder()
  );
};

export default CustomContentTemplate;
