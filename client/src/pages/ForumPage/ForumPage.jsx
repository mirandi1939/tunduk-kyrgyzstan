import { useEffect, useState } from "react";
import { fetchPostsRequest, submitPostRequest } from "../../api/forumApi";
import styles from "./ForumPage.module.css";

const CATEGORIES = ["all", "trekking", "accommodation", "transport", "general"];

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
    const [category, setCategory] = useState("all");
    const [womenOnly, setWomenOnly] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ author_name: "", author_country: "", title: "", content: "", category: "general", is_women_specific: false });

    useEffect(() => {
        const params = {};
        if (category !== "all") params.category = category;
        if (womenOnly) params.women_only = "1";
        fetchPostsRequest(params)
            .then(setPosts)
            .catch(() => setError("Failed to load posts."));
    }, [category, womenOnly]);

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await submitPostRequest(form);
            setSubmitted(true);
            setShowForm(false);
            setForm({ author_name: "", author_country: "", title: "", content: "", category: "general", is_women_specific: false });
        } catch {
            setError("Failed to submit post. Please try again.");
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Traveler Forum</h1>
                    <p className={styles.sub}>Moderated reviews and experiences from international travellers.</p>
                </div>
                <button className={styles.writeBtn} onClick={() => setShowForm(s => !s)}>
                    {showForm ? "Cancel" : "Share your experience"}
                </button>
            </div>

            {submitted && <div className={styles.successMsg}>✓ Your post has been submitted for review. Thank you!</div>}
            {error && <p className={styles.error}>{error}</p>}

            {showForm && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h2>Share your experience</h2>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label>Your name *</label>
                            <input required value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} placeholder="e.g. Sarah M." />
                        </div>
                        <div className={styles.field}>
                            <label>Country</label>
                            <input value={form.author_country} onChange={e => setForm(f => ({ ...f, author_country: e.target.value }))} placeholder="e.g. United Kingdom" />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Title *</label>
                        <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="A brief title for your post" />
                    </div>
                    <div className={styles.field}>
                        <label>Your experience *</label>
                        <textarea required rows={5} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Share what you learned, tips, and your honest experience..." />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.field}>
                            <label>Category</label>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                {CATEGORIES.filter(c => c !== "all").map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                            </select>
                        </div>
                        <label className={styles.checkLabel}>
                            <input type="checkbox" checked={form.is_women_specific} onChange={e => setForm(f => ({ ...f, is_women_specific: e.target.checked }))} />
                            Women-specific post
                        </label>
                    </div>
                    <button type="submit" className={styles.submitBtn}>Submit post (for review)</button>
                </form>
            )}

            <div className={styles.filters}>
                {CATEGORIES.map(c => (
                    <button key={c} className={`${styles.filterBtn} ${category === c ? styles.filterActive : ""}`} onClick={() => setCategory(c)}>
                        {c === "all" ? "All posts" : c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                ))}
                <button className={`${styles.filterBtn} ${styles.filterWomen} ${womenOnly ? styles.filterActive : ""}`} onClick={() => setWomenOnly(w => !w)}>
                    🌸 Women's posts
                </button>
            </div>

            <div className={styles.posts}>
                {posts.length === 0 && <p className={styles.empty}>No posts found for this filter.</p>}
                {posts.map(post => (
                    <div key={post.id} className={`${styles.post} ${post.is_women_specific ? styles.postWomen : ""}`}>
                        <div className={styles.postHeader}>
                            <div>
                                <h3 className={styles.postTitle}>{post.title}</h3>
                                <div className={styles.postMeta}>
                                    <strong>{post.author_name}</strong>
                                    {post.author_country && <span>· {post.author_country}</span>}
                                    <span className={styles.catBadge}>{post.category}</span>
                                    {post.is_women_specific ? <span className={styles.womenTag}>Women</span> : null}
                                </div>
                            </div>
                            <span className={styles.date}>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        <p className={styles.postContent}>{post.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumPage;
