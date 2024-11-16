'use client';

import { BASE_URL } from "@/env";
import styles from "./hotelForm.module.css";
import { helperStyle, labelStyle } from "../input/Input";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import Stars from "../stars/Stars";
import Photos from "../photos/Photos";
import SubmitBtn from "../submitBtn/SubmitBtn";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import ResetHoc from "../ResetHoc";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin, useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuid } from "uuid";
import { textFields, largeTextFields } from "./fields";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";
import countries from "@/lists/countries";

const HotelForm = ResetHoc(({ reset }) => {
    const { isAdmin } = useAdmin();
    const { token } = useToken();
    const router = useRouter();
    const [stars, setStars] = useState(1);

    const { register, control, trigger, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            nutritionTypes: [],
            roomTypes: []
        },
        mode: "onChange"
    });

    const { query, queryState, resetQueryState } = useQuery();
    
    useEffect(() => {
        if (!isAdmin) router.push("/403");
    }, [isAdmin]);

    const onSubmit = (data) => {
        const { photos, ...rest } = data;

        const body = {
            id: uuid(),
            ...rest,
            stars,
            images: photos.map(item => item.name)
        }

        const formData = new FormData();

        Object.entries(body).forEach(([key, value]) => formData.append(key, value));

        photos.forEach(photo => formData.append("photos", photo));

        query(`${BASE_URL}/hotel/add`, "POST", {'authorization': `Bearer ${token}`}, formData)
            .then(() => setTimeout(reset, 2000))
            .finally(() => setTimeout(resetQueryState, 2000));
    }

    const renderTextFields = (fields, multiline) => fields.map(field => {
        const { name, placeholder } = field;

        return (
            <Controller
                key={name}
                name={name}
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input 
                            placeholder={placeholder}
                            error={errors[name]}
                            onChange={onChange}
                            multiline={multiline}/>
                }
            />
        );
    });

    const renderCheckboxFields = (arr, name) => arr.map((item, i) => {
        const { value, descr } = item;

        return (
            <FormControlLabel
                key={value}
                control={
                    <Checkbox
                        value={value}
                        sx={{ marginLeft: "10px" }}
                        {...register(`${name}.${i}`, { onChange: () => trigger(name) })}/>
                }
                label={`${value} - ${descr}`}
                sx={{
                    "& .MuiFormControlLabel-label": { fontFamily: labelStyle.fontFamily },
                    width: "min(100%, max-content)"
                }}
            />
        );
    });

    const textFieldsEls = renderTextFields(textFields, false);
    const nutritionFieldsEls = renderCheckboxFields(nutritionTypes, "nutritionTypes");
    const roomFieldsEls = renderCheckboxFields(roomTypes, "roomTypes");
    const largeTextFieldsEls = renderTextFields(largeTextFields, true);

    return isAdmin ? (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} encType="multipart/form-data">
            <div className={styles.textFieldsWrapper}>
                {textFieldsEls}
                <SelectMenu 
                    values={countries}
                    name="country"
                    control={control}
                    error={errors.country}>Страна</SelectMenu>
            </div>
            <div className={styles.starsWrapper}>
                <h3>Установите звёздность</h3>
                <Stars stars={stars} setStars={setStars}/>
            </div>
            <div className={styles.checkboxWrapper}>
                <h3>Выберите типы питания</h3>
                {nutritionFieldsEls}
                {errors.nutritionTypes &&
                <FormHelperText sx={helperStyle} error>{errors.nutritionTypes.root.message}</FormHelperText>}
            </div>
            <div className={styles.checkboxWrapper}>
                <h3>Выберите типы номеров</h3>
                {roomFieldsEls}
                {errors.roomTypes &&
                <FormHelperText sx={helperStyle} error>{errors.roomTypes.root.message}</FormHelperText>}
            </div>
            <Photos control={control} trigger={trigger} error={errors.photos}/>
            <div className={styles.textFieldsWrapper}>
                {largeTextFieldsEls}
            </div>
            <div className={styles.submitWrapper}>
                {queryState === "pending" ? <AdminSpinner/> : <SubmitBtn
                                                                disabled={queryState !== "idle"}
                                                                style={{width: "100%"}}>Добавить</SubmitBtn>}
                {queryState === "error" &&
                <FormHelperText sx={helperStyle} error>Произошла ошибка</FormHelperText>}
                {queryState === "fulfilled" &&
                <FormHelperText sx={{...helperStyle, color: "green"}}>Отель успешно добавлен</FormHelperText>}
            </div>
        </form>
    ) : null;
});

export default HotelForm;