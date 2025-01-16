# My-RJSF: A React-Based Form Generator

It is a robust and customizable React package designed to dynamically generate user-friendly forms based on a provided JSON schema. It streamlines the process of building interactive, data-driven forms with built-in support for custom fields, templates, and validation.

## Installation

Install my-rjsf with npm

```bash
  npm install my-rjsf
```

## Usage/Examples

```javascript
import React, { useState } from "react";
import { schemaModel } from "./schemas/schema";
import CustomTemplate from "./templates/CustomTemplate";
import { MyForm } from "my-rjsf";

function App() {
  const [formData, setFormData] = useState();

  const templates = {
    myCustomRowTemplate: CustomTemplate,
  };

  const fields = {
    CustomPassword: PasswordWidget,
    CustomGenPassword: PasswordGenWidget,
    DatePickerWidget: DatePickerWidget,
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
    <MyForm
      schema={schemaModel.schema}
      uiSchema={schemaModel.uiSchema}
      templates={templates}
      widgets={fields}
      onSubmit={handleFormSubmit}
      onChange={handleOnChange}
      onSuccess={handleOnSuccess}
      onError={handleOnError}
      formData={formData}
      validator={validator}
    />
  );
}

export default App;
```

## Schema

```javascript
schemaModel = {
  name: "singleuser",
  title: "Single User",
  schema: {
    type: "object",
    properties: {
      info: {
        type: "object",
        title: "Employee Information",
        properties: {
          profilePic: {
            type: "string",
            format: "data-url",
            title: "Profile Image Upload",
          },
          firstName: {
            type: "string",
            title: "First Name",
          },
          lastName: {
            type: "string",
            title: "Last Name",
          },
          empId: {
            type: "string",
            title: "Employee ID",
          },
          designation: {
            type: "string",
            title: "Designation",
          },
        },
        required: ["firstName", "lastName", "empId", "designation"],
      },
      personalInfo: {
        type: "object",
        title: "Personal information",
        properties: {
          gender: {
            type: "string",
            title: "Gender",
            oneOf: [
              { const: "male", title: "Male" },
              { const: "female", title: "Female" },
              { const: "other", title: "Other" },
            ],
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            title: "Date Of Birth",
            dateType: "dateOfBirth",
          },
          bloodGroup: {
            type: "string",
            title: "Blood Group",
            oneOf: [
              { const: "A+", title: "A+" },
              { const: "A-", title: "A-" },
              { const: "B+", title: "B+" },
              { const: "B-", title: "B-" },
              { const: "AB+", title: "AB+" },
              { const: "AB-", title: "AB-" },
              { const: "O+", title: "O+" },
              { const: "O-", title: "O-" },
            ],
          },
          nationality: {
            type: "string",
            title: "Nationality",
          },
          phoneNumber: {
            type: "string",
            title: "Phone Number",
          },
          address: {
            type: "string",
            title: "Address",
          },
          residence: {
            type: "string",
            title: "Residence",
            oneOf: [
              { const: "Non-US", title: "Non-US" },
              { const: "US", title: "US" },
            ],
          },
        },
        required: [
          "gender",
          "dateOfBirth",
          "bloodGroup",
          "nationality",
          "phoneNumber",
          "address",
          "residence",
        ],
      },
      employeeinfo: {
        type: "object",
        title: "Employee Information",
        properties: {
          email: {
            type: "string",
            title: "Email",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          },
          password: {
            minLength: 8,
            type: "string",
            title: "Password",
          },
          dateOfJoining: {
            type: "string",
            format: "date",
            title: "Date Of Joining",
            dateType: "dateOfJoining",
          },
          employeementtype: {
            type: "string",
            title: "employeement type",
          },
          department: {
            title: "Department",
            type: "string",
            oneOf: [],
          },
          shift: {
            type: "string",
            title: "Shift",
            oneOf: [],
          },
          shiftTiming: {
            type: "string",
            title: "Shift Timing",
            oneOf: [],
          },
          reportTo: {
            type: "string",
            title: "Report To",
          },
        },
        required: [
          "department",
          "email",
          "password",
          "dateOfJoining",
          "reportTo",
          "shiftTiming",
          "shift",
          "employeementtype",
        ],
      },
    },
    required: ["info", "personalInfo"],
  },
  uiSchema: {
    hideTitle: true,
    layout: [
      {
        type: "section",
        title: "Employee Information",
        id: "info",
        fields: [
          "info.profilePic",
          "info.firstName",
          "info.lastName",
          "info.empId",
          "info.designation",
        ],
      },
      {
        type: "section",
        title: "Personal Information",
        id: "personalInfo",
        fields: [
          "personalInfo.gender",
          "personalInfo.dateOfBirth",
          "personalInfo.bloodGroup",
          "personalInfo.nationality",
          "personalInfo.phoneNumber",
          "personalInfo.address",
          "personalInfo.residence",
        ],
      },
      {
        type: "section",
        title: "Employee Info",
        id: "employeeinfo",
        fields: [
          "employeeinfo.email",
          "employeeinfo.password",
          "employeeinfo.dateOfJoining",
          "employeeinfo.department",
          "employeeinfo.shift",
          "employeeinfo.shiftTiming",
          "employeeinfo.reportTo",
        ],
      },
    ],
    info: {
      classNames: "employe-info",
      profilePic: {
        "ui:widget": "ProfileImage",
        "ui:options": {
          accept: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/bmp",
            "image/webp",
            "image/svg+xml",
            "image/tiff",
            "image/x-icon",
          ],
          // classNames: "col-6",
        },
      },
      firstName: {
        // classNames: "col-6",
        "ui:placeholder": "Enter First Name",
      },
      lastName: {
        // classNames: "col-6",
        "ui:placeholder": "Enter Last Name",
      },
      empId: {
        classNames: "emp-id",
        "ui:placeholder": "Enter Employee ID",
      },
      designation: {
        classNames: "designation",
        "ui:placeholder": "Enter Designation",
      },
      preview: true,
    },
    personalInfo: {
      classNames: "personal-info employe-info",
      gender: {
        classNames: "gender",
        "ui:placeholder": "Select Gender",
        "ui:widget": "select",
      },
      dateOfBirth: {
        classNames: "date-of-birth",
        "ui:widget": "DatePickerWidget",
      },
      bloodGroup: {
        classNames: "blood-group",
        "ui:placeholder": "Select Blood Group",
        "ui:widget": "select",
      },
      nationality: {
        classNames: "nationality",
        "ui:placeholder": "Enter Nationality",
      },
      phoneNumber: {
        "ui:widget": "CustomPhoneNumber",
        classNames: "phone-number",
        pattern_message: ["Invalid phone number"],
      },
      address: {
        classNames: "address",
        "ui:placeholder": "Enter Address",
      },
      residence: {
        classNames: "residence",
        "ui:placeholder": "Select Residence",
        "ui:widget": "select",
      },
    },
    employeeinfo: {
      classNames: "employe-info",
      email: {
        "ui:placeholder": "Enter Email",
        pattern_message: ["Invalid email address"],
      },
      password: {
        "ui:placeholder": "Enter Password",
        "ui:widget": "CustomGenPassword",
        pattern_message: [
          "Contains at least one uppercase letter (A-Z).",
          "Contains at least one lowercase letter (a-z).",
          "Contains at least one numeric digit (0-9).",
          "Contains at least one special character (e.g., !, @, #, $, %, &).",
          "Has a length between 8 and 15 characters.",
        ],
      },
      employeementtype: {
        "ui:placeholder": "Enter employeement type",
      },
      dateOfJoining: {
        "ui:widget": "date",
        "ui:options": {
          format: "MM/dd/yyyy",
        },
      },
      department: {
        "ui:placeholder": "Select Department",
      },
      shift: {
        "ui:placeholder": "Select Shift",
      },
      shiftTiming: {
        "ui:placeholder": "Select Shift Timing",
      },
      reportTo: {
        "ui:placeholder": "Enter Email Address To Report To",
      },
    },
  },
};
```

