import { useEffect, useState } from "react";
import { fetchEmergencyRequest } from "../../api/emergencyApi";
import styles from "./EmergencyPage.module.css";

const EmergencyPage = () => {
    const [protocols, setProtocols] = useState([]);
    const [open, setOpen] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEmergencyRequest()
            .then(data => { setProtocols(data); if (data.length > 0) setOpen(data[0].id); })
            .catch(() => setError("Failed to load emergency protocols."));
    }, []);

    return (
        <div className={styles.page}>
            <div className={styles.banner}>
                <div className={styles.bannerInner}>
                    <h1 className={styles.bannerTitle}>Emergency Protocols</h1>
                    <p className={styles.bannerSub}>Step-by-step procedures for every emergency situation. Save these numbers offline before you travel.</p>
                </div>
            </div>

            <div className={styles.quickNumbers}>
                <div className={styles.numberCard}><span className={styles.numberLabel}>Ambulance</span><strong className={styles.number}>103</strong></div>
                <div className={styles.numberCard}><span className={styles.numberLabel}>Police</span><strong className={styles.number}>102</strong></div>
                <div className={styles.numberCard}><span className={styles.numberLabel}>Emergency</span><strong className={styles.number}>112</strong></div>
                <div className={styles.numberCard}><span className={styles.numberLabel}>Mountain Rescue</span><strong className={styles.number}>+996 312 620 060</strong></div>
                <div className={styles.numberCard}><span className={styles.numberLabel}>Swiss Embassy</span><strong className={styles.number}>+7 727 258 2600</strong></div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.protocols}>
                {protocols.map(p => {
                    const steps = JSON.parse(p.steps || "[]");
                    const isOpen = open === p.id;
                    return (
                        <div key={p.id} className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}>
                            <button className={styles.cardHeader} onClick={() => setOpen(isOpen ? null : p.id)}>
                                <div className={styles.cardMeta}>
                                    <strong>{p.title}</strong>
                                    <span>{p.region} · {p.category}</span>
                                </div>
                                {p.phone_number && <span className={styles.phoneChip}>{p.phone_number}</span>}
                                <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
                            </button>
                            {isOpen && (
                                <div className={styles.cardBody}>
                                    <p className={styles.desc}>{p.description}</p>
                                    <h4>Step-by-step actions:</h4>
                                    <ol className={styles.steps}>
                                        {steps.map((s, i) => <li key={i} className={styles.step}>{s}</li>)}
                                    </ol>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className={styles.footer}>
                <p>Always purchase travel insurance with emergency evacuation coverage before visiting Kyrgyzstan's mountain regions.</p>
            </div>
        </div>
    );
};

export default EmergencyPage;
