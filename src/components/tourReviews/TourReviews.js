'use client';

import { BASE_URL } from "@/env";
import styles from "./tourReviews.module.css";
import useQuery from "@/hooks/query.hook";
import { useState, useEffect } from "react";
import { useAdmin, useUser } from "../GlobalContext";
import { useRouter } from "next/navigation";
import TourLoading from "../loadingSpinners/TourLoading";
import ReviewModal from "../reviewModal/ReviewModal";
import EditIcon from '@mui/icons-material/Edit';

export const reviewStr = (length) => {
    let strEnd = "отзыв", remainder = length % 10;

    if (!length) return "Нет отзывов";

    if ((length > 4 && length < 21) || !remainder || remainder > 4) strEnd = "отзывов";
    else if (remainder > 1 && remainder < 5) strEnd = "отзыва";
    
    return length + " " + strEnd;
}

const TourReviews = ({ id }) => {
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false);
    const [review, setReview] = useState(null);
    const { query, queryState } = useQuery();
    const { isAdmin } = useAdmin();
    const { user } = useUser();
    const router = useRouter();

    const getReviews = () => {
        query(`${BASE_URL}/review/get/${id}`).then(res => setReviews(res));
    }

    useEffect(getReviews, []);

    const openModal = (review = null) => {
        if (!review && !user) return router.push("/sign-in");

        setReview(review);
        setOpen(true);
    }

    const renderReviews = () => reviews.map(item => {
        const { id, name, surname, mark, review_text, user_id } = item;

        return (
            <li key={id} className={styles.review}>
                <div className={styles.reviewMain}>
                    <p style={{fontWeight: 600}}>{mark}</p>
                    <div className={styles.vertical}/>
                    <p>{name} {surname}</p>
                    <EditIcon
                        style={{
                            display: isAdmin || user?.id === user_id ? "block" : "none",
                            cursor: "pointer"
                        }}
                        onClick={() => openModal(item)}
                        fontSize="small"/>
                </div>
                <p style={{marginTop: "10px"}}>{review_text}</p>
            </li>
        );
    });

    switch (queryState) {
        case "pending": return <TourLoading/>;
        case "error": return (
            <div>
                <p style={{color: "red"}}>Произошла ошибка</p>
                <button className={styles.btn} onClick={getReviews}>Попробовать снова</button>
            </div>
        );
    }

    const reviewsEls = renderReviews();
    
    return (
        <div>
            <div className={styles.reviewsTop}>
                <div className={styles.reviewsInfo}>
                    <h2>Отзывы:</h2>
                    <div className={styles.avgRatingWrapper}>
                        <p className={styles.avgRating}>
                            {(reviews.reduce((sum, curr) => sum + curr.mark, 0) / (reviews.length || 1)).toFixed(1)}
                        </p>
                        <p className={styles.amount}>{reviewStr(reviews.length)}</p>
                    </div>
                </div>
                {!isAdmin && 
                <button className={styles.btn} onClick={() => openModal()}>Оставить отзыв</button>}
                <ReviewModal
                    open={open}
                    setOpen={setOpen}
                    setReviews={setReviews}
                    review={review}
                    tourId={id}/>
            </div>
            <ul className={styles.reviewsList}>{reviewsEls}</ul>
        </div>
    );
}

export default TourReviews;