export const uiSchema = {
  "ui:order": [
    "firstName", "lastName", "email", "password", "phoneNumber", "role", "preferences", "dateRange", "date",
    "time", "datetime", "calendar", "year", "month", "day", "file",
    "actionButton", "myButton"
  ],
  "ui:layout": "myCustomRowTemplate",
  firstName: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    // "ui:layout": "row",
    // "ui:col": 6,
    "ui:placeholder": "Enter first name"
  },
  lastName: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col": 6,
    "ui:placeholder": "Enter last name"
  },
  email: {
    "ui:widget": "email",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col": 6
    "ui:placeholder": "Enter your email"

  },
  password: {
    "ui:widget": "password",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col": 6
    "ui:placeholder": "Enter password"
  },
  role: {
    "ui:widget": "select",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  preferences: {
    "ui:widget": "checkboxes",
    "ui:classNames": "form-check-input",
    "ui:layout": "row",
  },
  
  dateRange: {
    "ui:widget": "daterange",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    "ui:options": {
      "format": "yyyy/dd/MM"
    }
  },
  date: {
    "ui:widget": "date",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    "ui:options": {
      "format": "MM/dd/yyyy"
    }
  },
  phoneNumber: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    "ui:placeholder": "Enter phone number"   
  },
  time: {
    "ui:widget": "time",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  datetime: {
    "ui:widget": "datetime",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  calendar: {
    "ui:widget": "calendar",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  // year: {
  //   "ui:widget": "select",  
  //   "ui:classNames": "form-control",
  //   "ui:layout": "row",
  // },
  // month: {
  //   "ui:widget": "select", 
  //   "ui:classNames": "form-control",
  //   "ui:layout": "row",
  // },
  // day: {
  //   "ui:widget": "select",  
  //   "ui:classNames": "form-control",
  //   "ui:layout": "row",
  // },
  file: {
    "ui:widget": "file",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    "ui:options" : {
      "accept" : ['image/png'],
      "output" : "blob", // blob is also possible
    }
  },
  "alt-date": {
    "ui:widget": "alt-date",
    "ui:options": {
      "yearsRange": [2000, 2100],
      "format": "MDY" //YMD ALSO WORKS
    },
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  progress: {
    "ui:widget": "progress",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  passwordWidget: {
    "ui:widget": "myPasswordWidget",
    "ui:classNames": "form-control",
    "ui:placeholder": "Enter password"
  },
  customFile:{
    "ui:widget": "customFileWidget",
    "ui:classNames": "form-control",
    "ui:options" : {
      "accept" : ['image/png'],
      "output" : "base64", // blob is also possible
    }
  },
  actionButton: {
    "ui:widget": "button",
    "ui:options": { "value": "Custom button", "onClick": () => { window.alert("Custom button pressed"); } },
    "ui:classNames": "btn btn-success border rounded-1 mt-3",
    "ui:layout": "row",
    // "ui:col": 6,
  },
  myButton: {
    "ui:widget": "button",
    "ui:options": { "value": "My button", "onClick": () => { window.alert("My button pressed"); } },
    "ui:classNames": "btn border rounded-1 btn-danger mt-3",
    "ui:layout": "row",
    // "ui:col": 6,
  },
};