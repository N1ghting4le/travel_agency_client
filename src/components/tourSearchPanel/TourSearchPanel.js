'use client';

import { BASE_URL } from "@/env";
import styles from "./tourSearchPanel.module.css";
import SelectMenu from "../selectMenu/SelectMenu";
import SubmitBtn from "../submitBtn/SubmitBtn";
import { Place, FlightTakeoff, FlightLand, Restaurant, KingBed } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useTours } from "../GlobalContext";
import countries from "@/lists/countries";
import departureCities from "@/lists/departureCities";
import nutritionTypes from "@/lists/nutritionTypes";
import roomTypes from "@/lists/roomTypes";

const forMenus = [
    ["Город вылета", "departureCity", departureCities, false, FlightTakeoff],
    ["Страна", "destinationCountry", countries, false, FlightLand],
    ["Типы питания", "nutrition", nutritionTypes.map(t => `${t.value} - ${t.descr}`), true, Restaurant],
    ["Типы номеров", "rooms", roomTypes.map(t => `${t.value} - ${t.descr}`), true, KingBed]
];

const TourSearchPanel = ({ query, resetQueryState }) => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            departureCity: departureCities[0],
            destinationCountry: countries[0]
        }
    });
    const { setTours } = useTours();

    const onSubmit = (data) => {
        const body = {
            ...data,
            nutrition: data.nutrition?.map(item => item.split(" - ")[0]) || [],
            rooms: data.rooms?.map(item => item.split(" - ")[0]) || []
        }
        
        query(`${BASE_URL}/tour/getTours`, "POST", {'Content-type': 'application/json'}, JSON.stringify(body))
            .then(res => setTours(res))
            .finally(() => setTimeout(resetQueryState, 2000));
    }

    const renderMenus = () => forMenus.map(([text, name, values, multiple, Icon]) => (
        <SelectMenu
            key={name}
            values={values}
            name={name}
            control={control}
            multiple={multiple}
            defaultValue={multiple ? [] : values[0]}
        >
            <div style={{display: "flex", gap: "5px"}}>
                <Icon fontSize="small"/>
                <p>{text}</p>
            </div>
        </SelectMenu>
    ));

    const menus = renderMenus();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h3>Поиск тура</h3>
            <div className={styles.menusWrapper}>
                {menus}
            </div>
            <SubmitBtn style={{
                paddingLeft: "20px",
                paddingRight: "26px",
                width: "fit-content",
                alignSelf: "flex-end",
                display: "flex",
                alignItems: "center",
                gap: "2px"
            }}><Place fontSize="small"/><p>Найти</p></SubmitBtn>
        </form>
    );
}

export default TourSearchPanel;