import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                
                {/* 1. Kısım: Logo ve Açıklama */}
                <div className="footer-col">
                    <h3>KTÜN Topluluk</h3>
                    <p>
                        Konya Teknik Üniversitesi öğrenci topluluklarının buluşma noktası. 
                        Etkinliklerden haberdar ol, aramıza katıl!
                    </p>
                </div>

                {/* 2. Kısım: Hızlı Linkler */}
                <div className="footer-col">
                    <h4>Hızlı Linkler</h4>
                    <ul>
                        <li><Link to="/">Ana Sayfa</Link></li>
                        <li><Link to="/etkinlikler">Etkinlikler</Link></li>
                        <li><Link to="/basvuru">Başvuru Yap</Link></li>
                        <li><Link to="/iletisim">İletişim</Link></li>
                    </ul>
                </div>

                {/* 3. Kısım: İletişim */}
                <div className="footer-col">
                    <h4>İletişim</h4>
                    <p>📍 Gelişim Yerleşkesi, Konya</p>
                    <p>✉️ topluluk@ktun.edu.tr</p>
                    <p>📞 +90 332 123 45 67</p>
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