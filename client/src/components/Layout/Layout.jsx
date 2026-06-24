import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header.jsx";
import { Outlet } from "react-router-dom";
import styles from "./Layout.module.css";

export default function Layout() {
    return (
        <div className={styles.wrapper}>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}






