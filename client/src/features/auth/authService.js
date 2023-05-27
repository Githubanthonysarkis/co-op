import axios from "axios";

const API_URL = "/api/user/";

export const registerUser = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    // store user in localstorage
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};
