/**
 * Реализует страницу авторизации пользователя.
 */

import { useState, useEffect } from "react";
import { useMutation } from "react-query";

import { createOtp, loginRequest, fetchSession } from "../../api/requests";
import "../../../styles/auth/login.css";

export const LoginRoute: React.FC = () => {
    //Через сколько милисекунд можно отправить запрос на создание otp
    const [retryDelay, setRetryDelay] = useState<number>(0);

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [code, setCode] = useState<string>("");

    //Процесс входа делится на две стадии - первое создание otp и ввод полученного
    const [currentStage, setCurrentStage] = useState<"OtpCreationStage" | "LoginStage">("OtpCreationStage");

    //Ошибки валидации
    const [validationPhoneMessage, setValidationPhoneMessage] = useState<string>("");
    const [validationCodeMessage, setValidationCodeMessage] = useState<string>("");

    const createOtpMutation = useMutation((phone: string) => createOtp(phone), {
        onSuccess: (data) => { 
            setRetryDelay(data.retryDelay);
            setCurrentStage("LoginStage");
        },
        onError: () => alert("An error occurred while creating the OTP")
    });

    const loginRequestMutation = useMutation((data: { phone: string; code: number }) => loginRequest(data), {
        onSuccess: async (data) => {
            console.log(data);
            alert("success! user_id: " + data.user._id);
            const sessionData = await fetchSession(data.token);
            console.log("Session data:", sessionData);
        },
        onError: () => alert("An error occurred during login"),
    });
    
    const decrementRetryDelay = () => {
        if (retryDelay <= 0) 
            return;
        setRetryDelay((prevDelay) => prevDelay - 1000);
    };

    useEffect(() => {
        const timerID = setInterval(() => decrementRetryDelay(), 1000);
        return () => clearInterval(timerID);
    }, [retryDelay]);

    const stageInfo: Record<string, string> = {
        "OtpCreationStage": "Введите номер телефона для входа в личный кабинет",
        "LoginStage": "Введите проверочный код для входа в личный кабинет",
    };

    // Функция для валидации данных и отправки запроса
    const validateAndPost = (): void => {
        const isPhoneNumberValid = (): boolean => {
            setValidationPhoneMessage("");
            if (phoneNumber === "")
                setValidationPhoneMessage("Поле является обязательным");
            return phoneNumber != "";
        }
    
        const isOtpCodeValid = (): boolean => {
            setValidationCodeMessage("");
            if (code.length != 6) {
                setValidationCodeMessage("Код должен содержать 6 цифр");
            }
            return code.length === 6;
        }
        
        // Если валидация не прошла, выход из функции
        let isValid: boolean = true;
        isValid = isPhoneNumberValid();
        if (currentStage === "LoginStage" && !isOtpCodeValid())
            isValid = isOtpCodeValid() && isValid;
        if (!isValid) return;

        if (currentStage === "OtpCreationStage")
            createOtpMutation.mutate(phoneNumber);
        else
            loginRequestMutation.mutate({phone: phoneNumber, code: Number(code)});
    };

    const formatPhoneNumber = (value: string): string => {
        const digits = deleteNotDigits(value);
        // Форматируем номер в красивый вид
        const formattedNumber = digits.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, "+7 $2 $3 $4 $5");

        // + может быть введен пользователем первым символом
        if (value.length != 0 && value.charAt(0) === '+' && (formattedNumber.length == 0 || formattedNumber.charAt(0) !== '+'))
            return "+" + formattedNumber;
        return formattedNumber;
    };

    const deleteNotDigits = (value: string): string => {
        return value.replace(/\D/g, "");
    };

    return (
        <div className="auth-content">
            <h1>Вход</h1>
            <p className="stage-info">{stageInfo[currentStage]}</p>
            
            {/* Если есть ошибка валидации телефона то выводим ее */}
            {validationPhoneMessage != "" && (<p className="validation-info">{validationPhoneMessage}</p>)}

            <label>
                <input
                    placeholder="Телефон"
                    name="phoneNumberInput"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                ></input>
            </label>

            {/* Если есть ошибка валидации кода otp то выводим ее */}
            {currentStage === "LoginStage" && validationCodeMessage != "" && (
                <p className="validation-info">{validationCodeMessage}</p>
            )}

            {/* Если стадия login то добавляем на страницу input для кода otp */}
            {currentStage === "LoginStage" && (
                <label>
                <input
                    placeholder="Проверочный код"
                    name="codeInput"
                    value={code}
                    onChange={(e) => setCode(deleteNotDigits(e.target.value))}
                    autoComplete="off"
                ></input>
            </label>)}
            
            <div className="buttons">
                
                <button onClick={validateAndPost}>{currentStage === "OtpCreationStage" ? "Продолжить" : "Войти"}</button>
                
                {/* Если стадия login то добавляем кнопку для повторного создания otp кода или просим подождать */}
                {currentStage === "LoginStage" && ( 
                    retryDelay > 0 ? (
                        <p className="time-to-retry">
                            Запросить код повторно можно через {retryDelay / 1000} секунд
                        </p> 
                    ) : (
                        <button className="ask-code-retry" onClick={() => createOtpMutation.mutate(phoneNumber)}>
                            Запросить код повторно
                        </button>
                    )
                )}
            </div>
        </div>
    );
};