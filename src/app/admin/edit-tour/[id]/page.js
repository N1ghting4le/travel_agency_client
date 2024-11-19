import styles from "./page.module.css";
import { BASE_URL } from "@/env";
import TourForm from "@/components/tourForm/TourForm";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Редактирование тура"
};

export const getData = async (url) => {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) return redirect("/403");

    return await res.json();
}

const EditTourPage = async ({ params, searchParams }) => {
    const [tour, hotels] = await Promise.all([
        getData(`${BASE_URL}/tour/get/${params.id}`),
        getData(`${BASE_URL}/hotel/getHotels/${searchParams.country}`)
    ]);
    const {
        id, departure_city, destination_country, tour_title, tour_descr, tour_notes, hotel_title,
        base_price, hotel_id
    } = tour;
    const editedTour = {
        id, departure_city, destination_country, title: tour_title, descr: tour_descr,
        notes: tour_notes, hotel_title, base_price, hotel_id
    };

    return (
        <main className={styles.main}>
            <h1>Редактирование тура</h1>
            <TourForm tour={editedTour} countryHotels={hotels}/>
        </main>
    );
}

export default EditTourPage;