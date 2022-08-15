import axios from "axios";

const API_URL = "/api/groups/";

export const getGroupsHTTP = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  if (response.data) {
    return response.data;
  }
};

export const createGroupHTTP = async (groupData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log(groupData)
  const response = await axios.post(API_URL, groupData, config);

  if (response.data) {
    return response.data;
  }
};

export const getOneGroupHTTP = async (groupId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + groupId, config);

  if (response.data) {
    return response.data;
  }
};

export const deleteGroupHTTP = async (groupId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + groupId, config);

  if (response.data) {
    return response.data;
  }
};

export const getTransactionsHTTP = async (groupId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + groupId + "/transactions", config);

  if (response.data) {
    return response.data;
  }
};

export const addTransactionHTTP = async (groupId, transactionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    API_URL + groupId + "/transactions",
    transactionData,
    config
  );

  if (response.data) {
    return response.data;
  }
};

export const deleteTransactionHTTP = async (groupId, transactionId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(
    API_URL + groupId + "/transactions/" + transactionId,
    config
  );

  if (response.data) {
    return response.data;
  }
};

export const addMemberHTTP = async (groupId, formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL + groupId, formData, config);

  if (response.data) {
    return response.data;
  }
};

export const kickMemberHTTP = async (groupId, data, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    API_URL + groupId + "/members",
    data,
    config
  );

  if (response.data) {
    return response.data;
  }
};

export const leaveGroupHTTP = async (groupId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + groupId + "/leave", config);

  if (response.data) {
    return response.data;
  }
};
