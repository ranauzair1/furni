const MESSAGES = {
  CREDENTIALS_NOT_VALID: "Credentials not valid",
  CONTRACT_NAME_TAKEN: "Please choose a unique contract name",
  ADDENDUM_NAME_TAKEN: "Please choose a unique addendum name",
  LOGIN_SUCCESS_MESSAGE: "Login Success",
  USER_ALREADY_EXISTS: "User already exist",
  EMPLOYEE_ALREADY_EXISTS: "Employee already exist",
  TOKEN_ALREADY_EXISTS: "Token already exist",
  EMPLOYEE_NOT_EXISTS: "Employee not exist",
  PAYMENT_NOT_EXISTS: "payment not exist",
  PAYMENT_IS_DELETE: "payment is deleted",
  EMPLOYEE_IS_CREATED: "Employee  is created",
  EMPLOYEE_IS_UPDATED: "Employee  is updated",
  TOKEN_IS_UPDATED: "Token  is updated",
  TOKEN_CREATED: "Token created successfully",
  TOKEN_NOT_FOUND: "Token not Found",
  MEMBERSHIP_IS_UPDATED: "Membership is updated",
  EMPLOYEE_IS_DELETE: "Employee  is deleted",
  USER_NOT_EXISTS: "User does not exist",
  USER_ALREADY_EXISTS: "User already exists",
  USER_CREATED: "User created",
  USER_UPDATED: "User is updated",
  MEMBERSHIP_IS_CREATED: "Membership is created",
  MEMBERSHIP_IS_DELETED: "Membership is deleted",
  GET_ALL_MEMBERSHIP: "Get all membership",
  GET_ALL_Token: "Get all Token",
  GET_ALL_GOLFER: "Get all golfer",
  GET_ALL_Employee: "Get All Employee",
  SUCCESS: "Success",
  PASSWORD_UPDATED_SUCCESSFUL: "Password updated successfully",
  ADD_AT_THE_RATE: "Please add proper email like(a------@gmail.com)",
  SIGNUP_MESSAGE: "Congratulations! Your Account has been Created in Furni",
  MESSAGE_ADDED: "Message Added",
  ITEM_ADDED: "Item is Added",
  ITEM_IS_DELETED: "Item is deleted",
  ITEM_IS_UPDATED: "Item is updated",
  MESSAGE_IS_DELETED: "Message is deleted",
  MESSAGE_IS_UPDATED: "Message is updated",
  MANAGER_ALREADY_EXISTS: "Manager already exists",
  MANAGER_DOES_NOT_EXISTS: "Manger does not exists",
  MANAGER_CREATED: "Manager created successfully",
  MANAGER_UPDATED: "Manger updated",
  MANAGER_DELETED: "User is deleted",
  ORDER_CREATED: "Order Created",
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
