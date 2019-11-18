define({ "api": [
  {
    "type": "post",
    "url": "api/users/auth",
    "title": "",
    "name": "Authentication",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Sign in with credential</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>Object that content username &amp; password of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "GET",
    "url": "api/users/following-list",
    "title": "",
    "name": "Follwing_List",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>View following users</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>A object id of the target user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectCredentials",
            "description": "<p>User with the provided id does not exist</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectTarget",
            "description": "<p>Target with the provided id does not exist</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/import",
    "title": "",
    "name": "Importer",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Import all users by CSV file</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "File",
            "optional": false,
            "field": "document",
            "description": "<p>CSV document which has information about users</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/mail",
    "title": "",
    "name": "Mailing",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Send mail to the user</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userIds",
            "description": "<p>Object id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>The email of receiver</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "subject",
            "description": "<p>A subject of e-mail</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "sendgridKey",
            "description": "<p>A sendgrid API Key</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "messageTxt",
            "description": "<p>Plain text string of the message</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "messageHtml",
            "description": "<p>HTML String of the message</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "from",
            "description": "<p>The email of sender</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/register",
    "title": "",
    "name": "Register",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Create new account with email &amp; password</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>Default e-mail identity of user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Credential string as a password. Must be between 6-30 characters</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "EmailAlreadyExists",
            "description": "<p>The provided email is already registered</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "FieldAutheticationError",
            "description": "<p>The provided password is not between 6-30 characters</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/register/follow",
    "title": "",
    "name": "Register_Follow",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Follow someone by user object id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>A object id of the target user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "followingId",
            "description": "<p>A object id of the current user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectCredentials",
            "description": "<p>User with the provided id does not exist</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectTarget",
            "description": "<p>Target with the provided id does not exist</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/register",
    "title": "",
    "name": "Register_Notification_status",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Update push notification at user</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Object id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>The unique string that can use as push credential</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectCredentials",
            "description": "<p>User with provided id not found</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/register",
    "title": "",
    "name": "Register_Username",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Choose username by parameter</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Object id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The unique string to be set as the username</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectCredentials",
            "description": "<p>User with provided id not found</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "UsernameAlreadyExists",
            "description": "<p>The provided username already belongs to a user</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/register/unfollow",
    "title": "",
    "name": "Register_unfollow_action",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>unfollow someone by user object id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>A object id of the current user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unfollowId",
            "description": "<p>A object id of the user to unfollow</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/remove",
    "title": "",
    "name": "Remove",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Remove user account from documents</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "list",
            "description": "<p>List all user that will be removed</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "api/users/",
    "title": "",
    "name": "Users",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>List all users</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>Set limit of results (default 25)</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "offset",
            "description": "<p>Set offset of current page (default 0)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "api/users/:id",
    "title": "",
    "name": "Users_By_Id",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Get user by ID</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Object id of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "put",
    "url": "api/users/:id",
    "title": "",
    "name": "Users_Update_By_Id",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Update user by ID</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>Default object id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "body",
            "description": "<p>Object of the user that will be updated</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "api/users/verify/count/",
    "title": "",
    "name": "Verified_Count",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Count all verified user</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/verify/:id",
    "title": "",
    "name": "Verify_by_Id",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>FVerification by object id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>Object id of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>The verify code of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "api/users/code/:code",
    "title": "",
    "name": "Verify_by_code",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Get user data by code</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>Default verification code of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "api/users/verify/identity/:username/:code",
    "title": "",
    "name": "Verify_by_username___code",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>Get verified user by username &amp; code</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "code",
            "description": "<p>The verify code of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>The username of the user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>User with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/users/video-list",
    "title": "",
    "name": "Video_List",
    "group": "User",
    "version": "0.0.1",
    "description": "<p>View following user's videos by their id</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>A object id of the target user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "followingId",
            "description": "<p>A object id of the current user</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 400": [
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectCredentials",
            "description": "<p>User with the provided id does not exist</p>"
          },
          {
            "group": "Error 400",
            "optional": false,
            "field": "IncorrectTarget",
            "description": "<p>Target with the provided id does not exist</p>"
          }
        ],
        "Error 500": [
          {
            "group": "Error 500",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/users.js",
    "groupTitle": "User"
  },
  {
    "type": "post",
    "url": "api/videos/dummy",
    "title": "",
    "name": "CreateDummy",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>Create Dummy Video</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "post",
    "url": "api/videos/create",
    "title": "",
    "name": "CreateVideo",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>Create a Video</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "get",
    "url": "api/videos",
    "title": "",
    "name": "Import",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>import Videos</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "offset",
            "description": "<p>offset start Videos list</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "limit",
            "description": "<p>limit of Video in list</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "get",
    "url": "api/videos/master/list",
    "title": "",
    "name": "Import",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>get master list of videos</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "get",
    "url": "api/videos/remove",
    "title": "",
    "name": "RemoveVideo",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>like a Video</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "get",
    "url": "api/videos/:videoId/default-thumbnail",
    "title": "",
    "name": "SetDefaultThumbnail",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>set default thumbnail</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "videoId",
            "description": "<p>object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Incorrect",
            "description": "<p>requested data</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "post",
    "url": "api/videos/update",
    "title": "",
    "name": "UpdateVideo",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>Update a Video</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "thumbnails",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "youtubeURL",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "path",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "uploadDate",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "created",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "Date",
            "optional": false,
            "field": "updated",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "warnings",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "notice",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "get",
    "url": "api/videos/:videoId/default-thumbnail",
    "title": "",
    "name": "getDefaultThumbnail",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>get default thumbnail</p>",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "videoId",
            "description": "<p>object id</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          },
          {
            "group": "Success 200",
            "type": "String[]",
            "optional": false,
            "field": "defaultThumbnail",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "Incorrect",
            "description": "<p>requested data</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  },
  {
    "type": "post",
    "url": "api/videos/like/:videoId/:userId/:like",
    "title": "",
    "name": "likeVideo",
    "group": "Video",
    "version": "0.0.1",
    "description": "<p>like a Video pass last argument true or false</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "videoId",
            "description": "<p>object id</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userId",
            "description": "<p>object id</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "like",
            "description": "<p>true or false for likeing the video</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Authorization value ('Bearer <token>').</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status",
            "description": "<blockquote> <p>soon</p> </blockquote>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "IncorectCredetials",
            "description": "<p>Video with sended email not found</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "FieledAuthetication",
            "description": "<p>Fieled Creating</p>"
          }
        ],
        "Error 5xx": [
          {
            "group": "Error 5xx",
            "optional": false,
            "field": "ServerError",
            "description": "<p>Unexpected server error</p>"
          }
        ]
      }
    },
    "filename": "controllers/videos.js",
    "groupTitle": "Video"
  }
] });
