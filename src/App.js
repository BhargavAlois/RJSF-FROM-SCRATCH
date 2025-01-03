import React, { useState } from "react";
import MyForm from "./components/MyForm";
// import { schemaModel } from './schemas/schema';
import { schemaModel } from "./schemas/alternateSchema";
import CustomTemplate from "./templates/CustomTemplate";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./scss/style.scss";
import * as customFields from "./fields/fields";
import { prefillValues } from "./data/prefillvalues";

function App() {
  const [formData, setFormData] = useState(prefillValues);

  const templates = {
    myCustomRowTemplate: CustomTemplate,
  };

  const fields = {
    BodyField: customFields.JoditEditorField,
    AutoComplete: customFields.AutoCompleteField,
    ProfileImage: customFields.FileUploadWithPreview,
    link: customFields.DownloadWidget,
    CustomFile: customFields.FileUpload,
    newpoll: customFields.PollComponent,
    CustomPassword: customFields.PasswordWidget,
    CustomGenPassword: customFields.PasswordGenWidget,
    DatePickerWidget: customFields.DatePickerWidget,
    CustomPhoneNumber: customFields.PhoneNumberWidget,
    myPasswordWidget: customFields.MyPasswordWidget,
    customFileWidget: customFields.CustomFileWidget,
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    console.log("data : ", data);
  };

  const handleOnError = () => {
    console.log("Error occured");
  };

  const handleOnSuccess = () => {
    window.alert("Form Submitted");
  };

  const handleOnChange = (fieldName) => {
    console.log("Change occurred in : ", fieldName);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center align-middle">
      <MyForm
        schema={schemaModel}
        // uiSchema={uiSchema}
        templates={templates}
        fields={fields}
        onSubmit={handleFormSubmit}
        onChange={handleOnChange}
        onSuccess={handleOnSuccess}
        onError={handleOnError}
        formData={formData}
      />
    </div>
  );
}

export default App;
