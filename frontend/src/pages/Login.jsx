import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                username,
                password
            });

            const resData = response.data;
            const token = resData.token;
            const role = resData.role;
            const team = resData.team;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("adminRole", role || "Admin");
                localStorage.setItem("adminTeam", team || "Genel");

                navigate("/admin");
            } else {
                setError("Hata: Sunucudan anahtar (token) alınamadı.");
            }

        } catch (err) {
            if (err.code === "ERR_NETWORK") {
                setError("Sunucuya ulaşılamıyor! Backend çalışıyor mu?");
            } else if (err.response) {
                setError(err.response.data.message || "Kullanıcı adı veya şifre hatalı.");
            } else {
                setError("Beklenmedik bir hata oluştu.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h2>Yönetici Girişi</h2>
                    <p>KTÜN Topluluk Yönetim Paneline hoş geldiniz.</p>
                </div>

                {error && (
                    <div className="error-msg">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Kullanıcı Adı</label>
                        <input
                            type="text"
                            placeholder="Kullanıcı adınızı girin"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="input-group">
                        <label>Şifre</label>
                        <input
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "KİMLİK DOĞRULANIYOR..." : "GİRİŞ YAP"}
                    </button>
                </form>

                <div className="login-footer">
                    &copy; 2026 KTÜN Öğrenci Toplulukları
                </div>
            </div>
        </div>
    );
}

export default Login;