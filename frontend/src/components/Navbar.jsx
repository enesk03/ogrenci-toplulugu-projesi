import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./Navbar.css";

function Navbar() {
    const [siteTitle, setSiteTitle] = useState("TEKNOLAB");

    useEffect(() => {
        api.get("/sitetexts")
            .then((res) => {
                const dataList = res.data.data ? res.data.data : res.data;
                const titleObj = dataList.find(t => t.key === 'navbar.title');
                if (titleObj) setSiteTitle(titleObj.value);
            })
            .catch((err) => console.error("Navbar başlığı çekilemedi:", err));
    }, []);

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <span className="navbar-title">{siteTitle}</span>
            </Link>

            <ul className="navbar-links">
                <li><Link to="/">Ana Sayfa</Link></li>
                <li><Link to="/hakkimizda">Hakkımızda</Link></li>
                <li><Link to="/projeler">Projelerimiz</Link></li>
                <li><Link to="/uyeler">Üyeler</Link></li>
                <li><Link to="/mezunlar">Mezunlarımız</Link></li>
                <li><Link to="/basvuru">Başvuru Yap</Link></li>
                <li><Link to="/iletisim">İletişim</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;