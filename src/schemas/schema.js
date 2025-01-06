export const schemaModel = {
  type: "object",
  title: "My Custom Form",
  description: "A simple form example.",
  schema: {
    type: 'object',
    properties: {
      firstName: {
        type: "string",
        title: "First Name",
        default: "John",
      },
      lastName: {
        type: "string",
        title: "Last Name",
      },
      email: {
        type: "string",
        format: "email",
        title: "Email Address",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 6,
        maxLength: 8
      },
      role: {
        type: "string",
        enum: ["Admin", "User", "Guest"],
        title: "Role",
      },
      preferences: {
        type: "array",
        // oneOf : [
        //   ["Sports", "Music", "Movies", "Reading"],
        // ],
        items: {
          type: "string",
          enum: ["Sports", "Music", "Movies", "Reading"],
        },
        title: "Preferences",
        default: ["movies"],
      },
      numberEnum: {
        "type": "number",
        "title": "Number enum",
        "oneOf": [
          1,
          2,
          3
        ]
      },
      integerRange: {
        "title": "Integer range",
        "type": "integer",
        "minimum": -50,
        "maximum": 50,
        "default": 0
      },
      date: {
        type: "string",
        format: "date",
        title: "Date of Birth",
      },
      phoneNumber: {
        type: "string",
        pattern: "^\\d{3}-\\d{3}-\\d{4}$",
        title: "Phone Number",
        description: "Phone number in format XXX-XXX-XXXX",
      },
      dateRange: {
        type: "string",
        title: "Date Range",
        properties: {
          startDate: { type: "string", format: "date" },
          endDate: { type: "string", format: "date" },
        },
      },
      time: {
        type: "string",
        format: "time",
        title: "Time",
      },
      datetime: {
        type: "string",
        format: "date-time",
        title: "Datetime",
      },
      calendar: {
        type: "string",
        format: "date",
        title: "Calendar",
      },
      // year: {
      //   type: "string",
      //   format: "year",
      //   title: "Year",
      // },
      // month: {
      //   type: "string",
      //   format: "month",
      //   title: "Month",
      // },
      // day: {
      //   type: "string",
      //   format: "date",
      //   title: "Day",
      // },
      file: {
        type: "string",
        format: "uri",
        title: "File",
        description: "A file upload field, URL based",
      },
      customFile: {
        type: "string",
        format: "uri",
        title: "Custom file input",
      },
      "alt-date": {
        type: "string",
        format: "date",
        title: "Alternative Date",
      },
      progress: {
        type: "integer",
        title: "Progress",
        default: 40,
        minimum: 0,
        maximum: 100,
      },
      passwordWidget: {
        type: "string",
        title: "Password widget",
        maxLength: 8,
      },
      actionButton: {
        type: "string",
        title: "Action Button",
      },
      myButton: {
        type: "string",
        title: "My Button",
      }
    },
    footerContent: "This is footer content",
    required: [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "date",
      "preferences",
      "dateRange",
      "datetime",
      "time",
      "calendar",
      "phoneNumber",
      "integerRange",
      "numberEnum"
    ],
  },
  uiSchema: {
    type: 'object',
    "ui:order": [
      "firstName", "lastName", "email", "password", "phoneNumber", "role", "preferences", "dateRange", "date",
      "time", "datetime", "calendar", "year", "month", "day", "file", "integerRange",
      "actionButton", "myButton"
    ],
    "layout": [{
    type: "section",
    classNames: "d-flex flex-row",
    fields: ["firstName", "lastName"],
  }, {
    type: "section",
    fields: ["email", "password", "phoneNumber", "role", "preferences", "dateRange", "date",
      "time", "datetime", "calendar", "year", "month", "day", "file", "integerRange", "numberEnum",
      "actionButton", "myButton"]
  }],
    // "ui:layout": "myCustomRowTemplate",
    firstName: {
      // "ui:widget": "text",
      "classNames": "form-control",
      "ui:layout": "row",
      "ui:col": 6,
      "ui:placeholder": "Enter first name"
    },
    lastName: {
      // "ui:widget": "text",
      "classNames": "form-control",
      "ui:layout": "row",
      "ui:col": 6,
      "ui:placeholder": "Enter last name"
    },
    email: {
      "ui:widget": "email",
      "classNames": "form-control",
      "ui:layout": "row",
      // "ui:col": 6
      "ui:placeholder": "Enter your email"
    },
    password: {
      "ui:widget": "password",
      "classNames": "form-control",
      "ui:layout": "row",
      // "ui:col": 6
      "ui:placeholder": "Enter password"
    },
    role: {
      "ui:widget": "select",
      "classNames": "form-control",
      "ui:layout": "row",
    },
    preferences: {
      "ui:widget": "checkboxes",
      "classNames": "form-check-input",
      "ui:layout": "row",
    },
    numberEnum: {
      "ui:widget": "radio",
      "classNames": "form-check-input"
    },
    integerRange: {
      "ui:widget": "range",
      "classNames": "form-control-range"
    },
    dateRange: {
      "ui:widget": "daterange",
      "classNames": "form-control",
      "ui:layout": "row",
      "ui:options": {
        "format": "yyyy/dd/MM"
      }
    },
    date: {
      "ui:widget": "date",
      "classNames": "form-control",
      "ui:layout": "row",
      "ui:options": {
        "format": "MM/dd/yyyy"
      }
    },
    phoneNumber: {
      // "ui:widget": "text",
      "classNames": "form-control",
      "ui:layout": "row",
      "ui:placeholder": "Enter phone number",
      "pattern_message": [
        "Phone number in format XXX-XXX-XXXX"
      ]
    },
    time: {
      "ui:widget": "time",
      "classNames": "form-control",
      "ui:layout": "row",
    },
    datetime: {
      "ui:widget": "datetime",
      "classNames": "form-control",
      "ui:layout": "row",
    },
    calendar: {
      "ui:widget": "calendar",
      "classNames": "form-control",
      "ui:layout": "row",
    },
    // year: {
    //   "ui:widget": "select",  
    //   "classNames": "form-control",
    //   "ui:layout": "row",
    // },
    // month: {
    //   "ui:widget": "select", 
    //   "classNames": "form-control",
    //   "ui:layout": "row",
    // },
    // day: {
    //   "ui:widget": "select",  
    //   "classNames": "form-control",
    //   "ui:layout": "row",
    // },
    file: {
      "ui:widget": "file",
      "classNames": "form-control",
      "ui:layout": "row",
      "ui:options": {
        "accept": ['image/png'],
        "output": "blob", // blob is also possible
      }
    },
    "alt-date": {
      "ui:widget": "alt-date",
      "ui:options": {
        "yearsRange": [2000, 2100],
        "format": "MDY" //YMD ALSO WORKS
      },
      "classNames": "form-control",
      "ui:layout": "row",
    },
    progress: {
      "ui:widget": "progress",
      "classNames": "form-control",
      "ui:layout": "row",
    },
    passwordWidget: {
      "ui:widget": "CustomGenPassword",
      "classNames": "form-control",
      "ui:placeholder": "Enter password"
    },
    customFile: {
      "ui:widget": "customFileWidget",
      "classNames": "form-control",
      "ui:options": {
        "accept": ['image/png'],
        "output": "base64", // blob is also possible
      }
    },
    actionButton: {
      "ui:widget": "button",
      "ui:options": { "value": "Custom button", "onClick": () => { window.alert("Custom button pressed"); } },
      "classNames": "btn btn-success border rounded-1 mt-3",
      "ui:layout": "row",
      // "ui:col": 6,
    },
    myButton: {
      "ui:widget": "button",
      "ui:options": { "value": "My button", "onClick": () => { window.alert("My button pressed"); } },
      "classNames": "btn border rounded-1 btn-danger mt-3",
      "ui:layout": "row",
      // "ui:col": 6,
    },
  }
};