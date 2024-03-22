const MESSAGES = {
  CREDENTIALS_NOT_VALID: "Credentials not valid",
  LOGIN_SUCCESS_MESSAGE: "Login Success",
  USER_ALREADY_EXISTS: "User already exist",
  TOKEN_ALREADY_EXISTS: "Token already exist",
  USER_NOT_EXISTS: "User does not exist",
  USER_ALREADY_EXISTS: "User already exists",
  USER_CREATED: "User created",
  USER_UPDATED: "User is updated",
  GET_ALL_MEMBERSHIP: "Get all membership",
  SUCCESS: "Success",
  PASSWORD_UPDATED_SUCCESSFUL: "Password updated successfully",
  ADD_AT_THE_RATE: "Please add proper email like(a------@gmail.com)",
  SIGNUP_MESSAGE: "Congratulations! Your Account has been Created in Furni",
  MESSAGE_ADDED: "Message Added",
  ERROR: "An error occured",
  EMAIL_VERIFICATION_TOKEN_NOT_VALID: "Verification Code is invalid",
  PASSWORD_CAN_NOT_BE_SAME: "New password cannot be same as old password.",
  SIGNUP_CONTENT: function (email, password, name) {
    return `<!DOCTYPE html>
    <html>
      <head>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap");
          body {
            font-family: "Poppins";
            font-size: small;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
          h1 {
            color: #333;
            margin-top: 0;
          }
          p {
            color: #777;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
  <div class="container">
    <h1>🔒 User Account Created</h1>
    <p>Dear ${name},</p>
    <p>Congratulations! Your account has been successfully created by the admin panel.</p>
    <p>Please find your account credentials below:</p>
    <div class="credentials">
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
   
    </div>
    <p>For security reasons, we recommend that you change your password upon logging in for the first time.</p>
    <p>If you have any questions or need assistance, please feel free to contact our support team </p>
    <p>Thank you for being a valued member of our community!</p>
    <div class="footer">
    <p>
      Support Agent:(__________________)<br />
      <br />
      
    </p>
    </div>
  </div>
</body>
    </html>`;
  },
  EMAIL_CONTENT: function (email, token) {
    return `A password reset was requested for this email address ${email}.
    If you requested this reset, please ${token}`;
  },
  sendViaEmail: function (email, token) {
    return `A password reset was requested for this email address ${email}.
  If you requested this reset, please use the following OTP or token to reset your password:
  ${token}`;
  },
  EMAIL_VERIFICATION_CONTENT: function (email, token) {
    return `An Email Verification was requested for this email address ${email}.
    To verify this email, please 
    <a href="${process.env.VERIFY_URL}?token=${token}">Click on this link</a>`;
  },



  TOKEN_NOT_VALID: "Token Not Valid",
  EMAIL_FOR_FORGET_PASSWORD_RESET: "One-Time Password (OTP) for Password Reset",
};

const TABLES = {
  ADMIN: "Admins",
};

const MODELS = {
  ADMIN: "Admins",
  MANAGER: "Managers",
  FORGETPASSWORDTOKEN: "ForgetPasswordTokens",
  USER: "Users",
  PROJECTS: "Projects",
  ProjectMember: "ProjectMembers",
  Comment: "Comments",

  Post: "Posts",
  ROLE: "Roles",
  PROJECTIMAGE: "ProjectImages"
};

module.exports = {
  MESSAGES,
  TABLES,
  MODELS,
};
