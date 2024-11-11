import styles from "./page.module.css";
import { BASE_URL } from "@/env";
import UserInfo from "@/components/userInfo/UserInfo";
import BookingsList from "@/components/bookingsList/BookingsList";
import { getData } from "@/app/admin/edit-tour/[id]/page";

export const metadata = {
    title: "Личный кабинет"
};

const UserPage = async ({ params }) => {
    const bookings = await getData(`${BASE_URL}/booking/get/${params.id}`);

    return (
        <main className={styles.main}>
            <h1>Личный кабинет</h1>
            <UserInfo/>
            <h2>{bookings.length ? "Забронированные туры" : "У вас пока нет забронированных туров"}</h2>
            <BookingsList bookings={bookings}/>
        </main>
    );
}

export default UserPage;