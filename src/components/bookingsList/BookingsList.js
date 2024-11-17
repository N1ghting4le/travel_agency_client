'use client';

import styles from "./bookingsList.module.css";
import Link from "next/link";
import { useUser } from "../GlobalContext";

const options = {
    weekday: "short",
    month: "short",
    day: "numeric"
};

const BookingsList = ({ bookings }) => {
    const { user } = useUser();

    if (!user) return null;

    const renderBookings = () => bookings.map(item => {
        const {
            tour_id, nutrition_type, adults_amount, children_amount, room_type,
            id, start_date, end_date, tour_title, hotel_title, total_price
        } = item;

        const startDateStr = new Date(start_date).toLocaleDateString("ru-RU", options);
        const endDateStr = new Date(end_date).toLocaleDateString("ru-RU", options);

        const itemArr = [
            ["Тур", tour_title], ["Начало", startDateStr], ["Конец", endDateStr],
            ["Отель", hotel_title], ["Тип номера", room_type], ["Тип питания", nutrition_type],
            ["Кол-во взрослых", adults_amount], ["Кол-во детей", children_amount]
        ];

        return (
            <li key={id} className={styles.bookingItem}>
                {itemArr.map(([title, info]) =>
                <div key={title} className={styles.infoItem}>
                    <p className={styles.title}>{title}</p>
                    <p className={styles.info}>{info}</p>
                </div>)}
                <div className={styles.infoItem}>
                    <p className={styles.title}>Цена</p>
                    <p className={styles.price}>${total_price}</p>
                </div>
                <div>
                    <Link href={`/tours/${tour_id}`}>
                        <button className={styles.btn}>Посмотреть тур</button>
                    </Link>
                </div>
            </li>
        );
    });

    const bookingItems = renderBookings();

    return (
        <ul className={styles.bookingsList}>
            {bookingItems}
        </ul>
    );
}

export default BookingsList;