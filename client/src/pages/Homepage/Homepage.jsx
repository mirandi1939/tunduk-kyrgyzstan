import { Link } from "react-router-dom";
import styles from "./Homepage.module.css";

const features = [
    { to: "/itineraries", label: "PLAN", title: "Itineraries", desc: "Modular 10, 14 & 21-day plans with day-by-day breakdown, elevation data, and verified accommodation." },
    { to: "/operators", label: "CONNECT", title: "Local Operators", desc: "Verified English-speaking operators with direct contact details, ratings, and specialties." },
    { to: "/guesthouses", label: "STAY", title: "Guesthouses", desc: "Vetted accommodation filtered by region, price, WiFi, and women-friendly certification." },
    { to: "/forum", label: "LEARN", title: "Traveler Forum", desc: "Moderated real-world reviews from international travellers who have completed these routes." },
    { to: "/emergency", label: "SAFETY", title: "Emergency Protocols", desc: "Step-by-step procedures, key phone numbers, and embassy contacts for every situation.", emergency: true },
    { to: "/women", label: "WOMEN", title: "Women's Corner", desc: "Female-specific safety guides, cultural tips, and transport recommendations.", women: true },
];

const Homepage = () => (
    <div className={styles.page}>
        <section className={styles.hero}>
            <div className={styles.heroInner}>
                <p className={styles.overline}>Central Asia · Destination Intelligence</p>
                <h1 className={styles.heroTitle}>
                    Discover<br />
                    <em>Kyrgyzstan</em><br />
                    without the guesswork
                </h1>
                <p className={styles.heroSub}>
                    Verified itineraries, trusted local operators, and essential safety tools —
                    built for independent travellers who expect Swiss-level clarity.
                </p>
                <div className={styles.heroCtas}>
                    <Link to="/itineraries" className={styles.ctaPrimary}>Explore itineraries</Link>
                    <Link to="/operators" className={styles.ctaSecondary}>Find operators</Link>
                </div>
            </div>
            <div className={styles.heroStats}>
                <div className={styles.stat}><span className={styles.statNum}>3</span><span className={styles.statLabel}>Curated itineraries</span></div>
                <div className={styles.statDivider} />
                <div className={styles.stat}><span className={styles.statNum}>5</span><span className={styles.statLabel}>Verified operators</span></div>
                <div className={styles.statDivider} />
                <div className={styles.stat}><span className={styles.statNum}>6</span><span className={styles.statLabel}>Verified guesthouses</span></div>
                <div className={styles.statDivider} />
                <div className={styles.stat}><span className={styles.statNum}>5</span><span className={styles.statLabel}>Emergency protocols</span></div>
            </div>
        </section>

        <section className={styles.features}>
            <div className={styles.featuresInner}>
                <div className={styles.featuresHead}>
                    <p className={styles.overline}>Platform Overview</p>
                    <h2 className={styles.featuresTitle}>Everything in one place</h2>
                    <p className={styles.featuresSub}>Designed to transform complex, fragmented information into simple, verifiable, and actionable travel tools.</p>
                </div>
                <div className={styles.grid}>
                    {features.map(f => (
                        <Link to={f.to} key={f.to}
                            className={`${styles.card} ${f.women ? styles.cardWomen : ""} ${f.emergency ? styles.cardEmergency : ""}`}>
                            <div className={styles.cardTop}>
                                <span className={styles.cardLabel}>{f.label}</span>
                            </div>
                            <h3 className={styles.cardTitle}>{f.title}</h3>
                            <p className={styles.cardDesc}>{f.desc}</p>
                            <span className={styles.cardArrow}>Explore →</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        <section className={styles.mission}>
            <div className={styles.missionInner}>
                <div className={styles.missionText}>
                    <p className={styles.overline}>Our Purpose</p>
                    <h2 className={styles.missionTitle}>Built for confident, independent travel</h2>
                    <p className={styles.missionBody}>
                        Kyrgyzstan's remote mountain regions offer some of the world's most extraordinary
                        landscapes — but information asymmetries, connectivity gaps, and safety uncertainties
                        have historically kept independent travellers away.
                    </p>
                    <p className={styles.missionBody}>
                        This platform transforms complex security and connectivity uncertainties into verifiable,
                        simple infrastructure — facilitating rapid decision-making and reducing the complexity
                        of researching and booking.
                    </p>
                </div>
                <div className={styles.missionPoints}>
                    {[
                        "Data-verified operator and guesthouse profiles",
                        "Step-by-step emergency protocols with phone numbers",
                        "Moderated international traveler forum reviews",
                        "Women-specific safety information in accessible formats",
                        "Modular itinerary planning tools for 10, 14 & 21 days",
                        "Direct contact with English-speaking local operators",
                    ].map(text => (
                        <div key={text} className={styles.missionPoint}>
                            <span className={styles.missionCheck}>—</span>
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className={styles.ctaSection}>
            <p className={styles.overline}>Start planning</p>
            <h2 className={styles.ctaTitle}>Ready to explore Kyrgyzstan?</h2>
            <div className={styles.ctaBtns}>
                <Link to="/itineraries" className={styles.ctaBtnPrimary}>View 10, 14 & 21-day itineraries</Link>
                <Link to="/women" className={styles.ctaBtnWomen}>Women's safety guide</Link>
            </div>
        </section>
    </div>
);

export default Homepage;
