'use client';

import { createContext, useContext, useState } from "react";

const Context = createContext();

const GlobalContext = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        isAdmin: false,
        token: "",
        tours: []
    });

    const setTours = (tours) => setState(state => ({...state, tours}));

    const provider = {
        user: state.user,
        isAdmin: state.isAdmin,
        tours: state.tours,
        token: state.token,

        setUser: (user) => setState(state => ({...state, user})),
        setToken: (token) => setState(state => ({...state, token})),
        setAdmin: () => setState(state => ({...state, isAdmin: true})),
        logout: () => setState(state => ({...state, user: null, isAdmin: false})),
        setTours,
        changeAvgMark: (id, avgMark, amount) => setTours(state.tours.map(tour => tour.id === id ? {
            ...tour, avg_mark: avgMark, amount
        } : tour)),
        changeTour: (data) => setTours(state.tours.map(tour => tour.id === data.id ? {
            ...tour,
            tour_title: data.tour_title,
            hotel_title: data.hotel_title,
            resort: data.resort,
            base_price: data.base_price,
            destination_country: data.destination_country,
            photo: data.photos[0],
            nutrition_types: data.nutrition_types,
            stars: data.stars,
            room_types: data.room_types
        } : tour)),
        deleteTour: (id) => setTours(state.tours.filter(tour => tour.id !== id)) 
    };

    return (
        <Context.Provider value={provider}>
            {children}
        </Context.Provider>
    );
}

export default GlobalContext;

const useUser = () => {
    const { user, setUser } = useContext(Context);

    return { user, setUser };
}

const useLogout = () => useContext(Context).logout;

const useToken = () => {
    const { token, setToken } = useContext(Context);

    return { token, setToken };
}

const useAdmin = () => {
    const { isAdmin, setAdmin } = useContext(Context);

    return { isAdmin, setAdmin };
}

const useTours = () => {
    const context = useContext(Context);
    const { tours, setTours, changeTour, changeAvgMark, deleteTour } = context;

    return { tours, setTours, changeTour, changeAvgMark, deleteTour };
}

export { useUser, useLogout, useToken, useAdmin, useTours };