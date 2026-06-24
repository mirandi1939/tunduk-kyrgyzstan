import { useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./HikingMapPage.module.css";

const LOCATIONS = [
    {
        id: 1,
        name: "Ala Archa National Park",
        lat: 42.5613, lng: 74.4945,
        region: "Chui",
        difficulty: "Easy–Challenging",
        duration: "1–3 days",
        elevation: "1,500–4,800m",
        best_season: "May–October",
        description: "Dramatic alpine gorge 40km south of Bishkek. The most accessible serious trekking in Kyrgyzstan — from gentle river walks to glacier ascents.",
        highlights: ["Ak-Sai glacier", "Ratsek hut at 3,400m", "Waterfall trails"],
    },
    {
        id: 2,
        name: "Song-Köl Lake Circuit",
        lat: 41.867, lng: 75.133,
        region: "Naryn",
        difficulty: "Moderate",
        duration: "2–5 days",
        elevation: "3,016m",
        best_season: "June–September",
        description: "Horseback and hiking trails around the vast Song-Köl alpine plateau. Yurt camp stays with nomadic families. Wide open steppe with dramatic mountain horizons.",
        highlights: ["Yurt camp stays", "Nomadic herder culture", "Alpine steppe"],
    },
    {
        id: 3,
        name: "Karakol Gorge Trek",
        lat: 42.491, lng: 78.393,
        region: "Issyk-Kul",
        difficulty: "Moderate",
        duration: "1–2 days",
        elevation: "1,770–3,200m",
        best_season: "June–October",
        description: "One of the finest day treks in Kyrgyzstan. The gorge trail passes the Turasu waterfall and climbs to a high plateau with spectacular Tian Shan views.",
        highlights: ["Turasu waterfall", "3,200m plateau", "Alpine wildflowers"],
    },
    {
        id: 4,
        name: "Jeti-Ögüz Valley",
        lat: 42.35, lng: 78.2,
        region: "Issyk-Kul",
        difficulty: "Easy",
        duration: "1 day",
        elevation: "1,800–2,500m",
        best_season: "May–October",
        description: "The iconic 'Seven Bulls' red sandstone formations. Easy walks through the valley to the Flower Meadow. Perfect for first-time trekkers in Kyrgyzstan.",
        highlights: ["Seven Bulls rock formation", "Flower Meadow", "River valley walks"],
    },
    {
        id: 5,
        name: "Tash Rabat Valley",
        lat: 40.83, lng: 75.23,
        region: "Naryn",
        difficulty: "Easy–Moderate",
        duration: "1–2 days",
        elevation: "3,200m",
        best_season: "June–September",
        description: "Remote plateau walks around the ancient 10th-century Silk Road caravanserai at 3,200m. Wild, historically rich, and remarkably peaceful.",
        highlights: ["Ancient caravanserai", "Remote high plateau", "Yurt camp"],
    },
    {
        id: 6,
        name: "Sary-Chelek Biosphere Reserve",
        lat: 41.85, lng: 71.97,
        region: "Jalal-Abad",
        difficulty: "Moderate",
        duration: "2–3 days",
        elevation: "1,500–2,500m",
        best_season: "May–October",
        description: "Pristine turquoise lake surrounded by ancient walnut and fir forests in western Kyrgyzstan. Excellent birdwatching, forest hiking, and one of the most beautiful landscapes in the country.",
        highlights: ["Turquoise alpine lake", "Ancient walnut forests", "Wildlife & birds"],
    },
    {
        id: 7,
        name: "Arslanbob Walnut Forest",
        lat: 41.337, lng: 72.924,
        region: "Jalal-Abad",
        difficulty: "Easy",
        duration: "1–2 days",
        elevation: "1,500–2,200m",
        best_season: "April–October",
        description: "Hike through the world's largest wild walnut forest to a mountain waterfall. Village-based community tourism with a warm cultural experience.",
        highlights: ["World's largest walnut forest", "Mountain waterfall", "Village homestays"],
    },
    {
        id: 8,
        name: "Peak Lenin Base Camp",
        lat: 39.7, lng: 72.9,
        region: "Osh",
        difficulty: "Challenging",
        duration: "7–10 days",
        elevation: "Base camp 3,600m — Summit 7,134m",
        best_season: "July–August",
        description: "A classic high-altitude trek to base camp of Peak Lenin (7,134m), one of the highest peaks in the former Soviet Union. For experienced mountain trekkers and alpinists only.",
        highlights: ["7,134m peak views", "Glacier trekking", "Glacial lakes"],
    },
    {
        id: 9,
        name: "Chon-Kemin Valley",
        lat: 42.8, lng: 76.1,
        region: "Chui",
        difficulty: "Easy–Moderate",
        duration: "1–3 days",
        elevation: "1,500–3,500m",
        best_season: "May–October",
        description: "A long green valley between Bishkek and Issyk-Kul. Excellent hiking and horse trekking through alpine pastures with few tourists and authentic village life.",
        highlights: ["Horse trekking", "Alpine pastures", "Off-the-beaten-path"],
    },
    {
        id: 10,
        name: "Terskey Alatau High Passes",
        lat: 42.0, lng: 78.5,
        region: "Issyk-Kul",
        difficulty: "Moderate–Challenging",
        duration: "3–7 days",
        elevation: "2,000–4,500m",
        best_season: "June–September",
        description: "Multi-day treks along the south shore of Issyk-Kul through remote high passes of the Terskey Alatau range. Connects Karakol with Barskoon valley.",
        highlights: ["High mountain passes", "Remote valleys", "Glacier panoramas"],
    },
];

const DIFFICULTY_COLORS = {
    "Easy": "#2D6A4F",
    "Easy–Moderate": "#3A8C6A",
    "Easy–Challenging": "#C8922A",
    "Moderate": "#2451A0",
    "Moderate–Challenging": "#D97706",
    "Challenging": "#B91C1C",
};

function FlyToLocation({ target }) {
    const map = useMap();
    if (target) {
        map.flyTo([target.lat, target.lng], 10, { duration: 1.2 });
    }
    return null;
}

export default function HikingMapPage() {
    const [selected, setSelected] = useState(null);
    const [flyTarget, setFlyTarget] = useState(null);
    const [diffFilter, setDiffFilter] = useState("All");
    const listRef = useRef(null);

    const difficulties = ["All", "Easy", "Moderate", "Challenging"];

    const filtered = diffFilter === "All"
        ? LOCATIONS
        : LOCATIONS.filter(l => l.difficulty.toLowerCase().includes(diffFilter.toLowerCase()));

    const handleSelect = (loc) => {
        setSelected(loc);
        setFlyTarget(loc);
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHead}>
                <p className={styles.overline}>Explore on foot</p>
                <h1 className={styles.title}>Hiking Map</h1>
                <p className={styles.sub}>
                    10 verified trekking routes across Kyrgyzstan — from easy valley walks
                    to multi-day high-altitude expeditions. Click any marker or location to explore.
                </p>
            </div>

            <div className={styles.legend}>
                {Object.entries(DIFFICULTY_COLORS).map(([label, color]) => (
                    <div key={label} className={styles.legendItem}>
                        <span className={styles.legendDot} style={{ background: color }} />
                        <span>{label}</span>
                    </div>
                ))}
            </div>

            <div className={styles.mapWrapper}>
                <MapContainer
                    center={[41.5, 74.5]}
                    zoom={7}
                    style={{ height: "520px", width: "100%" }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    <FlyToLocation target={flyTarget} />
                    {filtered.map(loc => (
                        <CircleMarker
                            key={loc.id}
                            center={[loc.lat, loc.lng]}
                            radius={selected?.id === loc.id ? 12 : 9}
                            fillColor={DIFFICULTY_COLORS[loc.difficulty] || "#1A3A6B"}
                            color="#fff"
                            weight={2.5}
                            fillOpacity={0.9}
                            eventHandlers={{ click: () => handleSelect(loc) }}
                        >
                            <Popup>
                                <div style={{ minWidth: 200 }}>
                                    <strong style={{ fontSize: "0.95rem", color: "#1A3A6B" }}>{loc.name}</strong>
                                    <p style={{ margin: "6px 0 4px", fontSize: "0.82rem", color: "#555" }}>{loc.description}</p>
                                    <div style={{ fontSize: "0.78rem", color: "#333", display: "flex", flexDirection: "column", gap: 2 }}>
                                        <span><b>Difficulty:</b> {loc.difficulty}</span>
                                        <span><b>Duration:</b> {loc.duration}</span>
                                        <span><b>Elevation:</b> {loc.elevation}</span>
                                        <span><b>Best season:</b> {loc.best_season}</span>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>

            <div className={styles.filters}>
                {difficulties.map(d => (
                    <button key={d}
                        className={`${styles.filterBtn} ${diffFilter === d ? styles.filterActive : ""}`}
                        onClick={() => setDiffFilter(d)}>
                        {d}
                    </button>
                ))}
            </div>

            <div className={styles.list} ref={listRef}>
                {filtered.map(loc => (
                    <div
                        key={loc.id}
                        className={`${styles.card} ${selected?.id === loc.id ? styles.cardActive : ""}`}
                        onClick={() => handleSelect(loc)}
                    >
                        <div className={styles.cardLeft}>
                            <span
                                className={styles.diffDot}
                                style={{ background: DIFFICULTY_COLORS[loc.difficulty] || "#1A3A6B" }}
                            />
                            <span className={styles.cardNum}>{loc.id}</span>
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.cardTop}>
                                <h3 className={styles.cardName}>{loc.name}</h3>
                                <span className={styles.region}>{loc.region}</span>
                            </div>
                            <div className={styles.cardMeta}>
                                <span className={styles.difficulty} style={{ color: DIFFICULTY_COLORS[loc.difficulty] }}>
                                    {loc.difficulty}
                                </span>
                                <span>{loc.duration}</span>
                                <span>{loc.elevation}</span>
                                <span>{loc.best_season}</span>
                            </div>
                            <p className={styles.cardDesc}>{loc.description}</p>
                            <div className={styles.highlights}>
                                {loc.highlights.map(h => (
                                    <span key={h} className={styles.highlight}>{h}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
