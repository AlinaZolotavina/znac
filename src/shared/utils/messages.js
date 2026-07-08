export const INTERNAL_SERVER_ERROR_MSG =
  "Request error. There may be a connection problem or the server is unavailable. Wait and try again.";
export const DEFAULT_ERROR_MSG = "Something went wrong...";
export const NOT_FOUND_ERROR_MSG = "Nothing found";
export const BAD_REQUEST_ERROR_MSG =
  "The entered data was not validated on the server";

// user and authorization
export const SUCCESSFUL_SIGNUP_MSG = "You have successfully signed up";
export const USER_NOT_FOUND_ERROR_MSG = "User is not found";
export const SIGNUP_ERROR_MSG =
  "Failed to sign up. There may be a connection problem or the server is unavailable. Please wait and try again.";
export const AUTHORIZATION_FAILED_ERROR_MSG = "Authorisation Error";
export const UNAUTHORIZED_ERROR_MSG = "Authorization required";
export const SIGNOUT_ERROR_MSG =
  "Failed to sign out. There may be a connection problem or the server is unavailable. Please wait and try again.";
export const SUCCESSFUL_SIGNOUT_MSG = "You have successfully signed out";

// reset password
export const RESET_PASSWORD_EMAIL_SENT_MSG =
  "E-mail has been sent, please follow the instructions.";
export const PASSWORDS_DO_NOT_MATCH_ERROR_MSG =
  "The entered passwords do not match";
export const RESET_LINK_INVALID_ERROR_MSG =
  "Wrong reset link or it was expired";
export const PASSWORD_SAME_AS_PREVIOUS_ERROR_MSG =
  "Your new password must not be the same as the previous one";

// email
export const UPDATE_EMAIL_EMAIL_SENT_MSG =
  "E-mail has been sent, please follow the instructions.";
export const EMAIL_UPDATE_REQUEST_ERROR_MSG =
  "Error! E-mail change request failed";
export const EMAIL_UPDATED_SUCCESSFULLY_MSG =
  "E-mail has been successfully updated";
export const EMAIL_UPDATE_ERROR_MSG = "Error! E-mail has not been updated";

export const PASSWORD_UPDATED_SUCCESSFULLY_MSG =
  "E-mail has been successfully updated";
export const PASSWORD_UPDATE_ERROR_MSG = "Error! E-mail has not been updated";

// photos
export const PHOTO_NOT_FOUND_ERROR_MSG = "Photo is not found";
export const PHOTO_FORBIDDEN_ERROR_MSG =
  "You are not allowed to delete the photo.";
export const ADD_PHOTO_ERROR_MSG =
  "Failed to add photo. Please wait and try again later.";
export const SUCCESSFUL_PHOTO_DELETE_MSG = "Photo was deleted.";
export const DELETE_PHOTO_ERROR_MSG =
  "Failed to delete photo. Please wait and try again later.";
export const PHOTO_UPLOAD_ERROR_MSG = "Upload response is invalid";
export const PHOTO_ADDED_SUCCESSFULLY_MSG = "Photo was added successfully";
export const PHOTOS_ADDED_SUCCESSFULLY_MSG = (count) =>
  `${count} photos were added successfully`;
export const EDIT_HASHTAGS_ERROR_MSG =
  "Failed to edit hashtags. Please wait and try again later.";
export const SUCCESSFUL_HASHTAGS_UPDATE_MSG =
  "Hashtags were edited successfully";

// projects
export const PROJECT_ADDED_SUCCESSFULLY_MSG = "Project was successfully added";
export const PROJECT_ADD_ERROR_MSG = "Project cannot be added";
export const PROJECT_EDITED_SUCCESSFULLY_MSG =
  "Project was successfully edited";
export const PROJECT_EDIT_ERROR_MSG = "Editing error, please try again later";

// posts
export const POST_ADDED_SUCCESSFULLY_MSG = "Post was successfully added";
export const POST_ADD_ERROR_MSG = "Post cannot be added";
export const POST_EDITED_SUCCESSFULLY_MSG = "Post was successfully edited";
export const POST_EDIT_ERROR_MSG = "Editing error, please try again later";

// contact form
export const CONTACT_MESSAGE_SENT_MSG = "Your message has been sent.";
export const CONTACT_MESSAGE_ERROR_MSG =
  "Failed to send the message. Please try again later.";
