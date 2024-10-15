import { useState, useEffect } from "react";
import { useMutation } from "react-query";

import { createOtp, loginRequest, fetchSession } from "../../api/requests";
import "../../../styles/auth/login.css"

export const LoginRoute: React.FC = () => {
    const [retryDelay, setRetryDelay] = useState(0)
    const [phoneNumber, setPhoneNumber] = useState<string>("")
    const [code, setCode] = useState<string>("")
    const [currentStage, setCurrentStage] = useState<"OtpCreationStage" | "LoginStage">("OtpCreationStage")
    const [validationPhoneMessage, setValidationPhoneMessage] = useState<string>("")
    const [validationCodeMessage, setValidationCodeMessage] = useState<string>("")

    const createOtpMutation = useMutation((phone: string) => createOtp(phone), {
        onSuccess: (data) => { 
            setRetryDelay(data.retryDelay) 
            setCurrentStage("LoginStage")
        },
        onError: () => alert("An error occurred while creating the OTP")
    })

    const loginRequestMutation = useMutation((data: { phone: string; code: number }) => loginRequest(data), {
        onSuccess: async (data) => {
            console.log(data)
            alert("success! user_id: " + data.user._id)
            const sessionData = await fetchSession(data.token);
            console.log("Session data:", sessionData);
        },
        onError: () => alert("An error occurred during login"),
    })
    
    const decrementRetryDelay = () => {
        if (retryDelay <= 0) 
            return
        setRetryDelay((prevDelay) => prevDelay - 1000)
    }

    useEffect(() => {
        const timerID = setInterval(() => decrementRetryDelay(), 1000)
        return () => clearInterval(timerID)
    }, [retryDelay])

    const stageInfo = {
        "OtpCreationStage": "Введите номер телефона для входа в личный кабинет",
        "LoginStage": "Введите проверочный код для входа в личный кабинет"
    }

    const validateAndPost = () => {
        const isPhoneNumberValid = () => {
            if (phoneNumber === "") {
                setValidationPhoneMessage("Поле является обязательным")
                return false
            }
            setValidationPhoneMessage("");
            return true
        }
    
        const isOtpCodeValid = () => {
            if (code.length != 6) {
                setValidationCodeMessage("Код должен содержать 6 цифр")
                return false
            }
            setValidationCodeMessage("");
            return true
        }

        if (!isPhoneNumberValid())
            return
        if (currentStage === "OtpCreationStage")
            createOtpMutation.mutate(phoneNumber);
        else if (isOtpCodeValid())
            loginRequestMutation.mutate({phone: phoneNumber, code: Number(code)})
    }

    const formatPhoneNumber = (value: string) => {
        const digits = deleteNotDigits(value)
        const formattedNumber = digits.replace(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/, "+7 $2 $3 $4 $5")

        if (value.length != 0 && value.charAt(0) === '+' && (formattedNumber.length == 0 || formattedNumber.charAt(0) !== '+'))
            return "+" + formattedNumber
        return formattedNumber
    };

    const deleteNotDigits = (value: string) => {
        return value.replace(/\D/g, "")
    };

    return (
        <div className="auth-content">
            <h1>Вход</h1>
            <p className="stage-info">{stageInfo[currentStage]}</p>
            
            {validationPhoneMessage != "" && (<p className="validation-info">{validationPhoneMessage}</p>)}

            <label>
                <input
                    placeholder="Телефон"
                    name="phoneNumberInput"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                ></input>
            </label>

            {currentStage === "LoginStage" && validationCodeMessage != "" && (
                <p className="validation-info">{validationCodeMessage}</p>
            )}

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
                {currentStage == "OtpCreationStage" ? (
                    <button onClick={validateAndPost}>Продолжить</button>
                ) : (
                    <button onClick={validateAndPost}>Войти</button>
                )}

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
}