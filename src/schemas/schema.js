export const schema = {
  type: "object",
  title : "My Custom form",
  description: "A simple form example.",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
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
    },
    date: {
      type: "string",
      format: "date",
      title: "Date of Birth",
    },
    dateRange: {
      type: "object",
      title: "Date Range",
      properties: {
        startDate: { type: "string", format: "date" },
        endDate: { type: "string", format: "date" },
      },
    },
    actionButton: { type: "string", title: "Action Button" },
    myButton : { type: "string", title: "My Button" },
  },
  footerContent : "This is footer content",
  required: ["firstName", "lastName", "email", "password", "role", "date", "preferences", "dateRange"],
};
