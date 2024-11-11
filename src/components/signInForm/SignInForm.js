'use client';

import styles from "./signInForm.module.css";
import { helperStyle } from "../input/Input";
import { BASE_URL } from "@/env";
import { Controller } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import Input from "../input/Input";
import PasswordInput from "../passwordInput/PasswordInput";
import UserSpinner from "../loadingSpinners/UserSpinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useUser, useToken, useAdmin } from "../GlobalContext";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import SubmitBtn from "../submitBtn/SubmitBtn";

const SignInForm = () => {
    const { setUser } = useUser();
    const { setToken } = useToken();
    const { setAdmin } = useAdmin();
    const [error, setError] = useState("");
    const router = useRouter();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const { query, queryState, resetQueryState } = useQuery();

    const onSubmit = (data) => {
        query(`${BASE_URL}/auth/signIn`, "POST", {'Content-type': 'application/json'}, JSON.stringify(data))
            .then(res => {
                const { token, ...user } = res;

                user.admin ? setAdmin(true) : setUser(user);
                setToken(token);
                localStorage.setItem("token", token);
                router.back();
                reset();
            })
            .catch(err => {
                setError(err.message);
                setTimeout(resetQueryState, 2000);
            });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Controller
                name="email"
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input 
                            placeholder="Адрес эл. почты"
                            error={errors.email}
                            onChange={onChange}/>
                }
            />
            <Controller
                name="password"
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <PasswordInput
                            placeholder="Пароль"
                            error={errors.password}
                            onChange={onChange}/>
                }
            />
            <div className={styles.submitWrapper}>
                {queryState === "pending" ? <UserSpinner/> :
                <SubmitBtn 
                    style={{width: "100%"}}
                    disabled={queryState !== "idle"}>Войти</SubmitBtn>}
                {queryState === "error" &&
                <FormHelperText sx={helperStyle} error>{error || "Произошла ошибка"}</FormHelperText>}
                {queryState === "fulfilled" &&
                <FormHelperText sx={{...helperStyle, color: "green"}}>Вход выполнен</FormHelperText>}
            </div>
        </form>
    );
}

export default SignInForm;