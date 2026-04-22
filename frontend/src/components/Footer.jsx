import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Footer.css";

function Footer() {
    const [texts, setTexts] = useState([]);

    useEffect(() => {
        api.get("/sitetexts")
            .then((res) => {
                setTexts(res.data.data ? res.data.data : res.data);
            })
            .catch((err) => console.error("Footer verileri çekilemedi:", err));
    }, []);

    const getText = (key, defaultValue) => {
        if (!texts || texts.length === 0) return defaultValue;
        const item = texts.find((t) => t.key === key);
        return item ? item.value : defaultValue;
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-col">
                    <h3>{getText('footer.title', 'KTÜN Topluluk')}</h3>
                    <p>
                        {getText('footer.description', 'Konya Teknik Üniversitesi öğrenci topluluklarının buluşma noktası. Etkinliklerden haberdar ol, aramıza katıl!')}
                    </p>
                </div>

                <div className="footer-col">
                    <h4>Hızlı Linkler</h4>
                    <ul>
                        <li><Link to="/">Ana Sayfa</Link></li>
                        <li><Link to="/hakkimizda">Hakkımızda</Link></li>
                        <li><Link to="/projeler">Projelerimiz</Link></li>
                        <li><Link to="/ekibimiz">Ekibimiz</Link></li>
                        <li><Link to="/mezunlar">Mezunlar</Link></li>
                        <li><Link to="/basvuru">Başvuru Yap</Link></li>
                        <li><Link to="/iletisim">İletişim</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>İletişim</h4>
                    <p>📍 {getText('contact.address', 'Gelişim Yerleşkesi, Konya')}</p>
                    <p>✉️ {getText('contact.email', 'topluluk@ktun.edu.tr')}</p>
                    <p>📞 {getText('contact.phone', '+90 332 123 45 67')}</p>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p>&copy; 2026 KTÜN Öğrenci Topluluğu.</p>
                    <span className="developer-credit">
                        Developed by <strong>Muhammed Enes KAYA</strong>
                    </span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;