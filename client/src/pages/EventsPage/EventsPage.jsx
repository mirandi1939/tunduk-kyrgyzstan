import styles from "./EventsPage.module.css";

const EVENTS = [
    {
        id: 1,
        name: "Nowruz — Spring New Year",
        date: "21 March 2026",
        location: "Nationwide — main celebrations in Bishkek & Osh",
        category: "Cultural",
        image: "/uploads/events/nowruz.jpg",
        meaning: "Nowruz (meaning 'new day') is the ancient Persian new year celebrated on the spring equinox. In Kyrgyzstan it is one of the biggest national holidays — families gather outdoors, traditional foods like sumalak are prepared, horse games are held, and music fills public squares. It is a UNESCO Intangible Cultural Heritage celebration and a perfect first glimpse into Kyrgyz culture.",
        ticketUrl: null,
        ticketLabel: null,
        free: true,
    },
    {
        id: 2,
        name: "World Nomad Games 2026",
        date: "Summer / Autumn 2026 — check official site for confirmed dates",
        location: "Kyrgyzstan (previous editions: Cholpon-Ata, Issyk-Kul)",
        category: "International Games",
        image: "/uploads/events/worldnomadgames.jpg",
        meaning: "The World Nomad Games is the world's largest event dedicated to nomadic sports and culture. Athletes from over 80 countries compete in traditional disciplines including kok-boru (horse polo with a goat carcass), at chabysh (horse racing), eagle hunting, and wrestling. The cultural programme includes a massive ethno-village with yurts, crafts, music, and cuisine from nomadic civilisations across Asia. For any visitor to Kyrgyzstan, this is a once-in-a-lifetime spectacle.",
        ticketUrl: "https://worldnomadgames.org/en/tickets/",
        ticketLabel: "Buy Tickets — Official Site",
        free: false,
    },
    {
        id: 3,
        name: "Issyk-Kul Resort Season",
        date: "June – August 2026",
        location: "Cholpon-Ata, Bosteri & south shore — Issyk-Kul Lake",
        category: "Tourism Season",
        image: "/uploads/events/issykkul.jpg",
        meaning: "Issyk-Kul, the world's second-largest alpine lake, comes alive each summer with festivals, beach events, and open-air concerts along its shores. The water stays warm despite the high altitude (1,607m), and resorts host everything from folk music evenings to paragliding competitions. The resort opening in early June is marked with concerts and fireworks in Cholpon-Ata.",
        ticketUrl: null,
        ticketLabel: null,
        free: true,
    },
    {
        id: 4,
        name: "Osh Silk Road Festival",
        date: "July 2026 (dates TBC — check Osh city portal)",
        location: "Osh — Sulayman Mountain & Old City Bazaar",
        category: "Cultural",
        image: "/uploads/events/oshsilkroad.jpg",
        meaning: "Osh is one of Central Asia's oldest cities and a historic hub of the ancient Silk Road. The annual Silk Road Festival transforms the city with traditional music, dance performances, craft markets, and tastings of Fergana Valley cuisine. Held at the foot of UNESCO-listed Sulayman Mountain, it draws visitors from across the region and is an unmissable stop for culture-focused travellers.",
        ticketUrl: null,
        ticketLabel: null,
        free: true,
    },
    {
        id: 5,
        name: "Traditional Horse Games Festival",
        date: "August 2026 — multiple locations",
        location: "Song-Köl plateau, Kochkor & regional venues",
        category: "Sport & Tradition",
        image: "/uploads/events/traditionalhorse.jpg",
        meaning: "Horse sports are at the heart of Kyrgyz nomadic identity. Summer festivals across the country feature kok-boru (team horse polo), ulak tartish (goat grabbing), at chabysh (long-distance racing), and er enish (wrestling on horseback). The Song-Köl plateau at 3,016m provides the most dramatic setting — riders compete against a backdrop of alpine steppe and nomadic yurt camps. These festivals are open to spectators and free to attend.",
        ticketUrl: null,
        ticketLabel: null,
        free: true,
    },
    {
        id: 6,
        name: "Kyrgyzstan Independence Day",
        date: "31 August 2026",
        location: "Bishkek — Ala-Too Square",
        category: "National Holiday",
        image: "/uploads/events/independanceday.jpg",
        meaning: "Kyrgyzstan declared independence from the Soviet Union on 31 August 1991. The national day is marked with a military parade on Ala-Too Square in Bishkek, traditional concerts, fireworks, and city-wide festivities. The day is a proud celebration of Kyrgyz sovereignty and identity — flags fly across the country and locals gather in parks and public spaces. A great day to be in Bishkek.",
        ticketUrl: null,
        ticketLabel: null,
        free: true,
    },
];

const CATEGORY_COLORS = {
    "International Games": "#1A3A6B",
    "Cultural": "#C8922A",
    "Tourism Season": "#2D6A4F",
    "Sport & Tradition": "#7B3FA0",
    "National Holiday": "#B91C1C",
};

export default function EventsPage() {
    return (
        <div className={styles.page}>
            <div className={styles.pageHead}>
                <p className={styles.overline}>What's on</p>
                <h1 className={styles.title}>Events & Festivals 2026</h1>
                <p className={styles.sub}>
                    From the World Nomad Games to ancient spring festivals, Kyrgyzstan's
                    calendar is full of unmissable experiences. Plan your visit around
                    these key events for the richest cultural immersion.
                </p>
            </div>

            <div className={styles.grid}>
                {EVENTS.map(event => (
                    <div key={event.id} className={styles.card}>
                        <div className={styles.cardTop}>
                            <span
                                className={styles.category}
                                style={{ background: CATEGORY_COLORS[event.category] || "#1A3A6B" }}
                            >
                                {event.category}
                            </span>
                            {event.free && <span className={styles.freeBadge}>Free entry</span>}
                        </div>

                        <h2 className={styles.eventName}>{event.name}</h2>

                        <div className={styles.meta}>
                            <div className={styles.metaRow}>
                                <span className={styles.metaIcon}>📅</span>
                                <span>{event.date}</span>
                            </div>
                            <div className={styles.metaRow}>
                                <span className={styles.metaIcon}>📍</span>
                                <span>{event.location}</span>
                            </div>
                        </div>

                        <p className={styles.meaning}>{event.meaning}</p>

                        {event.image && (
                            <img
                                src={`${process.env.REACT_APP_API_URL || "http://localhost:5001"}${event.image}`}
                                alt={event.name}
                                className={styles.eventImg}
                            />
                        )}

                        {event.ticketUrl && (
                            <a
                                href={event.ticketUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.ticketBtn}
                            >
                                🎟 {event.ticketLabel}
                            </a>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.notice}>
                <strong>Note:</strong> Dates for some events are subject to official confirmation. Always verify on the event's official website before booking travel.
            </div>
        </div>
    );
}
