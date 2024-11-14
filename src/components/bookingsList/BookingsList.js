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

        return (
            <li key={id} className={styles.bookingItem}>
                <div className={styles.dateInfo}>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Начало</p>
                        <p className={styles.info}>{startDateStr}</p>
                    </div>
                    <p className={styles.info}>—</p>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Конец</p>
                        <p className={styles.info}>{endDateStr}</p>
                    </div>
                </div>
                <div className={styles.infoItemWrapper}>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Тур</p>
                        <p className={styles.info}>{tour_title}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Отель</p>
                        <p className={styles.info}>{hotel_title}</p>
                    </div>
                </div>
                <div className={styles.infoItemWrapper}>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Тип номера</p>
                        <p className={styles.info}>{room_type}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Тип питания</p>
                        <p className={styles.info}>{nutrition_type}</p>
                    </div>
                </div>
                <div className={styles.infoItemWrapper}>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Кол-во взрослых</p>
                        <p className={styles.info}>{adults_amount}</p>
                    </div>
                    <div className={styles.infoItem}>
                        <p className={styles.title}>Кол-во детей</p>
                        <p className={styles.info}>{children_amount}</p>
                    </div>
                </div>
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