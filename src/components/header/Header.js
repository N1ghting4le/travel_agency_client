'use client';

import styles from "./header.module.css";
import Link from "next/link";
import Logo from "../logo/Logo";
import AccountMenu from "../accountMenu/AccountMenu";
import HeaderMenu from "./menu/Menu";
import { useUser, useAdmin } from "../GlobalContext";

const Header = () => {
    const { user } = useUser();
    const { isAdmin } = useAdmin();

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