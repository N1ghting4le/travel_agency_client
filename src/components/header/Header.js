'use client';

import styles from "./header.module.css";
import { BASE_URL } from "@/env";
import Link from "next/link";
import Logo from "../logo/Logo";
import AccountMenu from "../accountMenu/AccountMenu";
import HeaderMenu from "./menu/Menu";
import { useEffect } from "react";
import { useUser, useAdmin, useToken } from "../GlobalContext";
import useQuery from "@/hooks/query.hook";

const Header = () => {
    const { user, setUser } = useUser();
    const { isAdmin, setAdmin } = useAdmin();
    const { setToken } = useToken();
    const { query } = useQuery();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) return;

        query(`${BASE_URL}/auth/`, "GET", {'authorization': `Bearer ${token}`})
            .then(res => {
                res.admin ? setAdmin(true) : setUser(res);
                setToken(token);
            })
            .catch(() => localStorage.removeItem("token"));
    }, []);

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.link}><Logo/></Link>
            {user || isAdmin ? <AccountMenu user={user} isAdmin={isAdmin}/> :
            <>
            <div className={styles.btnWrapper}>
                <Link href="/sign-in">
                    <button
                        className={styles.accountBtn}
                        style={{backgroundColor: "#fff", color: "#000"}}>Войти</button>
                </Link>
                <Link href="/sign-up">
                    <button
                        className={styles.accountBtn}
                        style={{backgroundColor: "#000", color: "#fff"}}>Зарегистрироваться</button>
                </Link>
            </div>
            <HeaderMenu/>
            </>}
        </header>
    );
}

export default Header;