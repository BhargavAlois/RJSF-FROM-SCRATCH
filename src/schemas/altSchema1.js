export const schema = {
        name: 'login',
        title: 'Sign In',
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              title: 'Email',
            },
            password: {
              type: 'string',
              title: 'Password',
              minLength: 3,
              maxLength: 15,
            },
          },
          required: ['email', 'password'],
        },
        uiSchema: {
          'ui:submitButtonOptions': {
            submitText: 'Login',
            norender: false,
            props: {
              disabled: false,
              className: 'LoginBtn primaryButton',
            },
          },
          email: {
            'ui:widget': 'email',
            'ui:placeholder': 'Enter your email',
            'ui:options': {
              label: true,
              classNames: 'w-100 fw-bold primary p-0 mb-2 title-m',
            },
          },
          password: {
            'ui:widget': 'CustomGenPassword',
            'ui:placeholder': 'Enter your password',
            'ui:options': {
              label: true,
              classNames: 'w-100 fw-bold primary p-0 mb-1 title-m',
            },
          },
        },
        };