export const schema = {
  type: "object",
  title: "My Custom form",
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
      // default: "Doe", 
    },
    email: {
      type: "string",
      format: "email",
      title: "Email Address",
      // default: "johndoe@example.com", 
    },
    password: {
      type: "string",
      title: "Password",
      minLength: 6,
      // default: "password123", 
    },
    role: {
      type: "string",
      enum: ["Admin", "User", "Guest"],
      title: "Role",
      // default: "User", 
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
      // default: "1990-01-01", 
    },
    dateRange: {
      type: "object",
      title: "Date Range",
      properties: {
        startDate: { type: "string", format: "date", default: "2023-01-01" }, // Default value
        endDate: { type: "string", format: "date", default: "2023-12-31" }, // Default value
      },
    },
    actionButton: { type: "string", title: "Action Button" },
    myButton: { type: "string", title: "My Button" },
  },
  footerContent: "This is footer content",
  required: ["firstName", "lastName", "email", "password", "role", "date", "preferences", "dateRange"],
};
