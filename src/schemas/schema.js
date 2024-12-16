export const schema = {
  type: "object",
  title: "My Custom Form",
  description: "A simple form example.",
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
      items: {
        type: "string",
        enum: ["Sports", "Music", "Movies", "Reading"],
      },
      title: "Preferences",
      default: ["Music", "Movies"],
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
      type: "object",
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
      maxLength: 8
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
  // required: [
  //   "firstName",
  //   "lastName",
  //   "email",
  //   "password",
  //   "role",
  //   "date",
  //   "preferences",
  //   "dateRange",
  //   "datetime",
  //   "time",
  //   "calendar",
  //   "phoneNumber"
  // ],
};