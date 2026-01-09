import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";


function Navbar() {
    const [siteTitle, setSiteTitle] = useState("Öğrenci Topluluğu"); 
    const BASE_URL = "https://localhost:7060";

    useEffect(() => {
        axios.get(`${BASE_URL}/api/sitetexts`)
            .then((res) => {
                // Gelen listeden 'navbar.title' anahtarına sahip olanı bul
                const titleObj = res.data.data.find(t => t.key === 'navbar.title');
                if (titleObj) setSiteTitle(titleObj.value);
            })
            .catch((err) => console.error("Navbar başlığı çekilemedi:", err));
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-left">
               
                <span className="site-title">{siteTitle}</span>
            </div>

            <ul className="navbar-links">
                <li><Link to="/">Ana Sayfa</Link></li>
                <li><Link to="/hakkimizda">Hakkımızda</Link></li>
                <li><Link to="/etkinlikler">Etkinlikler</Link></li>
                <li><Link to="/uyeler">Üyeler</Link></li>
                <li><Link to="/iletisim">İletişim</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;