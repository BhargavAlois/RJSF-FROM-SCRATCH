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
          // dateOfBirth: {
          //   type: 'string',
          //   format: 'date',
          //   title: 'Date Of Birth',
          //   dateType: 'dateOfBirth',
          // },
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
          // dateOfJoining: {
          //   type: 'string',
          //   format: 'date',
          //   title: 'Date Of Joining',
          //   dateType: 'dateOfJoining',
          // },
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
        classNames: "d-flex flex-column", // Makes all items in a single row
        fields: [
          "info.profilePic", // First column
          {
            type: "section", // Second column (firstName and lastName)
            classNames: "d-flex flex-row", // Column layout for the fields
            fields: ["info.firstName", "info.lastName"],
          },
          {
            type: "section", // Third column (empId and designation)
            classNames: "d-flex flex-row", // Column layout for the fields
            fields: ["info.empId", "info.designation"],
          },
        ],
      },
      {
        type: "section",
        title: "Personal Information",
        classNames: "",
        fields: [
          "personalInfo.gender",
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
        classNames: "",
        fields: [
          "employeeinfo.email",
          "employeeinfo.password",
          "employeeinfo.employeementtype",
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
          classNames: "profile-pic",
        },
      },
      firstName: {
        // "ui:layout": "row",
        "ui:col": 6,
        classNames: "first-name",
        "ui:placeholder": "Enter First Name",
      },
      lastName: {
        // "ui:layout": "row",
        "ui:col": 6,
        classNames: "last-name",
        "ui:placeholder": "Enter Last Name",
      },
      empId: {
        // "ui:layout": "row",
        "ui:col": 6,
        classNames: "emp-id",
        "ui:placeholder": "Enter Employee ID",
      },
      designation: {
        "ui:col": 6,

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
      // dateOfBirth: {
      //   classNames: 'date-of-birth',
      //   'ui:widget': 'DatePickerWidget',
      // },
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
        "ui:widget": "password",
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
      // dateOfJoining: {
      //   'ui:widget': 'DatePickerWidget',
      // },
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
