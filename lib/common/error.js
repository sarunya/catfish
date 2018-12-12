module.exports = {
    UserAlreadyExists: {
        "statusCode": 400,
        "error": "UserAlreadyExists",
        "message": "User with given email exists already"
    },
    IncorrectPassword: {
        "statusCode": 401,
        "error": "IncorrectPassword",
        "message": "Password entered is not correct. Please Try again"
    },
    UserNotFoundError: {
        "statusCode": 400,
        "error": "UserNotFoundError",
        "message": "User with given email is not found"
    },
    InternalServerError: {
        "statusCode": 500,
        "error": "InternalServerError",
        "message": "An Unexpected Error Occurred"
    },
    UserRegistrationCountExceeded: {
        "statusCode": 500,
        "error": "UserRegistrationCountExceeded",
        "message": "No More user can be registered"
    },
    FirebaseRecordOwnedAlready: {
        "statusCode": 400,
        "error": "FirebaseRecordOwnedAlready",
        "message": "FirebaseRecordOwnedAlready"
    },
    DuplicateFirebaseRecordSaveError: {
        "statusCode": 400,
        "error": "DuplicateFirebaseRecordSaveError",
        "message": "DuplicateFirebaseRecordSaveError"
    },
    CodeshareSaveLimitReachedByUser: {
        "statusCode": 400,
        "error": "CodeshareSaveLimitReachedByUser",
        "message": "CodeshareSaveLimitReachedByUser"
    }
}