/**
 * Файл настраивает маршрутизацию для приложения. 
 */

import { createBrowserRouter } from 'react-router-dom';
  
import { LoginRoute } from './auth/login';

export const createRouter = () =>
    createBrowserRouter([
        {
            path: '/',
            element: (
                <LoginRoute/>
            ),
        },
        {
            path: '/auth/login',
            element: (
                <LoginRoute/>
            ),
        },
    ]);