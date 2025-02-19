'use client';

import styles from "./signUpForm.module.css";
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
import { useUser, useToken } from "../GlobalContext";
import { v4 as uuid } from "uuid";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import SubmitBtn from "../submitBtn/SubmitBtn";
import fields from "./fields";

const SignUpForm = () => {
    const { setUser } = useUser();
    const { setToken } = useToken();
    const [error, setError] = useState("");
    const router = useRouter();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const { query, queryState, resetQueryState } = useQuery();

    const onSubmit = (data) => {
        const { confirmPassword, ...rest } = data;
        const body = { id: uuid(), ...rest };

        query(`${BASE_URL}/auth/signUp`, "POST", {'Content-type': 'application/json'}, JSON.stringify(body))
            .then(res => {
                const { password, ...user } = body;

                setToken(res);
                setUser(user);
                router.back();
            })
            .catch(err => {
                setError(err.message);
                setTimeout(resetQueryState, 2000);
            });
    }

    const renderFields = (arr, Input) => arr.map(({ name, placeholder }) => (
        <Controller
            key={name}
            name={name}
            control={control}
            render={
                ({ field: { onChange } }) =>
                    <Input 
                        placeholder={placeholder}
                        error={errors[name]}
                        onChange={onChange}/>
            }
        />
    ));

    const fieldsEls = renderFields(fields.slice(0, 4), Input);
    const passwordFields = renderFields(fields.slice(4), PasswordInput);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.fieldsWrapper}>
                {fieldsEls}
            </div>
            {passwordFields}
            <div className={styles.submitWrapper}>
                {queryState === "pending" ? <UserSpinner/> :
                <SubmitBtn 
                    style={{width: "100%"}}
                    disabled={queryState !== "idle"}>Регистрация</SubmitBtn>}
                {queryState === "error" &&
                <FormHelperText sx={helperStyle} error>{error || "Произошла ошибка"}</FormHelperText>}
                {queryState === "fulfilled" &&
                <FormHelperText sx={{...helperStyle, color: "green"}}>Регистрация прошла успешно</FormHelperText>}
            </div>
        </form>
    );
}

export default SignUpForm;