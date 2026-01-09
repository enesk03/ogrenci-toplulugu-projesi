import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const BASE_URL = "https://localhost:7060";

    const handleLogin = (e) => {
        e.preventDefault();

        axios.post(`${BASE_URL}/api/auth/login`, { username, password })
            .then((res) => {
                console.log("Giriþ yapýldý:", res.data);
                localStorage.setItem("isAdmin", "true");
                localStorage.setItem("username", res.data.username);
                navigate("/admin");
            })
            .catch((err) => {
                console.error(err);
                setError("Kullanýcý adý veya þifre hatalý!");
            });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Yönetici Giriþi</h2>
                <p>Lütfen bilgilerinizi giriniz.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Kullanýcý Adý</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="admin"
                        />
                    </div>

                    <div className="form-group">
                        <label>Þifre</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                        />
                    </div>

                    <button type="submit" className="login-btn">Giriþ Yap</button>
                </form>
            </div>
        </div>
    );
}

export default Login;