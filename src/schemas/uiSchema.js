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
    "ui:layout": "row",
  },
  lastName: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  email: {
    "ui:widget": "email",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  password: {
    "ui:widget": "password",
    "ui:classNames": "form-control",
    "ui:layout": "row",
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
  },
  date: {
    "ui:widget": "date",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  phoneNumber: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    "ui:layout": "row",
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
  year: {
    "ui:widget": "select",  
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  month: {
    "ui:widget": "select", 
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  day: {
    "ui:widget": "select",  
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  file: {
    "ui:widget": "file",
    "ui:classNames": "form-control",
    "ui:layout": "row",
  },
  actionButton: {
    "ui:widget": "button",
    "ui:options": { "value": "Custom button", "onClick" : () => { window.alert("Custom button pressed"); }},
    "ui:classNames": "btn btn-success mt-2 w-25",
    "ui:layout": "row",  
    "ui:col": 6,
  },
  myButton: {
    "ui:widget": "button",
    "ui:options": { "value": "My button", "onClick" : () => { window.alert("My button pressed"); }},
    "ui:classNames": "btn btn-danger mt-2 w-25",
    "ui:layout": "row",  
    "ui:col": 6,
  },
};