Layout divides fields into several divs. Where ids can be used to apply classes on these divs.

layout: [
      {
        type: "section",
        title: "Employee Information",
        id: "info",
        fields: [
          "info.profilePic",
          "info.firstName",
          "info.lastName",
          "info.empId",
          "info.designation",
        ],
      },
    ]
- css file :
```javascript
#root_info {
  display: grid;
  grid-template-areas:
    'title title title'
    'profile-pic first-name emp-id'
    'profile-pic last-name designation';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 10px;
}
```
**id : info** in schema

Use #root_**info** to assign css properties to that section

Use #root_<id provided in layout> to assign css properties to that section

### Widgets

- can be mentioned using ui:widget:"widget_name" in uiSchema.

| **Widget Name** | **Description**                                                                 |
| --------------- | ------------------------------------------------------------------------------- |
| `string`        | Renders a standard text input field for single-line text input.                 |
| `text`          | Alias for `string`, renders a single-line text input.                           |
| `alt-date`      | Renders an alternate date input field with customized formatting.               |
| `password`      | Renders a password input field that masks user input for sensitive data.        |
| `email`         | Renders an input field for email addresses with validation for email format.    |
| `file`          | Renders a file upload input allowing users to select and upload files.          |
| `button`        | Renders a button element, typically used for form submission or actions.        |
| `calendar`      | Renders a calendar picker for selecting dates directly from a calendar view.    |
| `checkboxes`    | Renders a group of checkboxes for multiple selection options.                   |
| `date`          | Renders a standard date input field for selecting dates.                        |
| `daterange`     | Renders inputs to select a start date and an end date for date range selection. |
| `datetime`      | Renders a date and time input field.                                            |
| `day`           | Renders an input field specifically for selecting a day of the month.           |
| `month`         | Renders an input field specifically for selecting a month.                      |
| `progress`      | Renders a progress bar input, useful for visualizing completion percentage.     |
| `radio`         | Renders a group of radio buttons for single-option selection.                   |
| `range`         | Renders a slider input for selecting a range value.                             |
| `select`        | Renders a dropdown (select) menu for single-option or multi-option selection.   |
| `time`          | Renders an input field for selecting time.                                      |
| `updown`        | Renders a numeric input with increment and decrement controls.                  |
| `year`          | Renders an input field for selecting a year.                                    |
| `numberEnum`    | Renders a group of radio buttons for numeric options.                           |
| `textarea`      | Renders a multi-line text input area for longer text input.                     |

