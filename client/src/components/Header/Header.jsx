import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const close = () => setMenuOpen(false);
    const lc = ({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link;

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <Link to="/" className={styles.brand} onClick={close}>
                    <span className={styles.logo}>Tunduk</span>
                    <div className={styles.brandText}>
                        <span className={styles.brandName}>Kyrgyzstan</span>
                        <span className={styles.brandSub}>Destination Guide</span>
                    </div>
                </Link>

                <button className={styles.burger} onClick={() => setMenuOpen(o => !o)} aria-label="menu">
                    <span /><span /><span />
                </button>

                <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
                    <NavLink to="/itineraries" className={lc} onClick={close}>Itineraries</NavLink>
                    <NavLink to="/hiking" className={lc} onClick={close}>Hiking Map</NavLink>
                    <NavLink to="/operators" className={lc} onClick={close}>Operators</NavLink>
                    <NavLink to="/guesthouses" className={lc} onClick={close}>Guesthouses</NavLink>
                    <NavLink to="/forum" className={lc} onClick={close}>Forum</NavLink>
                    <NavLink to="/food" className={lc} onClick={close}>Food Guide</NavLink>
                    <NavLink to="/events" className={lc} onClick={close}>Events 2026</NavLink>
                    <NavLink to="/emergency" onClick={close}
                        className={({ isActive }) => `${styles.link} ${styles.linkEmergency}${isActive ? " " + styles.active : ""}`}>
                        Emergency
                    </NavLink>
                    <NavLink to="/women" onClick={close}
                        className={({ isActive }) => `${styles.link} ${styles.linkWomen}${isActive ? " " + styles.active : ""}`}>
                        Women's Corner
                    </NavLink>
                </nav>
            </div>
        </header>
    );
};

export default Header;
