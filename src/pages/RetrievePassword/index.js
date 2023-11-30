import axios from "axios";

// Function to initiate password reset
const initiatePasswordReset = async (email) => {
  try {
    const response = await axios.post(
      "/wp-json/wc/v3/customers/lost_password",
      {
        user_login: email,
      }
    );
    // Handle success
    console.log(response.data);
  } catch (error) {
    // Handle error
    console.error(error.response.data);
  }
};

// Function to reset password
const resetPassword = async (key, email, newPassword) => {
  try {
    const response = await axios.post(
      "/wp-json/wc/v3/customers/reset_password",
      {
        key,
        login: email,
        password: newPassword,
      }
    );
    // Handle success
    console.log(response.data);
  } catch (error) {
    // Handle error
    console.error(error.response.data);
  }
};
