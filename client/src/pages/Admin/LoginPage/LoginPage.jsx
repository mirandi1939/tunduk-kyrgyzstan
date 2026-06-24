import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    setAdminAuth,
    fetchAllPlacesAdminRequest,
} from "../../../api/adminApi";

const AdminLoginPage = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        setAdminAuth(login, password);

        try {
            await fetchAllPlacesAdminRequest();
            navigate("/admin/places");
        } catch {
            sessionStorage.removeItem("adminAuth");
            setError("Invalid credentials");
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <h2>Admin Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Login"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>

            {error && <p>{error}</p>}
        </div>
    );
};

export default AdminLoginPage;
