import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <img className={styles.logo} src="./images/logo.png" alt="Tunduk logo"></img>
            <p>Tunduk 2026. All rights reserved</p>

            <div className={styles.socials}>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.icon}>
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.5.6.2 1 .5 1.5 1 .5.5.8.9 1 1.5.2.5.4 1.2.5 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.4-.2.6-.5 1-1 1.5-.5.5-.9.8-1.5 1-.5.2-1.2.4-2.4.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.5-.6-.2-1-.5-1.5-1-.5-.5-.8-.9-1-1.5-.2-.5-.4-1.2-.5-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.4.2-.6.5-1 1-1.5.5-.5.9-.8 1.5-1 .5-.2 1.2-.4 2.4-.5C8.4 2.2 8.8 2.2 12 2.2zm0 3.3A6.5 6.5 0 1 0 18.5 12 6.5 6.5 0 0 0 12 5.5zm0 10.7A4.2 4.2 0 1 1 16.2 12 4.2 4.2 0 0 1 12 16.2zm5.3-10.9a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z"/>
                    </svg>
                </a>

                <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.icon}>
                    <svg viewBox="0 0 24 24">
                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-2v7A10 10 0 0 0 22 12"/>
                    </svg>
                </a>

                <a href="https://twitter.com" target="_blank" rel="noreferrer" className={styles.icon}>
                    <svg viewBox="0 0 24 24">
                        <path d="M22 5.8c-.8.4-1.7.6-2.6.8a4.5 4.5 0 0 0 2-2.5c-.9.5-1.9.9-3 .9A4.6 4.6 0 0 0 12 9.2c0 .3 0 .6.1.9A13.1 13.1 0 0 1 3 5.2a4.6 4.6 0 0 0 1.4 6.1c-.7 0-1.4-.2-2-.5v.1a4.6 4.6 0 0 0 3.7 4.5 4.5 4.5 0 0 1-2 .1 4.6 4.6 0 0 0 4.3 3.2A9.3 9.3 0 0 1 2 19.6a13 13 0 0 0 7 2c8.4 0 13-7.1 13-13.2v-.6A9.4 9.4 0 0 0 22 5.8z"/>
                    </svg>
                </a>
            </div>
        </footer>
    );
}
