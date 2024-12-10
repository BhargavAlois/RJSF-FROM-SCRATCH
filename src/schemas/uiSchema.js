export const uiSchema = {
  "ui:order": ["firstName", "lastName", "email", "password","role", "preferences", "dateRange", "date", "actionButton", "myButton"],  
  "ui:layout":"myCustomRowTemplate",
  firstName: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col": 6, 
  },
  lastName: {
    "ui:widget": "text",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col": 6, 
  },
  email: {
    "ui:widget": "email",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col" : 6,  
  },
  password: {
    "ui:widget": "password",
    "ui:classNames": "form-control",
    "ui:layout": "row",
    // "ui:col" : 6,   
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
  date : {
    "ui:widget" : "date"
  },
  actionButton: {
    "ui:widget": "button",
    "ui:options": { "value": "Custom button", "onClick" : () => {window.alert("Custom button pressed"); }},
    "ui:classNames": "btn btn-success mt-2 w-25",
    "ui:layout": "row",  
    "ui:col" : 6,
  },
  myButton: {
    "ui:widget": "button",
    "ui:options": { "value": "My button", "onClick" : () => {window.alert("My button pressed");}},
    "ui:classNames": "btn btn-danger mt-2 w-25",
    "ui:layout": "row",  
    "ui:col" : 6,
  }
};
