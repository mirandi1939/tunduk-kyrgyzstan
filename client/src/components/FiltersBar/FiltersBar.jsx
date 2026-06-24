import styles from "./FiltersBar.module.css";

const FiltersBar = ({ filters, setFilters }) => {
    return (
        <div className={styles.bar}>
            <div className={styles.selectWrapper}>
                <select className={styles.select}
                    value={filters.type}
                    onChange={e =>
                        setFilters({ ...filters, type: e.target.value })
                    }
                >
                    <option value="all">All types</option>
                    <option value="lake">Lakes</option>
                    <option value="mountain">Mountains</option>
                    <option value="waterfall">Waterfalls</option>
                    <option value="valley">Valley / Gorges</option>
                    <option value="park">Natural Parks</option>
                </select>
            </div>

            <div className={styles.selectWrapper}>
                <select className={styles.select}
                    value={filters.rating}
                    onChange={e =>
                        setFilters({ ...filters, rating: e.target.value })
                    }
                >
                    <option value="all">Any rating</option>
                    <option value="4.8">4.8+</option>
                    <option value="4.5">4.5+</option>
                </select>
            </div>
        </div>
    );
};

export default FiltersBar;
