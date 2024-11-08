import { object, string, ref } from "yup";

const schema = object().shape({
    name: string().trim().required("Имя обязательно"),
    surname: string().trim().required("Фамилия обязательна"),
    email: string().trim().required("Адрес эл. почты обязателен").email("Некорректный адрес эл. почты"),
    phoneNumber: string()
                    .trim()
                    .required("Номер телефона обязателен")
                    .matches(
                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/,
                        "Некорректный номер телефона"
                    ),
    password: string()
                .trim()
                .required("Пароль обязателен")
                .min(4, "Минимальная длиина пароля - 4 символа")
                .max(20, "Максимальная длина пароля - 20 символов"),
    confirmPassword: string().oneOf([ref("password")], "Пароли должны совпадать")
});

export default schema;