import { useEffect, useState } from "react";
import { fetchFoodRequest } from "../../api/foodApi";
import styles from "./FoodPage.module.css";

const CATEGORIES = [
    { key: "all", label: "All" },
    { key: "traditional", label: "Traditional Dishes" },
    { key: "drinks", label: "Drinks" },
    { key: "street_food", label: "Street Food" },
    { key: "vegetarian_vegan", label: "Vegetarian & Vegan" },
];

const CATEGORY_LABELS = {
    traditional: "Traditional",
    drinks: "Drink",
    street_food: "Street Food",
    vegetarian_vegan: "Veg / Vegan",
};

const CATEGORY_COLORS = {
    traditional: "#1A3A6B",
    drinks: "#2D6A4F",
    street_food: "#C8922A",
    vegetarian_vegan: "#4A7C59",
};

function FoodImage({ url, name, category }) {
    const [failed, setFailed] = useState(false);

    if (!url || failed) {
        return (
            <div className={styles.imgPlaceholder}
                style={{ background: CATEGORY_COLORS[category] || "#1A3A6B" }}>
                {name.slice(0, 2).toUpperCase()}
            </div>
        );
    }

    const fullUrl = url.startsWith("http") ? url : `${process.env.REACT_APP_API_URL || "http://localhost:5001"}${url}`;

    return (
        <img
            src={fullUrl}
            alt={name}
            className={styles.foodImg}
            onError={() => setFailed(true)}
        />
    );
}

const FoodPage = () => {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("all");
    const [veganOnly, setVeganOnly] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const params = {};
        if (category !== "all") params.category = category;
        if (veganOnly) params.vegan = "1";
        fetchFoodRequest(params)
            .then(setItems)
            .catch(() => setError("Failed to load food information."));
    }, [category, veganOnly]);

    const filtered = veganOnly ? items.filter(i => i.is_vegan) : items;

    return (
        <div className={styles.page}>
            <div className={styles.pageHead}>
                <p className={styles.overline}>Local cuisine</p>
                <h1 className={styles.title}>Food & Cuisine Guide</h1>
                <p className={styles.sub}>
                    Kyrgyz cuisine is deeply tied to nomadic traditions — meat-heavy, hearty,
                    and built around horse, lamb, and fermented dairy. Here is everything you
                    need to know before you eat.
                </p>
            </div>

            <div className={styles.notice}>
                <strong>Important for vegetarians & vegans:</strong> Traditional Kyrgyz cuisine
                centres on meat, especially horse and lamb. Outside of Bishkek and Karakol, finding
                meat-free options can be very difficult. Plan ahead and communicate your diet clearly
                — "Ya ne yem myaso" means "I don't eat meat" in Russian.
            </div>

            <div className={styles.filters}>
                {CATEGORIES.map(c => (
                    <button key={c.key}
                        className={`${styles.filterBtn} ${category === c.key && !veganOnly ? styles.filterActive : ""}`}
                        onClick={() => { setCategory(c.key); setVeganOnly(false); }}>
                        {c.label}
                    </button>
                ))}
                <button
                    className={`${styles.filterBtn} ${styles.filterVegan} ${veganOnly ? styles.filterVeganActive : ""}`}
                    onClick={() => { setVeganOnly(v => !v); setCategory("all"); }}>
                    Vegan only
                </button>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.grid}>
                {filtered.map(item => {
                    const ingredients = JSON.parse(item.ingredients || "[]");
                    return (
                        <div key={item.id}
                            className={`${styles.card} ${item.contains_horse ? styles.cardHorse : ""} ${item.is_vegan ? styles.cardVegan : item.is_vegetarian ? styles.cardVeg : ""}`}>

                            <div className={styles.cardHeader}>
                                <FoodImage url={item.image_url} name={item.name} category={item.category} />
                                <div className={styles.cardHeaderText}>
                                    <div className={styles.cardTop}>
                                        <span className={styles.catTag}>{CATEGORY_LABELS[item.category] || item.category}</span>
                                        <div className={styles.dietBadges}>
                                            {item.contains_horse ? <span className={styles.horseBadge}>Contains horse</span> : null}
                                            {item.is_vegan ? <span className={styles.veganBadge}>Vegan</span> : item.is_vegetarian ? <span className={styles.vegBadge}>Vegetarian</span> : null}
                                        </div>
                                    </div>
                                    <h2 className={styles.name}>{item.name}</h2>
                                </div>
                            </div>

                            <p className={styles.desc}>{item.description}</p>

                            {ingredients.length > 0 && (
                                <div className={styles.ingredients}>
                                    <span className={styles.ingredientsLabel}>Ingredients</span>
                                    <div className={styles.ingredientList}>
                                        {ingredients.map(i => <span key={i} className={styles.ingredient}>{i}</span>)}
                                    </div>
                                </div>
                            )}

                            {item.tip && (
                                <div className={styles.tip}>
                                    <span className={styles.tipLabel}>Tip</span>
                                    <p>{item.tip}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FoodPage;
