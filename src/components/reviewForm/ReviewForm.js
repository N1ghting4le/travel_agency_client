'use client';

import styles from "./reviewForm.module.css";
import { helperStyle } from "../input/Input";
import { BASE_URL } from "@/env";
import { useState } from "react";
import { useUser, useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";
import { v4 as uuid } from "uuid";
import Stars from "../stars/Stars";
import Input from "../input/Input";
import SubmitBtn from "../submitBtn/SubmitBtn";
import { FormHelperText } from "@mui/material";
import UserSpinner from "../loadingSpinners/UserSpinner";

const ReviewForm = ({ setReviews, review, tourId }) => {
    const [currReview, setCurrReview] = useState({
        text: review?.review_text || "",
        mark: review?.mark || 1
    });
    const [mark, setMark] = useState(currReview.mark);
    const [text, setText] = useState(currReview.text);
    const [initial, setInitial] = useState(true);
    const { user } = useUser();
    const { token } = useToken();
    const { query, queryState, resetQueryState } = useQuery();

    const onChange = (e) => setText(e.target.value);

    const onSubmit = (e) => {
        e.preventDefault();
        setInitial(false);

        const trimmedText = text.trim();

        if (!trimmedText) return;

        const body = {
            id: review?.id || uuid(),
            user_id: user?.id,
            review_user_id: review?.user_id,
            tour_id: tourId,
            review_date: new Date(),
            mark,
            review_text: trimmedText
        };
        const { review_user_id, ...rest } = body;
        
        query(`${BASE_URL}/review/${review ? "edit" : "add"}`, review ? "PATCH" : "POST", {
            'Content-type': 'application/json',
            'authorization': `Bearer ${token}`
        }, JSON.stringify(body))
            .then(() => {
                if (review) {
                    setReviews(reviews => reviews.map(item => item.id === review.id ? ({
                        ...item, mark: body.mark, review_text: body.review_text
                    }) : item));
                    setCurrReview({ text: trimmedText, mark: body.mark });
                } else setReviews(reviews => [...reviews, { ...rest, name: user.name, surname: user.surname }]);
            })
            .finally(() => setTimeout(resetQueryState, 2000));
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            {user &&
            <div className={styles.fieldWrapper}>
                <p>Ваша оценка</p>
                <Stars stars={mark} setStars={setMark}/>
            </div>}
            <Input
                placeholder="Текст отзыва"
                multiline
                value={text}
                onChange={onChange}
                error={initial || text.trim() ? null : { message: "Текст отзыва обязателен" }}/>
            <div className={styles.submitWrapper}>
                {queryState === "pending" ? <UserSpinner/> :
                <SubmitBtn
                    style={{width: "100%"}}
                    disabled={queryState !== "idle" || (review && currReview.text === text.trim() && currReview.mark === mark)}>
                        {review ? "Сохранить изменения" : "Отправить"}</SubmitBtn>}
                {queryState === "error" &&
                <FormHelperText sx={helperStyle} error>Произошла ошибка</FormHelperText>}
                {queryState === "fulfilled" &&
                <FormHelperText sx={{...helperStyle, color: "green"}}>Отзыв отправлен</FormHelperText>}
            </div>
        </form>
    );
}

export default ReviewForm;