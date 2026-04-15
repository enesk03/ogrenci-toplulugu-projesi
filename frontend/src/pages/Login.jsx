import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const BASE_URL = "http://localhost:7060";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 1. İsteği gönderiyoruz
            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password
            });

            // 2. Veriyi ayıklıyoruz (Backend'den gelen yapıya göre)
            // AuthController'da doğrudan objeyi dönmüştük: { message, token, role, team }
            const resData = response.data;

            const token = resData.token;
            const role = resData.role;
            const team = resData.team;

            // 3. Token kontrolü ve Saklama
            if (token) {
                // Admin.jsx'in beklediği anahtar isimleriyle localStorage'a yazıyoruz
                localStorage.setItem("token", token);
                localStorage.setItem("adminRole", role || "Admin");
                localStorage.setItem("adminTeam", team || "Genel");

                console.log("✅ Giriş Başarılı! Admin paneline geçiliyor...");
                navigate("/admin");
            } else {
                setError("Hata: Sunucudan anahtar (token) alınamadı.");
            }

        } catch (err) {
            console.error("❌ HATA:", err);

            if (err.code === "ERR_NETWORK") {
                setError("Sunucuya ulaşılamıyor! Backend (7060 portu) çalışıyor mu?");
            } else if (err.response) {
                // Backend'den gelen 401 veya 400 hataları
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

                {/* Hata Mesajı */}
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