export const schemaModel = {
    name: 'singleuser',
    title: 'Single User',
    schema: {
      type: 'object',
      properties: {
        info: {
          type: 'object',
          title: 'Employee Information',
          properties: {
            profilePic: {
              type: 'string',
              format: 'data-url',
              title: 'Profile Image Upload',
            },
            firstName: {
              type: 'string',
              title: 'First Name',
            },
            lastName: {
              type: 'string',
              title: 'Last Name',
              default : 'thelast'
            },
            empId: {
              type: 'string',
              title: 'Employee ID',
            },
            designation: {
              type: 'string',
              title: 'Designation',
            },
          },
          required: ['firstName', 'lastName', 'empId', 'designation'],
        },
        personalInfo: {
          type: 'object',
          title: 'Personal information',
          properties: {
            gender: {
              type: 'string',
              title: 'Gender',
              oneOf: [
                { const: 'male', title: 'Male' },
                { const: 'female', title: 'Female' },
                { const: 'other', title: 'Other' },
              ],
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              title: 'Date Of Birth',
              dateType: 'dateOfBirth',
              allowed: ['past'],
            },
            bloodGroup: {
              type: 'string',
              title: 'Blood Group',
              oneOf: [
                { const: 'A+', title: 'A+' },
                { const: 'A-', title: 'A-' },
                { const: 'B+', title: 'B+' },
                { const: 'B-', title: 'B-' },
                { const: 'AB+', title: 'AB+' },
                { const: 'AB-', title: 'AB-' },
                { const: 'O+', title: 'O+' },
                { const: 'O-', title: 'O-' },
              ],
              default : "A+"
            },
            nationality: {
              type: 'string',
              title: 'Nationality',
            },
            phoneNumber: {
              type: 'string',
              title: 'Phone Number',
            },
            address: {
              type: 'string',
              title: 'Address',
            },
            residence: {
              type: 'string',
              title: 'Residence',
              oneOf: [
                { const: 'Non-US', title: 'Non-US' },
                { const: 'US', title: 'US' },
              ],
            },
          },
          required: [
            'gender',
            'dateOfBirth',
            'bloodGroup',
            'nationality',
            'phoneNumber',
            'address',
            'residence',
          ],
        },
        employeeinfo: {
          type: 'object',
          title: 'Employee Information',
          properties: {
            email: {
              type: 'string',
              title: 'Email',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            },
            password: {
              minLength: 8,
              type: 'string',
              title: 'Password',
            },
            dateOfJoining: {
              type: 'string',
              format: 'date',
              title: 'Date Of Joining',
              dateType: 'dateOfJoining',
              allowed: ['past', 'today', 'future'],
            },
            // employeementtype: {
            //   type: 'string',
            //   title: 'employeement type'
            // },
            department: {
              title: 'Department',
              type: 'string',
              oneOf: [],
            },
            shift: {
              type: 'string',
              title: 'Shift',
              oneOf: [],
            },
            shiftTiming: {
              type: 'string',
              title: 'Shift Timing',
              oneOf: [],
            },
            reportTo: {
              type: 'string',
              format: 'email',
              title: 'Report To',
            },
          },
          required: [
            'department',
            'email',
            'password',
            'dateOfJoining',
            'reportTo',
            'shiftTiming',
            'shift',
          ],
        },
      },
      required: ['info', 'personalInfo'],
    },
    uiSchema: {
      hideTitle: true,
      // layout: [
      //   {
      //     type: 'section',
      //     title: 'Employee Information',
      //     classNames: 'd-flex flex-row gap-2',
      //     fields: [
      //       'info.profilePic',
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-column',
      //         fields: ['info.firstName', 'info.lastName'],
      //       },
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-column',
      //         fields: ['info.empId', 'info.designation'],
      //       },
      //     ],
      //   },
      //   {
      //     type: 'section',
      //     title: 'Personal Information',
      //     classNames: 'd-flex flex-column',
      //     fields: [
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-row gap-2',
      //         fields: ['personalInfo.gender', 'personalInfo.dateOfBirth', 'personalInfo.bloodGroup'],
      //       },
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-row gap-2', 
      //         fields: ['personalInfo.nationality', 'personalInfo.phoneNumber', 'personalInfo.address', ],
      //       },
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-row',
      //         fields: ['personalInfo.residence']
      //       }
      //     ],
      //   },
      //   {
      //     type: 'section',
      //     title: 'Employee Info',
      //     classNames: 'd-flex flex-column gap-2',
      //     fields: [
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-row gap-2',
      //         fields: ['employeeinfo.email', 'employeeinfo.password', 'employeeinfo.dateOfJoining'],
      //       },
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-row gap-2',
      //         fields: ['employeeinfo.department', 'employeeinfo.shift', 'employeeinfo.shiftTiming'],
      //       },
      //       {
      //         type: 'section',
      //         classNames: 'd-flex flex-row',
      //         fields: ['employeeinfo.reportTo'],
      //       },
      //     ],
      //   },
      // ],
      info: {
        classNames: 'employe-info',
        profilePic: {
          'ui:col': 6,
          'ui:widget': 'ProfileImage',
          'ui:options': {
            accept: [
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/bmp',
              'image/webp',
              'image/svg+xml',
              'image/tiff',
              'image/x-icon',
            ],
            classNames: 'profile-pic',
          },
        },
        firstName: {
          classNames: 'first-name',
          'ui:placeholder': 'Enter First Name',
        },
        lastName: {
          classNames: 'last-name',
          'ui:placeholder': 'Enter Last Name',
        },
        empId: {
          classNames: 'emp-id',
          'ui:placeholder': 'Enter Employee ID',
        },
        designation: {
          classNames: 'designation',
          'ui:placeholder': 'Enter Designation',
        },
        preview: true,
      },
      personalInfo: {
        classNames: 'personal-info employe-info',
        gender: {
          classNames: 'gender',
          'ui:widget': 'select',
          'ui:placeholder': 'Select Gender',
        },
        dateOfBirth: {
          'ui:options': {
            format: 'yyyy-MM-dd',
          },
          classNames: 'date-of-birth',
          'ui:widget': 'DatePickerWidget',
        },
        bloodGroup: {
          classNames: 'blood-group',
          'ui:widget': 'select',
          'ui:placeholder': 'Select Blood Group',
        },
        nationality: {
          classNames: 'nationality',
          'ui:placeholder': 'Enter Nationality',
        },
        phoneNumber: {
          'ui:widget': 'CustomPhoneNumber',
          classNames: 'phone-number',
          pattern_message: 'Invalid phone number',
        },
        address: {
          classNames: 'address',
          'ui:placeholder': 'Enter Address',
        },
        residence: {
          classNames: 'residence',
          'ui:widget': 'select',
          'ui:col':4,
          'ui:placeholder': 'Select Residence',
        },
      },
      employeeinfo: {
        classNames: 'employe-info',
        email: {
          'ui:placeholder': 'Enter Email',
          pattern_message: 'Invalid email address',
        },
        password: {
          'ui:placeholder': 'Enter Password',
          'ui:widget': 'CustomGenPassword',
        },
        
        dateOfJoining: {
          'ui:widget': 'DatePickerWidget',
          'ui:options': {
            format: 'yyyy-MM-dd',
          },
        },
        department: {
          'ui:widget': 'select',
          'ui:placeholder': 'Select Department',
        },
        shift: {
          'ui:widget': 'select',
          'ui:placeholder': 'Select Shift',
        },
        shiftTiming: {
          'ui:widget': 'select',
          'ui:placeholder': 'Select Shift Timing',
        },
        reportTo: {
          'ui:col': 4,
          'ui:placeholder': 'Enter Email Address To Report To',
        },
      },
    },
  };