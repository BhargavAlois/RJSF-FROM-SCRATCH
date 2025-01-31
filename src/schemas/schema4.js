export const schemaModel = {
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
      userInfo: {
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
            default: "male",
          },
          dateOfBirth: {
            type: "string",
            format: "date",
            title: "Date Of Birth",
            dateType: "dateOfBirth",
            allowed: ["past"],
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
            default: "A+",
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
            default: "Non-US",
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
    },
  },
  uiSchema: {
    hideTitle: true,
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
          classNames: "profile-pic",
        },
      },
      firstName: {
        classNames: "first-name",
        "ui:placeholder": "Enter First Name",
      },
      lastName: {
        classNames: "last-name",
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
    userInfo: {
      classNames: "row",
      gender: {
        "ui:widget": "select",
        classNames: "col-6",
        "ui:placeholder": "Select Gender",
      },
      dateOfBirth: {
        classNames: "col-6",
        "ui:widget": "DatePickerWidget",
      },
      bloodGroup: {
        "ui:widget": "select",
        // classNames: "blood-group",
        "ui:placeholder": "Select Blood Group",
      },
      nationality: {
        // classNames: "nationality",
        "ui:placeholder": "Enter Nationality",
      },
      phoneNumber: {
        "ui:widget": "CustomPhoneNumber",
        classNames: "col-4",
        pattern_message: "Invalid phone number",
      },
      address: {
        classNames: "col-4",
        "ui:placeholder": "Enter Address",
      },
      residence: {
        "ui:widget": "select",
        classNames: "col-4",
        "ui:placeholder": "Select Residence",
      },
    },
  },
};
