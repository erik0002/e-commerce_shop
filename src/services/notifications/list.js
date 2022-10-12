const errors = {
  app: {
    title: 'test_case',
  },
  auth: {
    userDisabled: 'Your account is disabled',
    userNotFound: `Sorry, we don't recognize your credentials`,
    wrongPassword: `Sorry, we don't recognize your credentials`,
    weakPassword: 'This password is too weak',
    emailAlreadyInUse: 'Email is already in use',
    invalidEmail: 'Please provide a valid email',
    passwordReset: {
      invalidToken:
        'Password reset link is invalid or has expired',
      error: `Email not recognized`,
    },
    passwordUpdate: {
      samePassword: `You can't use the same password. Please create new password`
    },
    userNotVerified: `Sorry, your email has not been verified yet`,
    emailAddressVerificationEmail: {
      invalidToken:
        'Email verification link is invalid or has expired',
      error: `Email not recognized`,
    },
  },
  iam: {
    errors: {
      userAlreadyExists:
        'User with this email already exists',
      userNotFound: 'User not found',
      disablingHimself: `You can't disable yourself`,
      revokingOwnPermission: `You can't revoke your own owner permission`,
      deletingHimself: `You can't delete yourself`
    },
  },
  importer: {
    errors: {
      invalidFileEmpty: 'The file is empty',
      invalidFileExcel:
        'Only excel (.xlsx) files are allowed',
      invalidFileUpload:
        'Invalid file. Make sure you are using the last version of the template.',
      importHashRequired: 'Import hash is required',
      importHashExistent: 'Data has already been imported',
    },
  },
  errors: {
    forbidden: {
      message: 'Forbidden',
    },
    validation: {
      message: 'An error occurred',
    },
  },
  emails: {
    invitation: {
      subject: `You've been invited to {0}`,
      body: `    
        <p>Hello!</p>
        <p>You've been invited to {0} set password for your {1} account.</p>
        <p><a href='{2}'>{2}</a></p>
      `,
    },
    passwordReset: {
      subject: `Сброс пароля для {0}`,
      body: `
        <p>Привет!</p>
        <p>Перейдите по этой ссылке, чтобы сбросить настройки {0} пароль для вашего {1} аккаунта.</p>
        <p><a href='{2}'>{2}</a></p>
        <p>Если вы не просили сбросить пароль, игнорируйте это письмо.</p>
      `,
    },
  },
};

module.exports = errors;
