/**
 * Файл содержит функции для взаимодействия с API бэкенда.
 */

export const BACKEND_URL = "https://shift-backend.onrender.com";

import axios from "axios";

/* Создает Otp код для указанного номера телефона. */
export const createOtp = async (phone: string) => {
    const { data } = await axios.post(
        BACKEND_URL + '/auth/otp', 
        {"phone": phone}
    );
    return data;
};

/* Выполняет запрос на вход. */
export const loginRequest = async (inputData: {phone: string, code: number}) => {
    const { data } = await axios.post(
        BACKEND_URL + '/users/signin', 
        inputData
    );
    return data;
};

/* Получает данные о текущей сессии пользователя. */
export const fetchSession = async (authorization: string) => {
    const { data } = await axios.get(
        BACKEND_URL + '/users/session', 
        {headers: {"Authorization": `Bearer ${authorization}`}}
    );
    return data;
};
