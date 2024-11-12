import styles from "./page.module.css";
import { BASE_URL } from "@/env";
import DisplayStars from "@/components/displayStars/DisplayStars";
import { Divider } from "@mui/material";
import TourReviews from "@/components/tourReviews/TourReviews";
import AllTourPhotos from "@/components/allTourPhotos/AllTourPhotos";
import BookTourModal from "@/components/bookTourModal/BookTourModal";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LanguageIcon from '@mui/icons-material/Language';
import SurfingIcon from '@mui/icons-material/Surfing';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { getData } from "@/app/admin/edit-tour/[id]/page";

const TourPage = async ({ params }) => {
    const tour = await getData(`${BASE_URL}/tour/get/${params.id}`);
    const {
        id, departure_city, destination_country, tour_title, tour_descr, tour_notes,
        hotel_title, resort, address, hotel_descr, stars, hotel_notes, base_price,
        nutrition_types, room_types, photos
    } = tour;

    const tourInfoArr = [
        [LocationCityIcon, "Город вылета:", departure_city],
        [LanguageIcon, "Страна прибытия:", destination_country],
        [SurfingIcon, "Курорт:", resort]
    ];

    return (
        <main className={styles.main}>
            <h1>{tour_title}</h1>
            <div className={styles.tourInfo}>
                {tourInfoArr.map(([Icon, title, info]) => (
                    <div key={title} className={styles.tourInfoItem}>
                        <div className={styles.tourInfoItemTitle}>
                            <Icon style={{color: "salmon"}}/>
                            <p className={styles.bold}>{title}</p>
                        </div>
                        <p>{info}</p>
                    </div>
                ))}
                <p className={styles.priceWrapper}>
                    от <span className={styles.price}>${base_price}</span>/ночь
                </p>
            </div>
            <p>{tour_descr}</p>
            {tour_notes &&
            <div className={styles.notes}>
                <p className={styles.bold}>Примечания:</p>
                <p className={styles.tourDescr}>{tour_notes}</p>
            </div>}
            <div className={styles.hotelInfo}>
                <h2>Отель:</h2>
                <div className={styles.hotelInfoTop}>
                    <div className={styles.mainHotelInfo}>
                        <h3>{hotel_title}</h3>
                        <DisplayStars stars={stars}/>
                        <div className={styles.addressWrapper}>
                            <PinDropIcon/>
                            <p>{address}</p>
                        </div>
                    </div>
                    <BookTourModal
                        id={id}
                        roomTypes={room_types}
                        nutrTypes={nutrition_types}
                        basePrice={base_price}/>
                </div>
                <div className={styles.photos}>
                    {photos.slice(0, 5).map((src, i) => (
                        <img 
                            key={src}
                            src={`${BASE_URL}/${destination_country}/${resort}/${hotel_title}/${src}`}
                            alt={`hotel photo ${i + 1}`}
                            className={styles.photo}/>
                    ))}
                    <AllTourPhotos 
                        baseSrc={`${BASE_URL}/${destination_country}/${resort}/${hotel_title}`} 
                        photos={photos}
                        title={hotel_title}/>
                </div>
            </div>
            <Divider/>
            <p>{hotel_descr}</p>
            {hotel_notes &&
            <div className={styles.notes}>
                <p className={styles.bold}>Примечания:</p>
                <p className={styles.tourDescr}>{hotel_notes}</p>
            </div>}
            <TourReviews id={id}/>
        </main>
    );
}

export default TourPage;