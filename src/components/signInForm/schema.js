import { object, string } from "yup";

const schema = object().shape({
    email: string().trim().required("Адрес эл. почты обязателен").email("Некорректный адрес эл. почты"),
    password: string()
                .trim()
                .required("Пароль обязателен")
                .min(4, "Минимальная длиина пароля - 4 символа")
                .max(20, "Максимальная длина пароля - 20 символов")
});

export default schema;