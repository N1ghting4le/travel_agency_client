'use client';

import styles from "./bookForm.module.css";
import dayjs from "dayjs";
import { helperStyle } from "../input/Input";
import { BASE_URL } from "@/env";
import { Controller } from "react-hook-form";
import { FormHelperText } from "@mui/material";
import Input from "../input/Input";
import SelectMenu from "../selectMenu/SelectMenu";
import SubmitBtn from "../submitBtn/SubmitBtn";
import UserSpinner from "../loadingSpinners/UserSpinner";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Restaurant, KingBed } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useToken } from "../GlobalContext";
import { v4 as uuid } from "uuid";
import schema from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import useQuery from "@/hooks/query.hook";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";
import { ruRU } from "@mui/x-date-pickers/locales";
import "dayjs/locale/ru";

const today = dayjs();
const minStartDate = today.add(1, "week");
const maxStartDate = today.add(3, "month");
const defaultEndDate = minStartDate.add(1, "week");

const amounts = [
    ["Кол-во взрослых", "adultsAmount", 1],
    ["Кол-во детей", "childrenAmount", 0]
];

const BookForm = ({ id, userId, roomTypes: rts, nutrTypes, basePrice }) => {
    const [totalPrice, setTotalPrice] = useState(basePrice);
    const { token } = useToken();
    const [booking, setBooking] = useState({
        roomType: 1,
        nutrType: 1,
        adultsAmount: 1,
        childrenAmount: 0,
        startDate: minStartDate,
        endDate: defaultEndDate
    });

    const { control, handleSubmit, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            adultsAmount: 1,
            childrenAmount: 0
        }
    });

    const { query, queryState, resetQueryState } = useQuery();

    useEffect(() => {
        if (!isValid) return;

        const { roomType, nutrType, adultsAmount, childrenAmount, startDate, endDate } = booking;
        const dayDiff = endDate.diff(startDate, "day");

        setTotalPrice(
            +(basePrice * dayDiff * (dayDiff === 1 ? 1 : 0.9) * roomType * (roomType === 1 ? 1 : 0.75) *
            nutrType * (nutrType === 1 ? 1 : 0.8) * adultsAmount * (adultsAmount === 1 ? 1 : 0.85) *
            (childrenAmount + 1) * (childrenAmount ? 0.7 : 1)).toFixed(2)
        );
    }, [booking, isValid]);

    const changeStartDate = (startDate) => {
        setBooking(booking => ({...booking, startDate, endDate: startDate.add(1, "week")}));
    }

    const changeEndDate = (endDate) => setBooking(booking => ({...booking, endDate}));

    const onSubmit = (data) => {
        const body = {
            id: uuid(),
            userId,
            tourId: id,
            startDate: booking.startDate.toDate(),
            endDate: booking.endDate.toDate(),
            bookingDate: new Date(),
            totalPrice,
            ...data
        };

        query(
            `${BASE_URL}/booking/add`,
            "POST",
            {'Content-type': 'application/json', 'authorization': `Bearer ${token}`},
            JSON.stringify(body)
        ).finally(() => setTimeout(resetQueryState, 2000));
    }

    const renderInputs = () => amounts.map(([text, name, defaultValue]) => (
        <Controller
            key={name}
            name={name}
            control={control}
            render={
                ({ field: { onChange } }) =>
                    <Input
                        placeholder={text}
                        defaultValue={defaultValue}
                        error={errors[name]}
                        onChange={(e) => {
                            onChange(e);
                            setBooking(booking => ({...booking, [name]: +e.target.value}));
                        }}
                        type="number"/>
            }
        />
    ));

    const inputs = renderInputs();

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.fields}>
            <LocalizationProvider
                adapterLocale="ru"
                dateAdapter={AdapterDayjs}
                localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}>
                <div className={styles.calendarWrapper}>
                    <p>Дата начала:</p>
                    <DatePicker
                        value={booking.startDate}
                        minDate={minStartDate}
                        maxDate={maxStartDate}
                        onChange={changeStartDate}/>
                </div>
                <div className={styles.calendarWrapper}>
                    <p>Дата окончания:</p>
                    <DatePicker
                        value={booking.endDate}
                        minDate={booking.startDate.add(1, "day")}
                        maxDate={booking.startDate.add(1, "month")}
                        onChange={changeEndDate}/>
                </div>
                <SelectMenu
                    name="roomType"
                    control={control}
                    values={rts.map(item => `${item} - ${roomTypes.find(t => t.value === item).descr}`)}
                    error={errors.roomType}
                    disableScrollLock
                    onChange={(e) => setBooking(booking => (
                        {...booking, roomType: rts.indexOf(e.target.value.split(" - ")[0]) + 1}
                    ))}>
                    <div style={{display: "flex", gap: "5px"}}>
                        <KingBed fontSize="small"/>
                        <p>Тип номера</p>
                    </div>
                </SelectMenu>
                <SelectMenu
                    name="nutrType"
                    control={control}
                    values={nutrTypes.map(item => `${item} - ${nutritionTypes.find(t => t.value === item).descr}`)}
                    error={errors.nutrType}
                    disableScrollLock
                    onChange={(e) => setBooking(booking => (
                        {...booking, nutrType: nutrTypes.indexOf(e.target.value.split(" - ")[0]) + 1}
                    ))}>
                    <div style={{display: "flex", gap: "5px"}}>
                        <Restaurant fontSize="small"/>
                        <p>Тип питания</p>
                    </div>
                </SelectMenu>
                {inputs}
            </LocalizationProvider>
            </div>
            {isValid && 
            <p className={styles.priceWrapper}>
                Итоговая стоимость тура: <span className={styles.price}>${totalPrice}</span>
            </p>}
            <div className={styles.submitWrapper}>
                {queryState === "pending" ? <UserSpinner/> :
                <SubmitBtn
                    style={{width: "100%"}}
                    disabled={queryState !== "idle"}>Забронировать</SubmitBtn>}
                {queryState === "error" &&
                <FormHelperText sx={helperStyle} error>Произошла ошибка</FormHelperText>}
                {queryState === "fulfilled" &&
                <FormHelperText sx={{...helperStyle, color: "green"}}>Тур забронирован</FormHelperText>}
            </div>
        </form>
    );
}

export default BookForm;