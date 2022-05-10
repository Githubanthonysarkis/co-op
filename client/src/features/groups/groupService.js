import axios from "axios";

const API_URL = '/api/groups/'

export const getGroupsHTTP = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, config);

    if(response.data){
        return response.data
    }
}

export const createGroupHTTP = async (groupData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(API_URL, groupData, config);

    if(response.data){
        return response.data
    }
}

export const getOneGroupHTTP = async (groupId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + groupId, config);

    if(response.data){
        return response.data
    }
}

export const deleteGroupHTTP = async (groupId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.delete(API_URL + groupId, config);

    if(response.data){
        return response.data
    }
}

export const getTransactionsHTTP = async (groupId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL + groupId + "/transactions", config);

    if(response.data){
        return response.data
    }
}