### Validation

- **Required Fields**: Enforces mandatory completion of specific fields.
- **Min/Max Length**: Sets minimum and maximum character limits for string inputs (e.g., passwords).

  - **How to Use**:
    - To set a minimum length for a string input, use the `minLength` property.
    - To set a maximum length for a string input, use the `maxLength` property.
    ```json
    {
      "type": "string",
      "minLength": 8,
      "maxLength": 20
    }
    ```
    - This ensures the field value falls within the defined character limits.

- **Pattern Matching**: Ensures input conforms to a specific regex pattern (e.g., email and phone number formats).

  - **How to Use**:
    - Use the `pattern` property to provide a regular expression for the input value.
    ```json
    {
      "type": "string",
      "pattern": "^\\S+@\\S+\\.\\S+$"
    }
    ```
    - This pattern checks for an email format.

- **Pattern Messages**: Customizes error messages for pattern mismatches and allows multiple messages to be displayed if needed.

  - **How to Use**:
    - You can define the `patternMessage` property to specify custom error messages that should be displayed when the input doesn't match the defined pattern.
    - If you want to display multiple error messages for different patterns, you can use an array of messages.
    ```json
    {
      "type": "string",
      "pattern": "^\\S+@\\S+\\.\\S+$",
      "patternMessage": [
        "Please enter a valid email address.",
        "Email format should be 'example@domain.com'."
      ]
    }
    ```
    - This allows flexibility in displaying multiple messages to guide the user in correcting their input.

- **Range Validation**: Defines minimum and maximum values for numeric fields (e.g., integer range and progress).

  - **How to Use**:
    - For numeric fields, use `minimum` and `maximum` properties to specify valid numeric ranges.
    ```json
    {
      "type": "number",
      "minimum": 1,
      "maximum": 100
    }
    ```
    - This ensures the numeric value is within the specified range.

- **Format Validation**: Ensures data conforms to specific formats like `email`, `date`, `time`, or `date-time`.

  - **How to Use**:
    - Use the `format` property to specify predefined formats.
    ```json
    {
      "type": "string",
      "format": "email"
    }
    ```
    - This validates that the input is a valid email.

- **File Type Check**: Ensures that the selected file matches one of the accepted MIME types, as specified in the `ui:options.accept` property (e.g., `ui:options.accept: "image/jpeg, image/png"`).
  - **How to Use**:
    - Set the `ui:options.accept` property to specify the valid MIME types.
    ```json
    {
      "type": "string",
      "format": "data-url",
      "ui:options": {
        "accept": ["image/jpeg, image/png"]
      }
    }
    ```
    - This ensures the file matches the specified file types.

### Error Messages

- **Required Fields**: "This <field_name> is required."
- **Min/Max Length**: "Input must be between 8 and 20 characters."
- **Pattern Matching**: "Invalid email format."
- **Range Validation**: "Value must be between 1 and 100."
- **File Type Check**: "The selected file type (<fileType>) is not supported."
