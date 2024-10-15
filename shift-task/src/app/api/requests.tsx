export const backendUrl = "https://shift-backend.onrender.com";

import axios from "axios";

export const createOtp = async (phone: string) => {
    const { data } = await axios.post('https://shift-backend.onrender.com/auth/otp', {"phone": phone});
    return data;
};

export const loginRequest = async (inputData: {phone: string, code: number}) => {
    const { data } = await axios.post('https://shift-backend.onrender.com/users/signin', inputData);
    return data;
};

export const fetchSession = async (authorization: string) => {
    const { data } = await axios.get('https://shift-backend.onrender.com/users/session', {headers: {"Authorization": `Bearer ${authorization}`}});
    return data;
};
