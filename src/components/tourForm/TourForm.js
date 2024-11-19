'use client';

import styles from "./tourForm.module.css";
import { helperStyle } from "../input/Input";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import SubmitBtn from "../submitBtn/SubmitBtn";
import AdminSpinner from "../loadingSpinners/AdminSpinner";
import ResetHoc from "../ResetHoc";
import { FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { useAdmin, useToken, useTours } from "../GlobalContext";
import { useRouter } from "next/navigation";
import useQuery from "@/hooks/query.hook";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuid } from "uuid";
import textFields from "./textFields";
import departureCities from "@/lists/departureCities";
import countries from "@/lists/countries";
import { BASE_URL } from "@/env";

const TourForm = ResetHoc(({ tour, countryHotels, reset }) => {
    const { isAdmin } = useAdmin();
    const { token } = useToken();
    const { changeTour } = useTours();
    const router = useRouter();
    const [hotels, setHotels] = useState(tour ? countryHotels : []);

    const { control, handleSubmit, formState: { errors, isDirty, defaultValues }, setValue, getValues, reset: formReset } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            title: tour?.title || "",
            descr: tour?.descr || "",
            notes: tour?.notes || "",
            departureCity: tour?.departure_city || "",
            destinationCountry: tour?.destination_country || "",
            hotelTitle: tour?.hotel_title || "",
            basePrice: tour?.base_price || ""
        }
    });

    const { query: q1, queryState: qs1 } = useQuery();
    const { query: q2, queryState: qs2, resetQueryState } = useQuery();

    useEffect(() => {
        if (!isAdmin) router.push("/403");
    }, [isAdmin]);

    const onSubmit = (data) => {
        const { hotelTitle, ...rest } = data;
        const id = tour?.id || uuid();

        const body = {
            id,
            hotelId: hotels.find(hotel => hotel.hotel_title === hotelTitle).id,
            ...rest
        }, headers = {'Content-type': 'application/json', 'authorization': `Bearer ${token}`};

        q2(`${BASE_URL}/tour/${tour ? `edit/${id}` : "add"}`, tour ? "PATCH" : "POST", headers, JSON.stringify(body))
            .then(res => {
                if (tour) {
                    changeTour(res);
                    formReset(data);
                } else setTimeout(reset, 2000);
            })
            .finally(() => setTimeout(resetQueryState, 2000));
    }

    const onCountryChange = (e) => {
        const isSameCountry = e.target.value === defaultValues.destinationCountry;
        const options = { shouldDirty: true, shouldValidate: isSameCountry };

        setValue("hotelTitle", isSameCountry ? defaultValues.hotelTitle : "", options);
        setValue("basePrice", isSameCountry ? defaultValues.basePrice : "", options);

        q1(`${BASE_URL}/hotel/getHotels/${e.target.value}`)
            .then(res => setHotels(res))
            .catch(() => setHotels([]));
    }

    const renderTextFields = () => textFields.map(field => {
        const { name, placeholder, multiline } = field;

        return (
            <Controller
                key={name}
                name={name}
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input
                            defaultValue={tour ? tour[name] : ""}
                            placeholder={placeholder}
                            error={errors[name]}
                            onChange={onChange}
                            multiline={multiline}/>
                }
            />
        );
    });

    const textFieldsEls = renderTextFields();

    return isAdmin ? (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {textFieldsEls}
            <SelectMenu
                defaultValue={tour?.departure_city}
                values={departureCities}
                name="departureCity"
                control={control}
                error={errors.departureCity}>Город вылета</SelectMenu>
            <SelectMenu
                defaultValue={tour?.destination_country}
                values={countries}
                name="destinationCountry"
                control={control}
                onChange={onCountryChange}
                error={errors.destinationCountry}>Страна</SelectMenu>
            {(() => {
                switch (qs1) {
                    case "pending": return <AdminSpinner/>;
                    case "error":
                        return <FormHelperText 
                                    sx={helperStyle}
                                    error>Не удалось загрузить отели</FormHelperText>;
                }
            })()}
            {hotels.length && qs1 !== "pending" && qs1 !== "error" ?
            <>
            <SelectMenu
                defaultValue={getValues("destinationCountry") === defaultValues.destinationCountry ? defaultValues.hotelTitle : ""}
                values={hotels.map(hotel => hotel.hotel_title)}
                name="hotelTitle"
                control={control}
                error={errors.hotelTitle}>Отель</SelectMenu>
            <Controller
                name="basePrice"
                control={control}
                render={
                    ({ field: { onChange } }) =>
                        <Input
                            defaultValue={getValues("destinationCountry") === defaultValues.destinationCountry ? defaultValues.basePrice : ""}
                            placeholder="Начальная цена"
                            error={errors.basePrice}
                            onChange={onChange}
                            type="number"/>
                }
            />
            <div className={styles.submitWrapper}>
                {qs2 === "pending" ? <AdminSpinner/> :
                <SubmitBtn
                    disabled={qs2 !== "idle" || (tour && !isDirty)}
                    style={{width: "100%"}}>{tour ? "Сохранить изменения" : "Добавить"}</SubmitBtn>}
                {qs2 === "error" &&
                <FormHelperText sx={helperStyle} error>Произошла ошибка</FormHelperText>}
                {qs2 === "fulfilled" &&
                <FormHelperText sx={{...helperStyle, color: "green"}}>
                    {tour ? "Изменения успешно сохранены" : "Тур успешно добавлен"}
                </FormHelperText>}
            </div>
            </> : null}
        </form>
    ) : null;
});

export default TourForm;