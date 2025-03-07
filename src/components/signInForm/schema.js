import { object, string } from "yup";

export const signInObj = {
    email: string().trim().required("Адрес эл. почты обязателен").email("Некорректный адрес эл. почты"),
    password: string()
                .trim()
                .required("Пароль обязателен")
                .min(8, "Минимальная длиина пароля - 8 символов")
                .max(20, "Максимальная длина пароля - 20 символов")
};

const schema = object().shape(signInObj);

export default schema;