import { object, string, ref } from "yup";
import { signInObj } from "../signInForm/schema";

const schema = object().shape({
    ...signInObj,
    name: string().trim().required("Имя обязательно"),
    surname: string().trim().required("Фамилия обязательна"),
    phoneNumber: string()
                    .trim()
                    .required("Номер телефона обязателен")
                    .matches(
                        /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,4}$/,
                        "Некорректный номер телефона"
                    ),
    confirmPassword: string().oneOf([ref("password")], "Пароли должны совпадать")
});

export default schema;