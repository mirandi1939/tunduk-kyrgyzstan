import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchOperatorRequest } from "../../api/operatorsApi";
import styles from "./OperatorDetailPage.module.css";

const OperatorDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [op, setOp] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOperatorRequest(id)
            .then(setOp)
            .catch(() => setError("Failed to load operator."));
    }, [id]);

    if (error) return <div className={styles.state}>{error}</div>;
    if (!op) return <div className={styles.state}>Loading…</div>;

    const langs = JSON.parse(op.languages || "[]");

    return (
        <div className={styles.page}>
            <button className={styles.back} onClick={() => navigate(-1)}>← Back to Operators</button>

            <div className={styles.hero}>
                <div className={styles.heroLeft}>
                    <div className={styles.badges}>
                        {op.is_verified ? <span className={styles.verified}>✓ Verified Operator</span> : null}
                        {op.is_women_friendly ? <span className={styles.womenBadge}>🌸 Women-friendly</span> : null}
                    </div>
                    <h1 className={styles.name}>{op.name}</h1>
                    <p className={styles.specialty}>{op.specialty} · {op.region}</p>
                    <div className={styles.rating}>{op.rating} <span>({op.reviews_count} reviews) · {op.years_experience} years experience</span></div>
                </div>
            </div>

            <div className={styles.body}>
                <div className={styles.main}>
                    <h2>About</h2>
                    <p className={styles.desc}>{op.description}</p>

                    <h2>Languages spoken</h2>
                    <div className={styles.langs}>
                        {langs.map(l => <span key={l} className={styles.lang}>{l}</span>)}
                    </div>
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.contactCard}>
                        <h3>Contact directly</h3>
                        <div className={styles.contactItem}>
                            <span>Phone</span>
                            <a href={`tel:${op.contact_phone}`}>{op.contact_phone}</a>
                        </div>
                        <div className={styles.contactItem}>
                            <span>Email</span>
                            <a href={`mailto:${op.contact_email}`}>{op.contact_email}</a>
                        </div>
                        {op.whatsapp && (
                            <a
                                href={`https://wa.me/${op.whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.whatsappBtn}
                            >
                                WhatsApp →
                            </a>
                        )}
                    </div>

                    <div className={styles.infoBox}>
                        <div className={styles.infoRow}><span>Specialty</span><strong>{op.specialty}</strong></div>
                        <div className={styles.infoRow}><span>Base</span><strong>{op.region}</strong></div>
                        <div className={styles.infoRow}><span>Experience</span><strong>{op.years_experience} years</strong></div>
                        <div className={styles.infoRow}><span>English</span><strong>{op.is_english_speaking ? "Yes" : "Limited"}</strong></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatorDetailPage;
