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

    const BASE_URL = "https://localhost:7060";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("İstek gönderiliyor...", { username, password });

            const response = await axios.post(`${BASE_URL}/api/auth/login`, {
                username,
                password
            });

            console.log("Backend Cevabı:", response.data);

       
            const responseData = response.data.data ? response.data.data : response.data;

            const token = responseData.token || responseData.Token || responseData.accessToken || responseData.jwt;
            const role = responseData.role || responseData.Role || "Admin"; 
            const team = responseData.team || responseData.Team || "Yönetim";

         
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("adminRole", role);
                localStorage.setItem("adminTeam", team);
                
                console.log("✅ Giriş Başarılı! Yönlendiriliyor...");
                navigate("/admin");
            } else {
                console.warn("⚠️ Token bulunamadı. Backend yanıtını inceleyin.");
                // Backend'den gelen tam yanıtı ekrana basarak sorunu görelim
                setError("Giriş başarılı ancak Token alınamadı. Gelen veri: " + JSON.stringify(responseData));
            }

        } catch (err) {
            console.error("❌ HATA:", err);

            if (err.code === "ERR_NETWORK") {
                setError("Sunucuya ulaşılamıyor! Backend çalışıyor mu? (Port 7060)");
            } else if (err.response) {
                // Sunucudan gelen hata mesajı (400, 401 vb.)
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
                    <p>Lütfen devam etmek için kimliğinizi doğrulayın.</p>
                </div>

                {/* Hata Mesajı Kutusu */}
                {error && <div className="error-msg" style={{wordBreak: "break-word"}}>{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Kullanıcı Adı</label>
                        <input 
                            type="text" 
                            placeholder="Örn: admin" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
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
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? "GİRİŞ YAPILIYOR..." : "GİRİŞ YAP"}
                    </button>
                </form>

                <div className="login-footer">
                    &copy; 2026 KTÜN Öğrenci Topluluğu Yönetim Paneli
                </div>
            </div>
        </div>
    );
}

export default Login;